// src/lib/supabase.js

// Importar cliente de Supabase
import { createClient } from "@supabase/supabase-js";

// Obtener credenciales de variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validar que las credenciales existen
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials in .env.local");
}

// Crear y exportar cliente
// Este cliente se usará en todos los componentes
export const supabase = createClient(supabaseUrl, supabaseKey);
