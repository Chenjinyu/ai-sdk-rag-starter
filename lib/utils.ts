import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { openAIModel } from "@/lib/models/openai";
import { ollamaModel } from "@/lib/models/ollama";


export const MODEL_CONFIG = [
  {
    provider: "ollama",
    modelName: "LLaMA 3.1 8b",
    modelVersion: "llama3.1:8b",
    embeddingModel: "mxbai-embed-large:335m",
  },
  {
    provider: "openai",
    modelName: "GPT-4o (OpenAI)",
    modelVersion: "gpt-4o",
    embeddingModel: "text-embedding-3-large",
  },
  {
    provider: "Qwen",
    modelName: "Qwen 3 4B",
    modelVersion: "qwen3:4b",
    embeddingModel: "text-embedding-3-large",
  }
];


export function getModelConfig(provider: string) { 
  return MODEL_CONFIG.find(m => m.provider === provider);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");


export function selectModel(modelName: string){
  const cfg = MODEL_CONFIG.find(
    m => m.modelName === modelName || m.modelVersion === modelName
  );
  if (!cfg) {
    throw new Error(`Model not found: ${modelName}`);
  }
  const { provider, modelVersion, embeddingModel } = cfg;

  if (provider === 'openai') {
    return openAIModel(modelVersion);
  } else if (provider === 'ollama') {
    return ollamaModel(modelVersion);
  } else {
    throw new Error(`Unsupported provider: ${provider}`);
  }
}