import { z } from 'zod';

// Schema de validación para variables de entorno
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL debe ser una URL válida'),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, 'VITE_SUPABASE_PUBLISHABLE_KEY no puede estar vacío'),
});

// Validar variables de entorno
const parseEnv = () => {
  try {
    return envSchema.parse({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => e.path.join('.')).join(', ');
      const errorMessage = `❌ Error de configuración: Faltan o son inválidas las siguientes variables de entorno: ${missingVars}`;
      console.error(errorMessage);
      console.error('Detalles:', error.errors);
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Exportar variables validadas
export const env = parseEnv();
