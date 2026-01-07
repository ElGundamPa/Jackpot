import { Agent } from '@/data/mockData';

interface JackpotOverlayProps {
  agent: Agent;
  amount: number;
  agentPhoto: string;
}

const JackpotOverlay = ({ agent, amount, agentPhoto }: JackpotOverlayProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Rayos de Sol Giratorios */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="sunburst" />
      </div>

      {/* Fuegos Artificiales y Confeti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="firework" />
        <div className="firework" />
        <div className="firework" />
        
        {/* Lluvia de Emojis */}
        {[...Array(40)].map((_, i) => (
          <div 
            key={i} 
            className="absolute text-6xl animate-bounce" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animation: `coinFall ${2 + Math.random() * 3}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            {['💰','✨','🎉'][Math.floor(Math.random() * 3)]}
          </div>
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="text-center relative z-10 animate-in zoom-in duration-500 flex flex-col items-center justify-center h-screen py-10">
        
        {/* Texto Superior */}
        <div className="mb-6">
          <h2 
            className="text-8xl font-black text-white italic uppercase drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-wide"
            style={{ textShadow: '0 0 20px #fbbf24, 4px 4px 0px #000' }}
          >
            ¡NUEVA VENTA!
          </h2>
        </div>

        {/* Foto del Ganador */}
        <div className="relative inline-block">
          {/* Brillo Divino */}
          <div className="absolute inset-0 bg-yellow-400 blur-[120px] opacity-70 animate-pulse" />
          
          {/* Imagen Gigante */}
          <img 
            src={agentPhoto} 
            alt="Ganador"
            className="w-[550px] h-[550px] rounded-full border-[12px] border-white object-cover shadow-[0_0_150px_rgba(255,255,255,0.6)] relative z-20"
          />
          
          {/* Corona Flotante */}
          <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 text-[12rem] z-30 drop-shadow-2xl animate-bounce">
            👑
          </div>
        </div>
        
        {/* Nombre del Agente */}
        <div className="mt-8 mb-2">
          <p className="text-8xl font-bold text-yellow-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-widest uppercase">
            {agent.name}
          </p>
        </div>

        {/* Monto */}
        <div>
          <p className="text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-600 drop-shadow-[0_10px_0_rgba(0,0,0,0.5)] font-mono leading-none animate-pulse">
            +${amount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JackpotOverlay;