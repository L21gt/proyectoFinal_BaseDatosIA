// src/ai/chatModel.ts
import { ChatOllama } from "@langchain/ollama";
import dotenv from 'dotenv';

dotenv.config();

// Modelo conversacional (para redactar la respuesta final)
export const chatModel = new ChatOllama({
  model: process.env.OLLAMA_CHAT_MODEL || "llama3.2:1b",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  temperature: 0.3 // Un poco de creatividad para redactar mejor
});

// Modelo estructurado (para el clasificador)
export const jsonChatModel = new ChatOllama({
  model: process.env.OLLAMA_CHAT_MODEL || "llama3.2:1b",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  temperature: 0,
  format: "json" // Obligado a usar JSON
});