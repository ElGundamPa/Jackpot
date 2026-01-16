import { useState, useEffect, useCallback, useRef } from "react";
import { Team, Agent } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { getAgentConfigs, getAvailableTeams } from "@/services/agentConfigService";

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

interface TestSale {
  agentName: string;
  amount: number;
  timestamp: number;
}

export const useGoogleSheetData = (pollInterval: number = 10000) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saleChange, setSaleChange] = useState<SaleChange | null>(null);
  
  // Usamos un Map para recordar IDs de ventas ya procesadas con sus timestamps
  // Map<saleId, timestamp> para mantener orden de inserción y poder limpiar los más antiguos
  const processedSalesRef = useRef<Map<string, number>>(new Map());
  // Flag para ignorar las ventas que ya existen al abrir la página por primera vez
  const isFirstLoad = useRef(true);
  // Set para recordar timestamps de ventas de prueba ya procesadas para jackpot
  const processedTestSaleTimestamps = useRef<Set<number>>(new Set());
  
  // Constante para limitar el tamaño del Map y evitar memory leak
  const MAX_PROCESSED_SALES = 1000;

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

      // Aplicar ventas de prueba desde localStorage (solo para testing)
      // IMPORTANTE: No limpiamos las ventas de prueba aquí para permitir múltiples pruebas
      const testSaleChanges: SaleChange[] = [];
      try {
        const testSales = JSON.parse(localStorage.getItem('test_sales') || '[]');
        console.log(`🔍 Ventas de prueba en localStorage: ${testSales.length}`);
        if (testSales.length > 0) {
          const processedSales: TestSale[] = [];
          testSales.forEach((testSale: TestSale) => {
            // Verificar si esta venta de prueba ya fue procesada para jackpot
            const wasProcessedForJackpot = processedTestSaleTimestamps.current.has(testSale.timestamp);
            
            console.log(`🔎 Procesando venta de prueba: ${testSale.agentName} - $${testSale.amount} (timestamp: ${testSale.timestamp})`);
            console.log(`   - isFirstLoad: ${isFirstLoad.current}`);
            console.log(`   - wasProcessedForJackpot: ${wasProcessedForJackpot}`);
            
            let found = false;
            let foundAgent: Agent | null = null;
            // Buscar el agente en los teams y agregar la venta
            teamsData.forEach(team => {
              const agent = team.agents.find(a => 
                a.name.toLowerCase().trim() === testSale.agentName.toLowerCase().trim()
              );
              if (agent) {
                agent.sales += testSale.amount;
                team.total_real = (team.total_real || 0) + testSale.amount;
                found = true;
                foundAgent = agent;
                console.log(`✅ Venta de prueba aplicada al total: ${testSale.agentName} +$${testSale.amount.toLocaleString()}`);
              }
            });
            if (found && foundAgent) {
              // Si es una venta nueva (no procesada para jackpot), agregarla a los cambios
              if (!wasProcessedForJackpot && !isFirstLoad.current) {
                testSaleChanges.push({ agent: foundAgent, amount: testSale.amount });
                processedTestSaleTimestamps.current.add(testSale.timestamp);
                processedSales.push(testSale); // Solo agregar a processedSales si se procesó para jackpot
                console.log(`🎬 Venta de prueba agregada a cambios (disparará animación): ${testSale.agentName} +$${testSale.amount.toLocaleString()}`);
              } else if (wasProcessedForJackpot) {
                // Si ya fue procesada para jackpot, solo actualizar el total pero no disparar animación
                processedSales.push(testSale);
                console.log(`ℹ️ Venta de prueba ya procesada para jackpot: ${testSale.agentName} (solo actualizando total)`);
              } else {
                // Primera carga - solo actualizar el total sin disparar animación
                // NO agregar a processedSales para que se pueda procesar después
                console.log(`⏸️ Primera carga - venta de prueba aplicada sin animación: ${testSale.agentName} (se procesará en el siguiente fetch)`);
              }
            } else {
              console.warn(`⚠️ Agente "${testSale.agentName}" no encontrado en los datos de Google Sheets`);
            }
          });
          
          // Remover solo las ventas que fueron procesadas para jackpot (para permitir re-testing)
          // Mantener las ventas que no se procesaron para jackpot en localStorage
          if (processedSales.length > 0) {
            const remainingSales = testSales.filter((sale: TestSale) => 
              !processedSales.some(ps => ps.timestamp === sale.timestamp)
            );
            localStorage.setItem('test_sales', JSON.stringify(remainingSales));
            if (remainingSales.length < testSales.length) {
              console.log(`🗑️ ${testSales.length - remainingSales.length} venta(s) de prueba procesada(s) y removida(s) de localStorage`);
            }
          }
        }
      } catch (e) {
        console.warn('Error procesando ventas de prueba:', e);
      }

      // IMPORTANTE: Solo procesamos agentes que vienen de Google Sheets
      // Los agentes agregados solo en el dashboard de admin NO aparecerán en la página principal
      // La configuración de localStorage solo se usa para:
      // - Cambiar el equipo de agentes existentes
      // - Cambiar la foto y canción de agentes existentes
      
      // Reorganizar equipos según la configuración guardada en localStorage
      // Esto permite que los cambios de equipo en el dashboard de admin se reflejen
      const agentConfigs = getAgentConfigs();
      const availableTeams = getAvailableTeams();
      
      // Crear un mapa de todos los agentes desde todos los equipos ANTES de reorganizar
      // SOLO incluye agentes que vienen de Google Sheets (teamsData)
      const allAgents: Agent[] = [];
      teamsData.forEach(team => {
        team.agents.forEach(agent => {
          allAgents.push(agent);
        });
      });

      // Lógica de detección de Jackpot (buscar en allAgents, no en teamsData reorganizado)
      const detectedChanges: SaleChange[] = [];
      
      // Log para debugging
      console.log(`🔍 Verificando nuevas ventas: ${newSalesData.length} ventas encontradas`);
      console.log(`📊 Estado: isFirstLoad=${isFirstLoad.current}, allAgents=${allAgents.length}`);
      
      // Procesamos las ventas recientes
      if (newSalesData.length > 0) {
        for (const sale of newSalesData) {
          // Normalizar nombres para comparación
          const normalizedSaleName = sale.agentName.toLowerCase().trim();
          
          // ID Único: Agente + Fecha exacta (incluyendo hora si la hay) + Valor
          // NO incluir timestamp aquí porque causaría que la misma venta se marque como nueva en cada fetch
          const saleId = `${normalizedSaleName}-${sale.entryDate}-${sale.value}`;
          
          console.log(`🔎 Procesando venta: ${sale.agentName} - ${sale.entryDate} - $${sale.value}`);
          console.log(`   SaleId: ${saleId}`);
          console.log(`   Ya procesada: ${processedSalesRef.current.has(saleId)}`);
          
          if (!processedSalesRef.current.has(saleId)) {
            // Es una venta nueva que no hemos visto en esta sesión
            // Guardamos el timestamp de cuando se agregó para poder limpiar los más antiguos
            processedSalesRef.current.set(saleId, Date.now());
            console.log(`✅ Venta nueva detectada: ${sale.agentName} - $${sale.value}`);
            
            // Limitar el tamaño del Map para evitar memory leak
            if (processedSalesRef.current.size > MAX_PROCESSED_SALES) {
              // Convertir a array y ordenar por timestamp (más antiguos primero)
              const sorted = Array.from(processedSalesRef.current.entries())
                .sort((a, b) => a[1] - b[1]);
              
              // Eliminar los 100 más antiguos
              const toRemove = sorted.slice(0, 100);
              toRemove.forEach(([id]) => processedSalesRef.current.delete(id));
              console.log(`🧹 Limpieza de memoria: eliminadas ${toRemove.length} ventas antiguas del Map`);
            }
            
            // Si NO es la carga inicial, preparamos la fiesta
            // Buscar en allAgents para encontrar el agente sin importar en qué equipo esté
            if (!isFirstLoad.current) {
              const foundAgent = allAgents.find(
                a => a.name.toLowerCase().trim() === normalizedSaleName
              );
              
              if (foundAgent) {
                console.log(`🎯 Agente encontrado: ${foundAgent.name} (ID: ${foundAgent.id})`);
                
                if (sale.value > 0) {
                  // ¡Encontramos al ganador!
                  console.log(`🎉 ¡JACKPOT! Agregando celebración para ${foundAgent.name} con $${sale.value}`);
                  detectedChanges.push({ agent: foundAgent, amount: sale.value });
                  // NO hacer break, continuar procesando las demás ventas nuevas
                } else {
                  console.warn(`⚠️ Valor de venta es 0 o negativo para ${foundAgent.name}`);
                }
              } else {
                console.warn(`❌ Agente "${sale.agentName}" no encontrado en allAgents`);
                console.log(`   Agentes disponibles:`, allAgents.map(a => a.name).join(', '));
              }
            } else {
              console.log(`⏸️ Carga inicial - saltando detección de jackpot para ${sale.agentName}`);
            }
          } else {
            console.log(`⏭️ Venta ya procesada anteriormente: ${sale.agentName}`);
          }
        }
      } else {
        console.log(`📭 No hay nuevas ventas en este momento`);
      }
      
      // Reorganizar agentes según la configuración guardada
      const reorganizedTeams: Team[] = availableTeams.map(teamConfig => {
        // Buscar el equipo original para mantener propiedades como goal, total_real, etc.
        const originalTeam = teamsData.find(t => t.id === teamConfig.id) || {
          id: teamConfig.id,
          name: teamConfig.name,
          goal: 50000,
          total_real: 0,
          agents: []
        };
        
        // Filtrar agentes que pertenecen a este equipo según la configuración
        // NOTA: allAgents solo contiene agentes de Google Sheets, así que todos los agentes
        // aquí ya existen en los datos. La configuración solo cambia su asignación de equipo.
        const teamAgents = allAgents.filter(agent => {
          const config = agentConfigs[agent.name];
          // Si hay configuración guardada, usar esa para asignar el equipo
          if (config && config.teamId) {
            return config.teamId === teamConfig.id;
          }
          // Si no hay configuración, mantener el equipo original del agente
          // Verificar si el agente está en el equipo original o si su teamId coincide
          return agent.teamId === teamConfig.id || originalTeam.agents.some(a => a.id === agent.id);
        });
        
        // Calcular total_real del equipo
        const total_real = teamAgents.reduce((sum, agent) => sum + agent.sales, 0);
        
        return {
          ...originalTeam,
          id: teamConfig.id,
          name: teamConfig.name,
          agents: teamAgents.map(agent => ({
            ...agent,
            teamId: teamConfig.id // Asegurar que el teamId esté actualizado
          })),
          total_real
        };
      });
      
      // Log para depuración
      if (Object.keys(agentConfigs).length > 0) {
        console.log("🔄 Equipos reorganizados según configuración:", reorganizedTeams.map(t => ({
          id: t.id,
          name: t.name,
          agentes: t.agents.map(a => a.name)
        })));
      }
      
      // Actualizar teamsData con la reorganización
      teamsData = reorganizedTeams;
      
      // Desactivamos el flag de primera carga después del primer proceso exitoso
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        console.log("✅ Carga inicial completada. Sistema listo para nuevas ventas.");
      } else {
        // Combinar ventas de prueba con ventas detectadas de Google Sheets
        const allChanges = [...detectedChanges, ...testSaleChanges];
        
        console.log(`📦 Cambios detectados: ${detectedChanges.length} de Google Sheets, ${testSaleChanges.length} de prueba`);
        
        if (allChanges.length > 0) {
          console.log(`🎊 ¡${allChanges.length} nueva(s) venta(s) detectada(s)!`, allChanges);
          
          // Procesar todas las ventas nuevas con un pequeño delay entre cada una
          // para evitar conflictos de estado y asegurar que la cola funcione correctamente
          allChanges.forEach((change, index) => {
            setTimeout(() => {
              console.log(`🚀 Disparando animación para ${change.agent.name} con $${change.amount}`);
              setSaleChange(change);
            }, index * 100); // 100ms de delay entre cada venta
          });
        } else {
          console.log(`ℹ️ No hay cambios nuevos para procesar en este momento`);
        }
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

  // Escuchar eventos de ventas de prueba desde la consola
  useEffect(() => {
    const handleTestSale = () => {
      // Asegurar que no estamos en primera carga cuando se procesa la venta de prueba
      if (isFirstLoad.current) {
        console.log('⚠️ Primera carga aún activa, desactivando para procesar venta de prueba...');
        isFirstLoad.current = false;
      }
      // Forzar refetch inmediato cuando se simula una venta
      console.log('🔄 Refetch inmediato por venta de prueba...');
      // Pequeño delay para asegurar que localStorage se haya actualizado
      setTimeout(() => {
        fetchData();
      }, 100);
    };

    const handleClearTestSales = () => {
      // Refetch cuando se limpian las ventas de prueba
      fetchData();
    };

    window.addEventListener('testSale', handleTestSale);
    window.addEventListener('clearTestSales', handleClearTestSales);
    return () => {
      window.removeEventListener('testSale', handleTestSale);
      window.removeEventListener('clearTestSales', handleClearTestSales);
    };
  }, [fetchData]);

  return { teams, setTeams, loading, error, saleChange, clearSaleChange, refetch: fetchData };
};