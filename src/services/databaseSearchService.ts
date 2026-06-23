// src/services/databaseSearchService.ts
import { supabaseClient } from "../db/supabaseClient";
import { IntentClassification } from "../types/query";

// Nota técnica: Se restringe la consulta estrictamente usando los métodos de Supabase, evitando SQL injection o alucinaciones del LLM [cite: 186-187].
export const searchDatabase = async (classification: IntentClassification): Promise<any> => {
  const { entities } = classification;
  
  if (!entities.table) {
    return { error: "No se identificó una tabla para consultar." };
  }

  let query = supabaseClient.from(entities.table).select("*");

  // Casos controlados requeridos por la rúbrica [cite: 188-194]
  if (entities.table === "campaigns" && entities.campaignStatus) {
    query = query.eq("status", entities.campaignStatus);
  }
  
  if (entities.table === "leads") {
    if (entities.interestLevel) query = query.eq("interest_level", entities.interestLevel);
    if (entities.leadStatus) query = query.eq("status", entities.leadStatus);
  }

  if (entities.table === "calls") {
    // Si la intención busca un resultado específico de llamada (ej. scheduled_follow_up)
    if (classification.intent.includes("scheduled_follow_up")) {
      query = query.eq("result", "scheduled_follow_up");
    }
  }

  const { data, error } = await query.limit(10); // Límite por seguridad

  if (error) {
    console.error("Error en base de datos:", error);
    return { error: error.message };
  }

  return data || [];
};