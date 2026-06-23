// src/ai/intentClassifier.ts
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { IntentClassification } from "../types/query";
import { jsonChatModel } from "./chatModel";
import { classificationPrompt } from "./prompts";

// 1. Definir el esquema estricto con Zod, haciendo las entidades opcionales
const intentSchema = z.object({
  source: z.enum(["database", "rag", "hybrid", "general", "unsupported"]),
  intent: z.string().describe("Descripción breve de lo que busca el usuario"),
  confidence: z.number().min(0).max(1),
  entities: z.object({
    table: z.enum(["agents", "campaigns", "leads", "calls"]).nullable().optional(),
    leadStatus: z.string().nullable().optional(),
    interestLevel: z.string().nullable().optional(),
    agentName: z.string().nullable().optional(),
    campaignStatus: z.string().nullable().optional(),
    documentTopic: z.string().nullable().optional()
  }).default({})
});

// 2. Crear el parser de LangChain
const parser = StructuredOutputParser.fromZodSchema(intentSchema);

export const classifyQuestion = async (question: string): Promise<IntentClassification> => {
  const chain = classificationPrompt.pipe(jsonChatModel).pipe(parser);
  
  try {
    const response = await chain.invoke({
      question: question,
      format_instructions: parser.getFormatInstructions()
    });
    
    // Garantizamos que las entidades existan aunque el modelo no las envíe
    const entities = {
      table: response.entities?.table || null,
      leadStatus: response.entities?.leadStatus || null,
      interestLevel: response.entities?.interestLevel || null,
      agentName: response.entities?.agentName || null,
      campaignStatus: response.entities?.campaignStatus || null,
      documentTopic: response.entities?.documentTopic || null
    };

    return { ...response, entities } as IntentClassification;
  } catch (error) {
    console.error("Error clasificando la intención:", error);
    return {
      source: "unsupported",
      intent: "error_parsing",
      confidence: 0,
      entities: { table: null, leadStatus: null, interestLevel: null, agentName: null, campaignStatus: null, documentTopic: null }
    };
  }
};