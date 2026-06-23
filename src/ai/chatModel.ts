// src/ai/chatModel.ts
import { ChatOllama } from "@langchain/ollama";
import dotenv from 'dotenv';

dotenv.config();

// Nota técnica: Se configura ChatOllama con temperatura 0 para que la clasificación sea determinista y precisa.
export const chatModel = new ChatOllama({
  model: process.env.OLLAMA_CHAT_MODEL || "llama3.2:1b",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  temperature: 0, 
  format: "json" // Forzamos al modelo a devolver JSON válido
});