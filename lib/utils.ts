import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { openAIModel } from "@/lib/models/openai";
import { ollamaModel } from "@/lib/models/ollama";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

export function selectModel(modelName: string) {
  if (modelName === 'ollama') {
    return ollamaModel;
  } else {
    return openAIModel;
  }
}