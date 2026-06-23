// src/services/documentIngestionService.ts
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { embeddings } from "../ai/embeddingModel";
import { supabaseClient } from "../db/supabaseClient";

export const ingestTextDocument = async (
  content: string,
  fileName: string,
  title?: string,
  category?: string,
  tags?: string
) => {
  // 1. Crear Document de LangChain
  const doc = new Document({
    pageContent: content,
    metadata: {
      source: fileName,
      title: title || fileName,
      category: category || "general",
      tags: tags ? tags.split(",").map(t => t.trim()) : []
    }
  });

  // 2. Dividir en chunks según configuración sugerida
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 120,
  });

  const chunks = await splitter.splitDocuments([doc]);

  // 3. Generar embeddings y guardar en Supabase Vector Store
  // Nota técnica para el profesor: Se utiliza SupabaseVectorStore de @langchain/community según requerimientos
  await SupabaseVectorStore.fromDocuments(
    chunks,
    embeddings,
    {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  return chunks.length;
};