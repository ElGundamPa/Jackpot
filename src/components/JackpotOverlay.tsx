import { Agent } from '@/data/mockData';
import React from 'react';

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

      {/* Fuegos Artificiales Explosivos (Año Nuevo) - Múltiples posiciones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Fuegos artificiales en diferentes posiciones del fondo */}
        <div className="firework firework-1" style={{ '--firework-left': '20%', '--firework-top': '30%' } as React.CSSProperties} />
        <div className="firework firework-2" style={{ '--firework-left': '50%', '--firework-top': '20%' } as React.CSSProperties} />
        <div className="firework firework-3" style={{ '--firework-left': '80%', '--firework-top': '35%' } as React.CSSProperties} />
        <div className="firework firework-4" style={{ '--firework-left': '15%', '--firework-top': '60%' } as React.CSSProperties} />
        <div className="firework firework-5" style={{ '--firework-left': '70%', '--firework-top': '65%' } as React.CSSProperties} />
        <div className="firework firework-6" style={{ '--firework-left': '40%', '--firework-top': '70%' } as React.CSSProperties} />
        <div className="firework firework-7" style={{ '--firework-left': '90%', '--firework-top': '50%' } as React.CSSProperties} />
        <div className="firework firework-8" style={{ '--firework-left': '10%', '--firework-top': '45%' } as React.CSSProperties} />
      </div>

      {/* Confeti cayendo desde arriba */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(150)].map((_, i) => {
          const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const randomLeft = Math.random() * 100;
          const randomDelay = Math.random() * 3;
          const randomDuration = 3 + Math.random() * 2;
          const randomRotation = Math.random() * 360;
          
          return (
            <div
              key={`confetti-${i}`}
              className="absolute confetti-piece"
              style={{
                left: `${randomLeft}%`,
                top: '-10px',
                width: '10px',
                height: '10px',
                backgroundColor: randomColor,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                animation: `confettiFall ${randomDuration}s linear infinite`,
                animationDelay: `${randomDelay}s`,
                transform: `rotate(${randomRotation}deg)`,
                boxShadow: `0 0 6px ${randomColor}`,
              }}
            />
          );
        })}
      </div>

      {/* Lluvia de Emojis - Tamaño reducido */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div 
            key={`emoji-${i}`}
            className="absolute text-3xl md:text-4xl" 
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
      <div className="text-center relative z-10 animate-in zoom-in duration-500 flex flex-col items-center justify-center h-screen py-8 px-4">
        
        {/* Texto Superior */}
        <div className="mb-4">
          <h2 
            className="text-4xl md:text-5xl font-black text-white italic uppercase drop-shadow-[0_3px_3px_rgba(0,0,0,1)] tracking-wide"
            style={{ textShadow: '0 0 15px #fbbf24, 2px 2px 0px #000' }}
          >
            ¡NUEVA VENTA!
          </h2>
        </div>

        {/* Foto del Ganador */}
        <div className="relative inline-block">
          {/* Brillo Divino con pulso */}
          <div className="absolute inset-0 bg-yellow-400 blur-[80px] opacity-60 animate-pulse-glow" />
          
          {/* Anillo de energía rotante alrededor de la foto */}
          <div className="absolute inset-0 rounded-full border-[4px] border-yellow-400/50 animate-spin-slow" 
               style={{ 
                 width: 'calc(100% + 20px)', 
                 height: 'calc(100% + 20px)',
                 top: '-10px',
                 left: '-10px',
                 borderStyle: 'dashed',
                 borderWidth: '3px'
               }} 
          />
          
          {/* Imagen con animación de flotación y pulso */}
          <img 
            src={agentPhoto} 
            alt="Ganador"
            className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full border-[8px] border-white object-cover shadow-[0_0_80px_rgba(255,255,255,0.5)] relative z-20 animate-profile-celebration"
            style={{ 
              objectPosition: 'center 25%',
              animation: 'profileCelebration 3s ease-in-out infinite'
            }}
          />
          
          {/* Efecto de brillo pulsante alrededor */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 via-transparent to-yellow-400/30 animate-pulse-glow z-10"
               style={{ 
                 width: 'calc(100% + 30px)', 
                 height: 'calc(100% + 30px)',
                 top: '-15px',
                 left: '-15px'
               }} 
          />
          
          {/* Corona Flotante - Tamaño reducido */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-6xl md:text-7xl z-30 drop-shadow-2xl animate-bounce">
            👑
          </div>
        </div>
        
        {/* Nombre del Agente */}
        <div className="mt-6 mb-3">
          <p className="text-3xl md:text-4xl font-bold text-yellow-300 drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)] tracking-wider uppercase px-4">
            {agent.name}
          </p>
        </div>

        {/* Monto */}
        <div className="px-4">
          <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-600 drop-shadow-[0_5px_0_rgba(0,0,0,0.5)] font-mono leading-tight animate-pulse">
            +${amount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JackpotOverlay;