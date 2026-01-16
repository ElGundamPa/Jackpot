import { useState, useEffect, useRef, useCallback } from "react";
import { useGoogleSheetData } from "@/hooks/useGoogleSheetData";
import { Agent } from "@/data/mockData";
import { 
  getTeamTheme, 
  getAgentPhoto, 
  getTeamIcon,
  getAgentCelebrationSong 
} from "@/config/agents.config";
import { CONFIG } from "@/config/constants";
import "@/utils/testUtils"; // Cargar utilidades de testing

// Componentes separados
import SpaceBackground from "@/components/SpaceBackground";
import StartScreen from "@/components/StartScreen";
import DashboardView from "@/components/DashboardView";
import JackpotOverlay from "@/components/JackpotOverlay";

interface QueuedSale {
  agent: Agent;
  amount: number;
}

const Index = () => {
  // --- ESTADO ---
  const { teams, loading, error, saleChange, clearSaleChange, refetch } = useGoogleSheetData(CONFIG.POLLING_INTERVAL);
  const [hasStarted, setHasStarted] = useState(false);
  const [jackpotActive, setJackpotActive] = useState(false);
  const [celebratingAgent, setCelebratingAgent] = useState<Agent | null>(null);
  const [saleAmount, setSaleAmount] = useState(0);
  
  // Referencias para Audio, Temporizador y Cola
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saleQueueRef = useRef<QueuedSale[]>([]);
  const isProcessingRef = useRef(false);

  // URL de canción por defecto
  const DEFAULT_SONG_URL = "https://assets.mixkit.co/active_storage/sfx/1934/1934-preview.mp3";

  // --- FUNCIÓN PARA PROCESAR LA COLA ---
  const processNextSale = useCallback(() => {
    // Si ya estamos procesando o no hay ventas en cola, salir
    if (isProcessingRef.current) {
      console.log(`⏸️ Ya hay una venta en procesamiento, esperando...`);
      return;
    }
    
    if (saleQueueRef.current.length === 0) {
      console.log(`📭 No hay ventas en la cola`);
      return;
    }

    const nextSale = saleQueueRef.current.shift();
    if (!nextSale) {
      console.log(`❌ Error: No se pudo obtener la siguiente venta de la cola`);
      return;
    }

    console.log(`🎬 Iniciando celebración para: ${nextSale.agent.name} - $${nextSale.amount}`);
    isProcessingRef.current = true;

    // Configurar datos de la celebración
    setCelebratingAgent(nextSale.agent);
    setSaleAmount(nextSale.amount);
    setJackpotActive(true);
    console.log(`✅ Jackpot activado para ${nextSale.agent.name}`);

        // Detener audio anterior si existe
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        }
        
        // Limpiar timers de fade out anteriores
        if (fadeOutTimerRef.current) {
          clearTimeout(fadeOutTimerRef.current);
          fadeOutTimerRef.current = null;
        }
        if (fadeOutIntervalRef.current) {
          clearInterval(fadeOutIntervalRef.current);
          fadeOutIntervalRef.current = null;
        }

        // Obtener URL y validar
        const songUrl = getAgentCelebrationSong(nextSale.agent.name);
        console.log(`🎵 Intentando reproducir para ${nextSale.agent.name}:`, songUrl);

        // Validar que la URL no esté vacía
        const validSongUrl = songUrl && songUrl.trim() !== "" ? songUrl : DEFAULT_SONG_URL;
        
        if (!songUrl || songUrl.trim() === "") {
          console.warn(`⚠️ No hay canción configurada para ${nextSale.agent.name}, usando canción por defecto`);
        }

        const audio = new Audio(validSongUrl);
        audio.volume = 1.0; // Volumen completo al inicio
        audio.loop = false;
        audioRef.current = audio;

    // Manejo robusto de reproducción de audio con async/await
    const playAudio = async () => {
      try {
        await audio.play();
        console.log("✅ Audio iniciado correctamente");
      } catch (error: unknown) {
        console.error("❌ Error de audio:", error);
        
        // Intentar reproducir sonido genérico de respaldo
        try {
          const backup = new Audio(DEFAULT_SONG_URL);
          backup.volume = 0.6;
          await backup.play();
          audioRef.current = backup;
          console.log("✅ Audio de respaldo iniciado");
        } catch (backupError) {
          console.error("❌ Error con audio de respaldo:", backupError);
          // Si todo falla, continuamos sin audio pero mostramos la animación
          audioRef.current = null;
        }
      }
    };

    playAudio();

    // Temporizador para cerrar la celebración después de 12 segundos
    // Con fade out de audio en los últimos 2 segundos
    const FADE_OUT_DURATION = 2000; // 2 segundos de fade out
    const fadeOutStartTime = CONFIG.JACKPOT_DURATION - FADE_OUT_DURATION;
    
    // Iniciar fade out antes de que termine la celebración
    fadeOutTimerRef.current = setTimeout(() => {
      if (audioRef.current) {
        console.log("🔉 Iniciando fade out del audio...");
        const steps = 20; // 20 pasos en 2 segundos = 100ms por paso
        const volumeStep = 1.0 / steps;
        
        fadeOutIntervalRef.current = setInterval(() => {
          if (audioRef.current) {
            audioRef.current.volume = Math.max(0, audioRef.current.volume - volumeStep);
            if (audioRef.current.volume <= 0) {
              if (fadeOutIntervalRef.current) {
                clearInterval(fadeOutIntervalRef.current);
                fadeOutIntervalRef.current = null;
              }
              if (audioRef.current) {
                audioRef.current.volume = 0;
                console.log("✅ Fade out completado");
              }
            }
          } else {
            if (fadeOutIntervalRef.current) {
              clearInterval(fadeOutIntervalRef.current);
              fadeOutIntervalRef.current = null;
            }
          }
        }, FADE_OUT_DURATION / steps); // 100ms por paso
      }
    }, fadeOutStartTime);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      console.log(`⏰ Tiempo cumplido (${CONFIG.JACKPOT_DURATION / 1000}s): Cerrando Jackpot`);
      setJackpotActive(false);
      setCelebratingAgent(null);
      
      // Limpiar timers de fade out
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
        fadeOutTimerRef.current = null;
      }
      if (fadeOutIntervalRef.current) {
        clearInterval(fadeOutIntervalRef.current);
        fadeOutIntervalRef.current = null;
      }
      
      // Detener audio completamente
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1.0; // Resetear volumen para la próxima vez
        audioRef.current = null;
      }

      // Marcar que terminamos de procesar
      isProcessingRef.current = false;

      // Procesar siguiente venta en cola si existe (con delay de 500ms)
      setTimeout(() => {
        processNextSale();
      }, 500);
    }, CONFIG.JACKPOT_DURATION);
  }, []);

  // --- EFECTO PARA AGREGAR VENTAS A LA COLA ---
  useEffect(() => {
    if (!saleChange) {
      console.log(`ℹ️ No hay saleChange en este momento`);
      return;
    }

    console.log(`🎯 SaleChange recibido:`, {
      agent: saleChange.agent.name,
      amount: saleChange.amount,
      agentId: saleChange.agent.id
    });

    // Agregar venta a la cola
    saleQueueRef.current.push({
      agent: saleChange.agent,
      amount: saleChange.amount,
    });

    console.log(`📦 Venta agregada a la cola. Cola actual: ${saleQueueRef.current.length} ventas`);
    console.log(`   Estado de procesamiento: ${isProcessingRef.current ? 'PROCESANDO' : 'LIBRE'}`);

    // Limpiar la venta del hook para que el polling siga funcionando
    clearSaleChange();

    // Si no estamos procesando nada, procesar inmediatamente
    if (!isProcessingRef.current) {
      console.log(`🚀 Iniciando procesamiento de venta...`);
      processNextSale();
    } else {
      console.log(`⏳ Esperando a que termine la venta actual antes de procesar la siguiente`);
    }
  }, [saleChange, clearSaleChange, processNextSale]);

  // --- EFECTO DE LIMPIEZA GLOBAL (Solo al cerrar la página) ---
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      saleQueueRef.current = [];
      isProcessingRef.current = false;
    };
  }, []);

  // --- HANDLERS ---
  const handleStart = () => {
    setHasStarted(true);
    document.documentElement.requestFullscreen().catch(() => {});
    
    // TRUCO: Desbloquear el contexto de audio
    const unlockAudio = new Audio(DEFAULT_SONG_URL);
    unlockAudio.volume = 0;
    unlockAudio.play().then(() => {
      unlockAudio.pause();
    }).catch((e) => console.log("Audio unlock failed", e));
  };

  // --- RENDERS CONDICIONALES ---
  
  // 1. Pantalla de Inicio
  if (!hasStarted) {
    return (
      <div className="relative h-screen w-screen overflow-hidden">
        <SpaceBackground />
        <StartScreen onStart={handleStart} />
      </div>
    );
  }

  // 2. Loading
  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-20 h-20 border-8 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 3. Mostrar error si existe
  if (error) {
    console.error("Error en la aplicación:", error);
    // Mostrar banner de error (no bloquea la aplicación)
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-transparent">
        <SpaceBackground />
        <div className="relative z-50 flex items-center justify-center h-full">
          <div className="bg-red-500/90 backdrop-blur-xl px-8 py-4 rounded-2xl border-4 border-red-600 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">⚠️ Error de Conexión</h2>
            <p className="text-white/90">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Jackpot Activo
  if (jackpotActive && celebratingAgent) {
    return (
      <div className="relative h-screen w-screen overflow-hidden">
        {/* Fondo también para la celebración */}
        <SpaceBackground />
        <JackpotOverlay 
          agent={celebratingAgent} 
          amount={saleAmount}
          agentPhoto={getAgentPhoto(celebratingAgent.name, celebratingAgent.avatar)}
        />
      </div>
    );
  }

  // 5. Vista Principal (Dashboard)
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-transparent">
      
      {/* 1. EL FONDO VA PRIMERO */}
      <SpaceBackground />

      {/* 2. EL DASHBOARD VA ENCIMA */}
      <div className="relative z-10 h-full w-full overflow-visible">
        <DashboardView 
          teams={teams} 
          getTeamTheme={getTeamTheme}
          getTeamIcon={getTeamIcon}
          getAgentPhoto={getAgentPhoto}
        />
      </div>
    </div>
  );
};

export default Index;
