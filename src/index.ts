// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import documentRoutes from './routes/documentRoutes';
import queryRoutes from './routes/queryRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// Registro de rutas solicitadas 
app.use('/api/documents', documentRoutes);
app.use('/api/query', queryRoutes);

// Manejo de errores globales 
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error global capturado:", err.stack);
  res.status(500).json({ error: "Ocurrió un error inesperado en el servidor." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend inteligente corriendo en http://localhost:${PORT}`);
});