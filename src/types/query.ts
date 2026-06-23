// src/types/query.ts

// Tipos requeridos por las instrucciones [cite: 150]
export type QuerySource = "database" | "rag" | "hybrid" | "general" | "unsupported";

// Estructura de salida esperada para el clasificador [cite: 160-174]
export interface IntentClassification {
  source: QuerySource;
  intent: string;
  confidence: number;
  entities: {
    table: "agents" | "campaigns" | "leads" | "calls" | null;
    leadStatus: string | null;
    interestLevel: string | null;
    agentName: string | null;
    campaignStatus: string | null;
    documentTopic: string | null;
  };
}

// Estructura para devolver los documentos RAG
export interface DocumentResult {
  id: number;
  content: string;
  metadata: Record<string, any>;
  similarity: number;
}