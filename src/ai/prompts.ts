// src/ai/prompts.ts
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const classificationPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You are a strict JSON data extractor.

RULES FOR "source":
- If question contains "qué decir", "prospecto", "tiempo", "guion" -> source MUST be "rag".
- If question contains "campañas", "activas", "agentes" -> source MUST be "database".

EXAMPLE FOR RAG QUESTION ("Que debo decir si el prospecto dice que no tiene tiempo?"):
{{
  "source": "rag",
  "intent": "find script",
  "confidence": 0.9,
  "entities": {{
    "table": null,
    "leadStatus": null,
    "interestLevel": null,
    "agentName": null,
    "campaignStatus": null,
    "documentTopic": "objections"
  }}
}}

FORMAT INSTRUCTIONS:
{format_instructions}`],
  ["human", "{question}"]
]);

export const answerPrompt = ChatPromptTemplate.fromMessages([
  ["system", `Eres un asistente de call center. 
  
Contexto Base de Datos: {databaseContext}
Contexto Documentos: {documentContext}

REGLA ESTRICTA: Responde basándote SOLO en los contextos. Si los contextos están vacíos o dicen "error", DEBES responder EXACTAMENTE: "No tengo contexto suficiente para responder." NO inventes información, no repitas frases.`],
  ["human", "{question}"]
]);