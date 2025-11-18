import { openai } from '@ai-sdk/openai';

export function openAIModel(modelName: string) {
  return openai(modelName);
} // gpt-4o