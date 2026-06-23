// src/ai/prompts.ts
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const classificationPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You are a strict JSON data extractor. Return EXACTLY the structure of these examples.

EXAMPLE 1 ("¿Qué campañas activas están disponibles?"):
{{ "source": "database", "intent": "active campaigns", "confidence": 0.9, "entities": {{ "table": "campaigns", "leadStatus": null, "interestLevel": null, "agentName": null, "campaignStatus": "active", "documentTopic": null }} }}

EXAMPLE 2 ("¿Qué debo decir si el prospecto dice que no tiene tiempo?"):
{{ "source": "rag", "intent": "find script", "confidence": 0.9, "entities": {{ "table": null, "leadStatus": null, "interestLevel": null, "agentName": null, "campaignStatus": null, "documentTopic": "objections" }} }}

EXAMPLE 3 ("Que prospectos de alto interes necesitan seguimiento y que guion debo usar?"):
{{ "source": "hybrid", "intent": "prospects and script", "confidence": 0.9, "entities": {{ "table": "leads", "leadStatus": null, "interestLevel": "alto", "agentName": null, "campaignStatus": null, "documentTopic": "guion" }} }}

EXAMPLE 4 ("Explicame que es un prospecto de ventas."):
{{ "source": "general", "intent": "explain", "confidence": 0.9, "entities": {{ "table": null, "leadStatus": null, "interestLevel": null, "agentName": null, "campaignStatus": null, "documentTopic": null }} }}

FORMAT INSTRUCTIONS:
{format_instructions}`],
  ["human", "{question}"]
]);

export const answerPrompt = ChatPromptTemplate.fromMessages([
  ["system", `Eres un asistente de call center. 
Datos: {databaseContext}
Docs: {documentContext}
Responde la pregunta basándote en la información.`],
  ["human", "{question}"]
]);