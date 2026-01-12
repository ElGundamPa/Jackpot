import React from 'react';

const SpaceBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a0a2a]">
      {/* 1. NEBULOSAS ANIMADAS (Manchas de color de fondo con movimiento) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px] animate-pulse-slow animate-nebula-drift" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse-slow animate-nebula-drift-reverse" style={{ animationDelay: '1000ms' }} />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-fuchsia-900/20 rounded-full blur-[100px] animate-blob" />
      <div className="absolute top-[60%] left-[10%] w-[40%] h-[40%] bg-cyan-900/15 rounded-full blur-[140px] animate-nebula-float" style={{ animationDelay: '2000ms' }} />
      <div className="absolute bottom-[30%] right-[10%] w-[35%] h-[35%] bg-indigo-900/20 rounded-full blur-[110px] animate-nebula-float-reverse" style={{ animationDelay: '3000ms' }} />

      {/* 2. ESTRELLAS (Capas de paralaje con parpadeo) */}
      <div className="stars-small stars-twinkle"></div>
      <div className="stars-medium stars-twinkle-delay"></div>
      <div className="stars-large stars-twinkle-delay-2"></div>
      
      {/* 3. ESTRELLAS FUGACES (Efecto WOW - más frecuentes) */}
      <div className="shooting-star-container">
        <span className="shooting-star"></span>
        <span className="shooting-star delay-2000"></span>
        <span className="shooting-star delay-5000"></span>
        <span className="shooting-star delay-4000"></span>
        <span className="shooting-star delay-7000"></span>
      </div>

      {/* 4. PARTÍCULAS FLOTANTES */}
      <div className="floating-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* 5. RAYOS DE LUZ GIRATORIOS SUTILES */}
      <div className="sunburst subtle" />

      {/* 6. GRADIENTES ANIMADOS */}
      <div className="absolute inset-0 bg-gradient-animated opacity-30" />
      
      {/* Malla sutil para textura digital */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 animate-pulse-slow"></div>
    </div>
  );
};

export default SpaceBackground;