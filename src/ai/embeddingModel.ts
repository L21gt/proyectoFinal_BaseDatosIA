// src/ai/embeddingModel.ts
import { OllamaEmbeddings } from "@langchain/ollama";
import dotenv from 'dotenv';

dotenv.config();

export const embeddings = new OllamaEmbeddings({
  model: process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
});