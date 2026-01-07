import React from 'react';

const SpaceBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a0a2a]">
      {/* 1. NEBULOSAS (Manchas de color de fondo) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-fuchsia-900/20 rounded-full blur-[100px] animate-blob" />

      {/* 2. ESTRELLAS (Capas de paralaje) */}
      <div className="stars-small"></div>
      <div className="stars-medium"></div>
      
      {/* 3. ESTRELLAS FUGACES (Efecto WOW) */}
      <div className="shooting-star-container">
        <span className="shooting-star"></span>
        <span className="shooting-star delay-2000"></span>
        <span className="shooting-star delay-5000"></span>
      </div>
      
      {/* Malla sutil para textura digital */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>
  );
};

export default SpaceBackground;