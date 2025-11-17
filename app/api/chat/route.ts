import { createResource } from '@/lib/actions/resources';
import { deepinfra } from '@ai-sdk/deepinfra';
import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
  stepCountIs,
} from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';
import { selectModel } from '@/lib/utils';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;



const LLAMA_MODEL = deepinfra('');
/**
the sequence flow with tools is:
messages → OpenAI model → model decides → returns tool call → SDK runs tool.execute()
-----  
User Messages
     ↓
convertToModelMessages(messages)
     ↓
streamText({
  model,
  messages,
  tools: { ... }
})
     ↓
MODEL THINKS
(“Should I call a tool?”)
     ↓
If yes → Model returns:
{
  "toolCall": {
      "name": "getInformation",
      "arguments": { "question": "..." }
  }
}
     ↓
Vercel AI SDK sees this → automatically calls:
tools.getInformation.execute(args)
     ↓
Your execute() function returns result
     ↓
Result is inserted back into AI conversation as:
{
  "role": "tool",
  "name": "getInformation",
  "content": ".... result ...."
}
     ↓
Model receives tool result and continues generating the final answer

 */
export async function POST(req: Request) {
  const { messages, metadata }: { messages: UIMessage[] , metadata?: any} = await req.json();
  console.log('Incoming messages:', JSON.stringify(messages, null, 2));  
  const lastMessage = messages[messages.length - 1];
  console.log('Last message parts:', lastMessage)
  // const modelSelectionPart = lastMessage.parts.find(
  //   part => part.type === 'model-selection'
  // );
  // const selectedModel = modelSelectionPart?.metadata?.model || 'gpt-4o';

  // Destructure your custom data property
  const { selectedModelName } = metadata as { selectedModelName?: string };
  console.log('[DEBUG] Selected model from message metadata:', selectedModelName);
  const result = streamText({
    model: selectModel('ollama'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know. There is no relevant infomration in my knowledge base."`,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        inputSchema: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => { 
          console.log('[DEBUG]route.ts.POST.tool.addResource with content:', { content });
          const reps = await createResource({ content })
          console.log('[DEBUG]route.ts.POST.tool.addResource result:', { reps });
        },
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => {
          console.log('[DEBUG]route.ts.POST.tool.getInformation with content:', { question });
          const result = await findRelevantContent(question);
          console.log('[DEBUG]route.ts.POST.tool.getInformation returns:', result);
          return result;
        }
      }),
    },
    onError: (error) => {
      console.error('[DEBUG][POST] Error during AI processing:', error);
    }
  });

  return result.toUIMessageStreamResponse();
}