import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Leer URL del Apps Script desde variable de entorno
const APPS_SCRIPT_URL = Deno.env.get('APPS_SCRIPT_URL') || 
  "https://script.google.com/macros/s/AKfycbxIsEEFQefXl9YAccQ3oJj99F-EIXhoTdHD6idvf_YkrlSurzlPvY1JVL6vLRo-VwMmUw/exec";

// Leer orígenes permitidos desde variable de entorno (separados por coma)
// Si no está configurado, usa '*' como fallback (menos seguro pero funcional)
const allowedOrigins = Deno.env.get('ALLOWED_ORIGINS')?.split(',') || ['*'];

// Función para obtener el origen permitido basado en el request
const getCorsOrigin = (requestOrigin: string | null): string => {
  if (allowedOrigins.includes('*')) {
    return '*';
  }
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }
  // Si no coincide, devolver el primer origen permitido o '*'
  return allowedOrigins[0] || '*';
};

const getCorsHeaders = (requestOrigin: string | null) => ({
  'Access-Control-Allow-Origin': getCorsOrigin(requestOrigin),
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
});

serve(async (req) => {
  const requestOrigin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(requestOrigin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Fetching data from Google Apps Script...");
    
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'GET',
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Apps Script responded with status: ${response.status}`);
    }

    const text = await response.text();
    console.log("Response received, length:", text.length);
    
    // Validate JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Invalid JSON response:", text.substring(0, 200));
      throw new Error("La respuesta del Apps Script no es JSON válido");
    }

    console.log("Successfully parsed data, teams:", data.length);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error in google-sheets-proxy:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
