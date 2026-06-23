// src/db/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Nota técnica: Se valida la existencia de las variables antes de inicializar el cliente.
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno de Supabase.');
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey);