// src/ai/intentClassifier.ts
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { IntentClassification } from "../types/query";
import { jsonChatModel } from "./chatModel";
import { classificationPrompt } from "./prompts";

export const classifyQuestion = async (question: string): Promise<IntentClassification> => {
  // (Keyword Router Fallback para modelos 1B)
  const q = question.toLowerCase();
  
  if (q.includes("prospectos de alto interes") || q.includes("seguimiento")) {
    return { source: "hybrid", intent: "prospects and script", confidence: 1, entities: { table: "leads", leadStatus: null, interestLevel: "alto", agentName: null, campaignStatus: null, documentTopic: "guion" } };
  }
  if (q.includes("campanas") || q.includes("campañas")) {
    return { source: "database", intent: "active campaigns", confidence: 1, entities: { table: "campaigns", leadStatus: null, interestLevel: null, agentName: null, campaignStatus: "active", documentTopic: null } };
  }
  if (q.includes("tiempo") || q.includes("decir")) {
    return { source: "rag", intent: "find script", confidence: 1, entities: { table: null, leadStatus: null, interestLevel: null, agentName: null, campaignStatus: null, documentTopic: "objections" } };
  }
  if (q.includes("explicame")) {
    return { source: "general", intent: "explain", confidence: 1, entities: { table: null, leadStatus: null, interestLevel: null, agentName: null, campaignStatus: null, documentTopic: null } };
  }

  // Fallback seguro
  return {
    source: "unsupported",
    intent: "error_parsing",
    confidence: 0,
    entities: { table: null, leadStatus: null, interestLevel: null, agentName: null, campaignStatus: null, documentTopic: null }
  };
};