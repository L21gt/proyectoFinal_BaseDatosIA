// src/routes/queryRoutes.ts
import { Router, Request, Response } from "express";
import { handleQuery } from "../services/queryService";

const router = Router();

// POST /api/query [cite: 255]
// Nota técnica: Se expone el endpoint principal que recibe la pregunta y delega la lógica al queryService.
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "Debe proporcionar una pregunta válida en formato JSON." });
      return;
    }

    // Delegamos la lógica al orquestador principal
    const result = await handleQuery(question);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error procesando la consulta:", error);
    res.status(500).json({ error: "Error interno del servidor al procesar la consulta." });
  }
});

export default router;