// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import documentRoutes from './routes/documentRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// Registrar rutas de documentos
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});