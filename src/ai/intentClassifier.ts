// src/ai/intentClassifier.ts
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { IntentClassification } from "../types/query";
import { chatModel } from "./chatModel";
import { classificationPrompt } from "./prompts";

// 1. Definir el esquema estricto con Zod [cite: 158-174]
const intentSchema = z.object({
  source: z.enum(["database", "rag", "hybrid", "general", "unsupported"]),
  intent: z.string().describe("Descripción breve de lo que busca el usuario"),
  confidence: z.number().min(0).max(1),
  entities: z.object({
    table: z.enum(["agents", "campaigns", "leads", "calls"]).nullable(),
    leadStatus: z.string().nullable(),
    interestLevel: z.string().nullable(),
    agentName: z.string().nullable(),
    campaignStatus: z.string().nullable(),
    documentTopic: z.string().nullable()
  })
});

// 2. Crear el parser de LangChain [cite: 157-158]
const parser = StructuredOutputParser.fromZodSchema(intentSchema);

export const classifyQuestion = async (question: string): Promise<IntentClassification> => {
  // Nota técnica: Se inyectan las instrucciones de formato generadas dinámicamente por Zod en el prompt.
  const chain = classificationPrompt.pipe(chatModel).pipe(parser);
  
  try {
    const response = await chain.invoke({
      question: question,
      format_instructions: parser.getFormatInstructions()
    });
    
    return response as IntentClassification;
  } catch (error) {
    console.error("Error clasificando la intención:", error);
    // En caso de fallo (fallback), lo enviamos como unsupported por seguridad.
    return {
      source: "unsupported",
      intent: "error_parsing",
      confidence: 0,
      entities: { table: null, leadStatus: null, interestLevel: null, agentName: null, campaignStatus: null, documentTopic: null }
    };
  }
};