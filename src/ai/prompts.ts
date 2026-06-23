// src/ai/prompts.ts
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Nota técnica: El prompt especifica las categorías descritas en los requerimientos [cite: 175-185].
export const classificationPrompt = ChatPromptTemplate.fromMessages([
  ["system", `Eres el enrutador inteligente de un call center de ventas. Tu trabajo es analizar la pregunta del usuario y clasificar la intención en formato JSON.
  
Reglas de clasificación (source):
- "database": si piden datos exactos de prospectos, campañas, llamadas o agentes.
- "rag": si preguntan por guiones, objeciones, reglas o procedimientos.
- "hybrid": si necesitan datos estructurados Y guiones/documentos.
- "general": preguntas conceptuales genéricas.
- "unsupported": si intentan borrar datos (ej. "Borra todas las llamadas") o está fuera de alcance.

Categorías para "table" (solo si es database o hybrid): "agents", "campaigns", "leads", "calls", o null.

{format_instructions}`],
  ["human", "Pregunta: {question}"]
]);

// Este lo usaremos en la siguiente fase para generar la respuesta en español [cite: 152]
export const answerPrompt = ChatPromptTemplate.fromMessages([
  ["system", `Eres un asistente inteligente para un call center. Responde a la pregunta en español usando estrictamente el contexto proporcionado.
  
Contexto de Base de Datos: {databaseContext}
Contexto de Documentos (RAG): {documentContext}

Regla: No inventes información. Si el contexto no tiene la respuesta, indícalo educadamente.`],
  ["human", "Pregunta: {question}"]
]);