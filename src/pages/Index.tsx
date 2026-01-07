import { useState, useEffect, useRef } from "react";
import { useGoogleSheetData } from "@/hooks/useGoogleSheetData";
import { Agent } from "@/data/mockData";
import { 
  getTeamTheme, 
  getAgentPhoto, 
  getTeamIcon,
  getAgentCelebrationSong 
} from "@/config/agents.config";

// Componentes separados
import SpaceBackground from "@/components/SpaceBackground";
import StartScreen from "@/components/StartScreen";
import DashboardView from "@/components/DashboardView";
import JackpotOverlay from "@/components/JackpotOverlay";

const Index = () => {
  // --- ESTADO ---
  const { teams, loading, error, saleChange, clearSaleChange, refetch } = useGoogleSheetData(10000);
  const [hasStarted, setHasStarted] = useState(false);
  const [jackpotActive, setJackpotActive] = useState(false);
  const [celebratingAgent, setCelebratingAgent] = useState<Agent | null>(null);
  const [saleAmount, setSaleAmount] = useState(0);
  
  // Referencias para Audio y Temporizador (Cruciales para evitar errores)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- EFECTO DE JACKPOT ROBUSTO (CORREGIDO) ---
  useEffect(() => {
    // Si no hay venta nueva, salimos
    if (!saleChange) return;

    // 1. Configurar datos de la celebración
    setCelebratingAgent(saleChange.agent);
    setSaleAmount(saleChange.amount);
    setJackpotActive(true);

    // 2. Detener audio anterior si existe (para evitar superposición)
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // 3. Obtener URL y Crear Audio
    const songUrl = getAgentCelebrationSong(saleChange.agent.name);
    console.log(`🎵 Intentando reproducir para ${saleChange.agent.name}:`, songUrl);

    const audio = new Audio(songUrl);
    audio.volume = 0.8;
    audio.loop = false; // No loop, queremos que termine naturalmente o a los 30s
    audioRef.current = audio; // Guardamos referencia

    // 4. Reproducir (Manejo de promesas seguro)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log("✅ Audio iniciado correctamente");
      }).catch((error) => {
        console.error("❌ Error de audio:", error);
        // Si falla, intentar reproducir sonido genérico de respaldo
        if (error.name === "NotAllowedError" || error.name === "NotSupportedError") {
           const backup = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
           backup.volume = 0.6;
           backup.play().catch(e => console.log("Backup falló:", e));
           audioRef.current = backup;
        }
      });
    }

    // 5. Limpiamos la venta para que el polling siga funcionando
    clearSaleChange();

    // 6. Temporizador para cerrar todo (30 segundos)
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      console.log("⏰ Tiempo cumplido: Cerrando Jackpot");
      setJackpotActive(false);
      setCelebratingAgent(null);
      
      // Detener audio suavemente al terminar el tiempo
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }, 30000);

    // --- IMPORTANTE: NO PAUSAR AUDIO AQUÍ ---
    // Eliminamos la limpieza automática del audio aquí para evitar el "AbortError"
    
  }, [saleChange, clearSaleChange]);

  // --- EFECTO DE LIMPIEZA GLOBAL (Solo al cerrar la página) ---
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // --- HANDLERS ---
  const handleStart = () => {
    setHasStarted(true);
    document.documentElement.requestFullscreen().catch(() => {});
    
    // TRUCO: Desbloquear el contexto de audio
    const unlockAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
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

  // 3. Jackpot Activo
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

  // 4. Vista Principal (Dashboard)
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