import { useState, useEffect, useRef } from "react";
import { useGoogleSheetData } from "@/hooks/useGoogleSheetData";
import { Agent } from "@/data/mockData";
import { 
  getTeamTheme, 
  getAgentPhoto, 
  getTeamIcon,
  getAgentCelebrationSong 
} from "@/config/agents.config";
import { CONFIG } from "@/config/constants";

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
  const saleQueueRef = useRef<QueuedSale[]>([]);
  const isProcessingRef = useRef(false);

  // URL de canción por defecto
  const DEFAULT_SONG_URL = "https://assets.mixkit.co/active_storage/sfx/1934/1934-preview.mp3";

  // --- FUNCIÓN PARA PROCESAR LA COLA ---
  const processNextSale = useRef(() => {
    // Si ya estamos procesando o no hay ventas en cola, salir
    if (isProcessingRef.current || saleQueueRef.current.length === 0) {
      return;
    }

    const nextSale = saleQueueRef.current.shift();
    if (!nextSale) return;

    isProcessingRef.current = true;

    // Configurar datos de la celebración
    setCelebratingAgent(nextSale.agent);
    setSaleAmount(nextSale.amount);
    setJackpotActive(true);

    // Detener audio anterior si existe
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Obtener URL y Crear Audio
    const songUrl = getAgentCelebrationSong(nextSale.agent.name);
    console.log(`🎵 Intentando reproducir para ${nextSale.agent.name}:`, songUrl);

    // Validar que la URL no esté vacía
    const validSongUrl = songUrl && songUrl.trim() !== "" ? songUrl : DEFAULT_SONG_URL;
    
    if (!songUrl || songUrl.trim() === "") {
      console.warn(`⚠️ No hay canción configurada para ${nextSale.agent.name}, usando canción por defecto`);
    }

    const audio = new Audio(validSongUrl);
    audio.volume = 0.8;
    audio.loop = false;
    audioRef.current = audio;

    // Manejo robusto de reproducción de audio
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

    // Temporizador para cerrar la celebración después de 7 segundos
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      console.log("⏰ Tiempo cumplido (7s): Cerrando Jackpot");
      setJackpotActive(false);
      setCelebratingAgent(null);
      
      // Detener audio suavemente
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      // Marcar que terminamos de procesar
      isProcessingRef.current = false;

      // Procesar siguiente venta en cola si existe (con delay de 500ms)
      setTimeout(() => {
        processNextSale.current();
      }, 500);
    }, CONFIG.JACKPOT_DURATION);
  });

  // --- EFECTO PARA AGREGAR VENTAS A LA COLA ---
  useEffect(() => {
    if (!saleChange) return;

    // Agregar venta a la cola
    saleQueueRef.current.push({
      agent: saleChange.agent,
      amount: saleChange.amount,
    });

    console.log(`📦 Venta agregada a la cola. Cola actual: ${saleQueueRef.current.length} ventas`);

    // Limpiar la venta del hook para que el polling siga funcionando
    clearSaleChange();

    // Si no estamos procesando nada, procesar inmediatamente
    if (!isProcessingRef.current) {
      processNextSale.current();
    }
  }, [saleChange, clearSaleChange]);

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

  // 3. Mostrar error si existe (opcional - puedes mejorarlo visualmente)
  if (error) {
    console.error("Error en la aplicación:", error);
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
      <div className="relative z-10 h-full w-full">
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
