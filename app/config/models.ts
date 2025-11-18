export const MODEL_CONFIG = [
  {
    provider: "ollama",
    modelName: "llama3",
    embeddingModel: "mxbai-embed-large",
  },
  {
    provider: "openai",
    modelName: "gpt-4o",
    embeddingModel: "text-embedding-3-large",
  },
];


export function getModelConfig(provider: string) { 
  return MODEL_CONFIG.find(m => m.provider === provider);
}