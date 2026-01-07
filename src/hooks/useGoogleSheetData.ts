import { useState, useEffect, useCallback, useRef } from "react";
import { Team, Agent } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

interface NewSale {
  agentName: string;
  entryDate: string;
  value: number;
}

interface SheetResponse {
  teams: Team[];
  newSales: NewSale[];
}

interface SaleChange {
  agent: Agent;
  amount: number;
}

export const useGoogleSheetData = (pollInterval: number = 10000) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saleChange, setSaleChange] = useState<SaleChange | null>(null);
  
  // Usamos un Set para recordar IDs de ventas ya procesadas
  const processedSalesRef = useRef<Set<string>>(new Set());
  // Flag para ignorar las ventas que ya existen al abrir la página por primera vez
  const isFirstLoad = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const { data: responseData, error: invokeError } = await supabase.functions.invoke('google-sheets-proxy');
      
      if (invokeError) throw new Error(invokeError.message);

      let teamsData: Team[] = [];
      let newSalesData: NewSale[] = [];
      
      // Normalización de respuesta
      if (responseData && responseData.teams) {
        teamsData = responseData.teams;
        newSalesData = responseData.newSales || [];
      } else if (Array.isArray(responseData)) {
        teamsData = responseData;
      }

      // Lógica de detección de Jackpot
      let detectedChange: SaleChange | null = null;
      
      // Procesamos las ventas recientes
      if (newSalesData.length > 0) {
        for (const sale of newSalesData) {
          // ID Único: Agente + Fecha exacta (incluyendo hora si la hay) + Valor
          const saleId = `${sale.agentName}-${sale.entryDate}-${sale.value}`;
          
          if (!processedSalesRef.current.has(saleId)) {
            // Es una venta nueva que no hemos visto en esta sesión
            processedSalesRef.current.add(saleId);
            
            // Si NO es la carga inicial, preparamos la fiesta
            if (!isFirstLoad.current) {
              const foundAgent = teamsData
                .flatMap(t => t.agents)
                .find(a => a.name.toLowerCase().trim() === sale.agentName.toLowerCase().trim());
              
              if (foundAgent && sale.value > 0) {
                // ¡Encontramos al ganador!
                detectedChange = { agent: foundAgent, amount: sale.value };
                // Hacemos break para celebrar una a la vez por ciclo de polling
                break; 
              }
            }
          }
        }
      }
      
      // Desactivamos el flag de primera carga después del primer proceso exitoso
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        console.log("Carga inicial completada. Sistema listo para nuevas ventas.");
      } else if (detectedChange) {
        console.log("¡Nueva venta detectada!", detectedChange);
        setSaleChange(detectedChange);
      }
      
      setTeams(teamsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching sheet data:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSaleChange = useCallback(() => {
    setSaleChange(null);
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Polling (Ciclo de actualización)
  useEffect(() => {
    const interval = setInterval(fetchData, pollInterval);
    return () => clearInterval(interval);
  }, [fetchData, pollInterval]);

  return { teams, setTeams, loading, error, saleChange, clearSaleChange, refetch: fetchData };
};