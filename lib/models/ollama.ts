// ai-sdk-ollama is offically provided by AI SDK to support Ollama models
import { createOllama } from 'ollama-ai-provider';

const ollama = createOllama({
  baseURL: 'http://localhost:11434',
});

export const ollamaModel = ollama('llama3');