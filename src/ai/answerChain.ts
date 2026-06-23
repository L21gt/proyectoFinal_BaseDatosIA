// src/ai/answerChain.ts
import { StringOutputParser } from "@langchain/core/output_parsers";
import { chatModel } from "./chatModel";
import { answerPrompt } from "./prompts";
import { IntentClassification } from "../types/query";

interface AnswerInput {
  question: string;
  classification: IntentClassification;
  databaseContext: string;
  documentContext: string;
}

export const generateAnswer = async (input: AnswerInput): Promise<string> => {
  // Nota técnica: Separación estricta de responsabilidades. Aquí solo se redacta [cite: 243-244].
  const chain = answerPrompt.pipe(chatModel).pipe(new StringOutputParser());

  try {
    const response = await chain.invoke({
      question: input.question,
      databaseContext: input.databaseContext || "No hay datos estructurados relevantes.",
      documentContext: input.documentContext || "No hay documentos internos relevantes."
    });

    return response;
  } catch (error) {
    console.error("Error generando la respuesta final:", error);
    return "Lo siento, ocurrió un error al generar la respuesta. Por favor intenta de nuevo.";
  }
};