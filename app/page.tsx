'use client';

import { MODEL_CONFIG } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  // llama3 as the default model
  const [selectedModel, setSelectedModel] = useState('llama3.1:8b'); 
  /*
  * useChat({ api: "api/chat"}) // can specify api endpoint if not the default /api/chat
  * messages: array of message objects in the conversation
  * sendMessage: function to send a new message
  */
  const { messages, sendMessage } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">

      { /* --- Model Select Dropdown --- */}
      <div className="mb-4">
        <label className="mr-2 font-bold">Select Model:</label>
        <select
          className="border border-gary-300 rounded p-2"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          { /** Static Options */}
          { 
            MODEL_CONFIG.map((cfg) => (
              <option key={cfg.modelVersion} value={cfg.modelVersion}>
                {cfg.modelName}
              </option>
            ))
          }
        </select>
      </div>
      { /* --- Chat Message Render --- */}
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              {m.parts.map(part => {
                switch (part.type) {
                  case 'text':
                    return <p>{part.text}</p>;
                  case 'tool-addResource':
                  case 'tool-getInformation':
                    return (
                      <p>
                        call{part.state === 'output-available' ? 'ed' : 'ing'}{' '}
                        tool: {part.type}
                        <pre className="my-4 bg-zinc-100 p-2 rounded-sm">
                          {JSON.stringify(part.input, null, 2)}
                        </pre>
                      </p>
                    );
                }
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* --- Chat Input Form --- */}
      <form
        onSubmit={e => {
          e.preventDefault();
          // send model selection along with the text.
          sendMessage({
            text: input,
            // metadata so the backend knows which model to use
            metadata: {
             metadataType: 'model-selection',
             selectedModelName: selectedModel,
            },

          });
          setInput('');
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}