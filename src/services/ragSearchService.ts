// src/services/ragSearchService.ts
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { embeddings } from "../ai/embeddingModel";
import { supabaseClient } from "../db/supabaseClient";
import { DocumentResult } from "../types/query";

export const searchDocuments = async (searchText: string): Promise<DocumentResult[]> => {
  // Nota técnica: Se inicializa el vector store mapeando la función match_documents requerida [cite: 229-233]
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "documents",
    queryName: "match_documents",
  });

  // Buscar los 4 documentos más relevantes [cite: 234]
  const relevantDocs = await vectorStore.similaritySearch(searchText, 4);

  return relevantDocs.map((doc, index) => ({
    id: index + 1,
    content: doc.pageContent,
    metadata: doc.metadata,
    similarity: 1 // SupabaseVectorStore devuelve los resultados ordenados por relevancia
  }));
};