// src/routes/documentRoutes.ts
import { Router, Request, Response } from "express";
import multer from "multer";
import { ingestTextDocument } from "../services/documentIngestionService";

const router = Router();
// Se utiliza almacenamiento en memoria como solicita el requerimiento
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/documents/ingest
router.post("/ingest", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    
    // Validaciones
    if (!file) {
      res.status(400).json({ error: "Archivo no proporcionado" });
      return;
    }
    if (file.mimetype !== "text/plain") {
      res.status(400).json({ error: "Solo se permiten archivos .txt" });
      return;
    }

    // Lectura UTF-8
    const content = file.buffer.toString("utf-8");
    if (!content.trim()) {
      res.status(400).json({ error: "El archivo está vacío" });
      return;
    }

    const { title, category, tags } = req.body;

    const chunksGuardados = await ingestTextDocument(content, file.originalname, title, category, tags);

    res.status(201).json({
      message: "Documento procesado e ingerido exitosamente",
      chunks: chunksGuardados
    });
  } catch (error) {
    console.error("Error en la ingesta:", error);
    res.status(500).json({ error: "Error interno al procesar el documento" });
  }
});

export default router;