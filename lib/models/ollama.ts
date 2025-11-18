// ai-sdk-ollama is offically provided by AI SDK to support Ollama models
import { createOllama } from 'ollama-ai-provider-v2';

const ollama = createOllama({
  baseURL: 'http://localhost:11434/api',
});

export function ollamaModel(modelName: string){ 
  return ollama(modelName);
}
