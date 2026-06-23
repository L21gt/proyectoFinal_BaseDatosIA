// src/services/queryService.ts
import { classifyQuestion } from "../ai/intentClassifier";
import { searchDatabase } from "./databaseSearchService";
import { searchDocuments } from "./ragSearchService";
import { generateAnswer } from "../ai/answerChain";

export const handleQuery = async (question: string) => {
  // 1 y 2. Recibir pregunta y clasificar [cite: 246-247]
  const classification = await classifyQuestion(question);

  // 3. Si source es unsupported [cite: 248]
  if (classification.source === "unsupported") {
    return {
      question,
      classification,
      answer: "Lo siento, tu solicitud no es segura o está fuera del alcance de mis funciones.",
      databaseResults: [],
      documentsUsed: []
    };
  }

  let databaseResults: any[] = [];
  let documentsUsed: any[] = [];

  // 4 y 6. Consultar base de datos (database o hybrid) [cite: 249, 251]
  if (classification.source === "database" || classification.source === "hybrid") {
    databaseResults = await searchDatabase(classification);
  }

  // 5 y 6. Consultar documentos (rag o hybrid) [cite: 250, 251]
  if (classification.source === "rag" || classification.source === "hybrid") {
    documentsUsed = await searchDocuments(question);
  }

  // 7. Construir contextos en texto para el LLM [cite: 252]
  const databaseContext = JSON.stringify(databaseResults);
  const documentContext = documentsUsed.map(doc => doc.content).join("\n\n");

  // 8. Generar respuesta final [cite: 253]
  // Nota técnica: Se omite la consulta si es 'general' ya que el contexto irá vacío.
  const answer = await generateAnswer({
    question,
    classification,
    databaseContext,
    documentContext
  });

  // 9. Devolver objeto final [cite: 254]
  return {
    question,
    classification,
    answer,
    databaseResults,
    documentsUsed
  };
};