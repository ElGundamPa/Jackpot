// src/components/DashboardView.tsx
import React from 'react';
import { Trophy, TrendingUp, Crown, Target, Zap } from 'lucide-react';
import { Team } from '@/data/mockData';
import { TeamTheme } from '@/config/agents.config';
import SpaceBackground from './SpaceBackground';
import AnimatedCharacter from './AnimatedCharacter';
import AnimatedGifCharacter from './AnimatedGifCharacter';
import FloatingElements from './FloatingElements';
import AnimatedNumber from './AnimatedNumber';

interface DashboardViewProps {
  teams: Team[];
  getTeamTheme: (index: number) => TeamTheme;
  getTeamIcon: (index: number) => string;
  getAgentPhoto: (name: string, fallback: string) => string;
}

const DashboardView = ({ teams, getTeamTheme, getTeamIcon, getAgentPhoto }: DashboardViewProps) => {
  // Calcular valores reales
  const grandTotal = teams.reduce((acc, team) => 
    acc + team.agents.reduce((sum, agent) => sum + agent.sales, 0), 0
  );

  // Calcular el porcentaje dinámico basado en el total vs la meta
  const goalTotal = teams.reduce((acc, team) => acc + (team.goal || 50000), 0);
  const progressPercentage = goalTotal > 0 
    ? Math.round((grandTotal / goalTotal) * 100) 
    : 0;
  const percentageChange = progressPercentage >= 100 
    ? `+${progressPercentage - 100}%` 
    : `${progressPercentage}%`;

  return (
    <div className="h-screen w-screen relative font-sans text-white overflow-hidden flex flex-col">
      <SpaceBackground />
      
      {/* 🎨 Elementos flotantes decorativos - z-index bajo para que no interfieran */}
      <FloatingElements />
      
      {/* 🧙‍♂️ Mago en esquina inferior izquierda */}
      <AnimatedGifCharacter 
        type="wizard" 
        position="bottom-left" 
        size={120}
        animation="float"
      />
      
      <AnimatedGifCharacter 
        type="dogs" 
        position="bottom-center"
        size={180}
        animation="float"
        offsetY={-40}
      />
      {/* 🦆 Pato en esquina inferior derecha */}
      <AnimatedGifCharacter 
        type="duck" 
        position="bottom-right" 
        size={100}
        animation="float" // ✅ Cambiado de "bounce" a "float" para que todas tengan la misma duración
      />
      
      {/* ⭐ Personajes emoji adicionales - con opacidad reducida y z-index bajo */}
      <AnimatedCharacter character="rocket" position="top-left" size="sm" />
      <AnimatedCharacter character="star" position="top-right" size="sm" />
      
      {/* ========== HEADER GLOBAL ========== */}
      <div className="relative z-30 px-6 pt-4 pb-2 flex items-center justify-between shrink-0">
        
        {/* IZQUIERDA: Logo */}
        <div className="w-1/3 flex justify-start">
          <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-600 px-5 py-2 rounded-full shadow-lg border-b-6 border-orange-700 transform scale-75 origin-left">
            <Trophy className="w-7 h-7 text-white drop-shadow-md" />
            <div className="flex flex-col leading-none">
              <h1 className="text-2xl font-black italic tracking-wide text-white drop-shadow-lg text-stroke-sm">
                SALES CHAMPIONS
              </h1>
              <span className="text-[10px] font-bold text-yellow-100 uppercase tracking-[0.2em] mt-0.5 ml-1">
                En Vivo • Hoy
              </span>
            </div>
          </div>
        </div>

        {/* CENTRO: Total Global */}
        <div className="w-1/3 flex justify-center">
          <div className="bg-[#2d1b4e]/90 backdrop-blur-xl px-10 py-1.5 rounded-[1.5rem] border-3 border-yellow-400/60 shadow-[0_0_50px_rgba(234,179,8,0.25)] flex flex-col items-center justify-center relative transform hover:scale-105 transition-transform z-20">
            {/* Badge "Total Global" */}
            <div className="absolute -top-3 bg-yellow-500 text-black font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-widest border-2 border-white shadow-lg">
              Total Global
            </div>
            
            {/* Monto */}
            <span className="text-5xl font-black text-yellow-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-mono tracking-tighter leading-none mt-1">
                  $<AnimatedNumber 
                    value={grandTotal}
                    duration={28}
                    formatter={(val) => val.toLocaleString()}
                    playSound={true}
                  />
            </span>
          </div>
        </div>
        
        {/* DERECHA: Stats - Porcentaje calculado dinámicamente */}
        <div className="w-1/3 flex justify-end">
          <div className="bg-[#2d1b4e]/90 backdrop-blur-xl px-6 py-2 rounded-2xl border-3 border-purple-500/30 flex items-center gap-2 shadow-2xl transform scale-75 origin-right">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <span className="text-2xl font-black text-emerald-400 drop-shadow-md">{percentageChange}</span>
          </div>
        </div>
      </div>

      {/* ========== GRID DE EQUIPOS ========== */}
      <div className="relative z-20 flex-1 grid grid-cols-3 gap-4 px-4 pt-2 pb-2 overflow-visible items-stretch min-h-0">
        {teams.map((team, index) => {
          const theme = getTeamTheme(index);
          const sortedAgents = [...team.agents].sort((a, b) => b.sales - a.sales);
          const teamTotal = team.total_real;

          return (
            <div key={team.id} className="flex flex-col h-full relative group min-h-0 overflow-visible">
              
              {/* ===== Header del Equipo ===== */}
              <div className={`relative p-3 pt-10 pb-3 rounded-[2rem] shadow-2xl z-20 mb-3 shrink-0 flex items-center gap-2 transition-transform duration-300 ${theme.bg} border-b-[8px] ${theme.border} overflow-visible`}>
                
                {/* Foto del Líder (Ícono del Equipo) - Ajustado para que no se corte durante la animación */}
                <div className="relative shrink-0 -ml-2 -mt-10 z-10" style={{ overflow: 'visible' }}>
                  <div className="absolute inset-0 bg-white/40 rounded-full blur-xl transform scale-110" />
                  <img 
                    src={getTeamIcon(index)} 
                    alt="Líder del Equipo" 
                    className="relative w-32 h-32 object-cover rounded-full border-[4px] border-white shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
                    style={{ 
                      animation: 'bounce 3s ease-in-out infinite',
                      objectPosition: 'center 25%',
                      willChange: 'transform',
                      transformOrigin: 'center center'
                    }} 
                  />
                </div>
                
                {/* Info del Equipo */}
                <div className="flex-1 flex flex-col justify-center min-w-0 z-10 pl-1">
                  {/* Nombre del Equipo */}
                  <div className="flex flex-col items-start mb-1">
                    <h3 className="text-sm font-bold text-white/90 uppercase tracking-[0.15em] drop-shadow-sm">
                      {team.name.split(' ')[0]} {team.name.split(' ')[1]}
                    </h3>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide leading-none filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
                      {team.name.split(' ').slice(2).join(' ') || "EQUIPO"}
                    </h2>
                  </div>
                  
                  {/* Total del Equipo */}
                  <div className="text-3xl font-black text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.3)] tracking-tighter font-mono leading-none">
                        $<AnimatedNumber 
                          value={teamTotal}
                          duration={28}
                          formatter={(val) => val.toLocaleString()}
                        />
                  </div>
                  
                  {/* Barra de Progreso */}
                  <div className="mt-2 w-full h-3 bg-black/30 rounded-full overflow-hidden border border-white/20 shadow-inner">
                    <div className={`h-full w-2/3 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] ${theme.barColor}`} />
                  </div>
                </div>
              </div>

              {/* ===== Lista de Agentes ===== */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col gap-2 px-2 pb-2 pt-1 min-h-0 relative z-10">
                {sortedAgents.map((agent, idx) => {
                  // Estilos según ranking
                  let cardStyle = "", ringColor = "", icon = null, iconBg = "", glowEffect = "", avatarGlow = "";
                  
                  if (idx === 0) {
                    // 🥇 Primer Lugar - Luz dorada intensa
                    cardStyle = "bg-[#2d1b4e]/95 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]";
                    ringColor = "border-yellow-400";
                    iconBg = "bg-yellow-400 text-yellow-900";
                    icon = <Crown className="w-5 h-5 fill-yellow-900" />;
                    glowEffect = "shadow-[0_0_25px_rgba(234,179,8,0.8),0_0_50px_rgba(234,179,8,0.4)]";
                    avatarGlow = "shadow-[0_0_20px_rgba(234,179,8,0.9),0_0_40px_rgba(234,179,8,0.5),inset_0_0_20px_rgba(234,179,8,0.3)]";
                  } else if (idx === 1) {
                    // 🥈 Segundo Lugar - Luz rosa intensa
                    cardStyle = "bg-[#2d1b4e]/80 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.2)]";
                    ringColor = "border-pink-500";
                    iconBg = "bg-pink-500 text-white";
                    icon = <Target className="w-5 h-5 fill-pink-200" />;
                    glowEffect = "shadow-[0_0_25px_rgba(236,72,153,0.8),0_0_50px_rgba(236,72,153,0.4)]";
                    avatarGlow = "shadow-[0_0_20px_rgba(236,72,153,0.9),0_0_40px_rgba(236,72,153,0.5),inset_0_0_20px_rgba(236,72,153,0.3)]";
                  } else if (idx === 2) {
                    // 🥉 Tercer Lugar - Luz naranja intensa
                    cardStyle = "bg-[#2d1b4e]/70 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.2)]";
                    ringColor = "border-orange-500";
                    iconBg = "bg-orange-500 text-white";
                    icon = <Zap className="w-5 h-5 fill-orange-200" />;
                    glowEffect = "shadow-[0_0_25px_rgba(249,115,22,0.8),0_0_50px_rgba(249,115,22,0.4)]";
                    avatarGlow = "shadow-[0_0_20px_rgba(249,115,22,0.9),0_0_40px_rgba(249,115,22,0.5),inset_0_0_20px_rgba(249,115,22,0.3)]";
                  } else {
                    // Resto - Luz azul leve pero visible para inspirar
                    cardStyle = "bg-[#2d1b4e]/40 border-blue-500/50 hover:bg-[#2d1b4e]/60";
                    ringColor = "border-blue-400/50";
                    iconBg = "bg-slate-700 text-slate-300";
                    icon = <span className="font-bold text-sm">#{idx + 1}</span>;
                    glowEffect = "shadow-[0_0_15px_rgba(59,130,246,0.5),0_0_30px_rgba(59,130,246,0.2)]";
                    avatarGlow = "shadow-[0_0_12px_rgba(59,130,246,0.6),0_0_24px_rgba(59,130,246,0.3)]";
                  }
                  
                  const realAvatar = getAgentPhoto(agent.name, agent.avatar);

                  return (
                    <div 
                      key={agent.id} 
                      className={`relative flex items-center p-2 rounded-xl border-2 transition-all duration-300 ml-4 overflow-visible ${cardStyle} ${glowEffect}`}
                    >
                      {/* Avatar del Agente */}
                      <div className="relative shrink-0 -ml-6 z-10">
                        {/* Efecto de brillo detrás del avatar */}
                        <div 
                          className={`absolute inset-0 rounded-full blur-md transform scale-110 ${
                            idx === 0 ? 'bg-yellow-400/60' : 
                            idx === 1 ? 'bg-pink-500/60' : 
                            idx === 2 ? 'bg-orange-500/60' : 
                            'bg-blue-400/40'
                          }`}
                          style={{
                            animation: idx < 3 ? 'pulse-glow 2s ease-in-out infinite' : 'pulse-glow-soft 3s ease-in-out infinite',
                            animationDelay: `${idx * 0.2}s`
                          }}
                        />
                        <img 
                          src={realAvatar} 
                          alt={agent.name} 
                          className={`relative w-12 h-12 rounded-full object-cover border-2 ${ringColor} bg-slate-800 ${avatarGlow}`}
                          style={{ 
                            objectPosition: 'center 25%',
                            willChange: 'transform'
                          }}
                        />
                        {/* Badge de Ranking */}
                        <div className={`absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border border-[#2d1b4e] shadow-md z-20 ${iconBg}`}>
                          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { className: "w-3 h-3" }) : <span className="text-[8px] font-bold">{icon}</span>}
                        </div>
                      </div>
                      
                      {/* Info del Agente */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center pl-2">
                        <div className="flex items-center gap-1">
                          <span className="font-black text-white text-sm truncate leading-none tracking-wide drop-shadow-md">
                            {agent.name}
                          </span>
                          {idx === 0 && (
                            <span className="bg-yellow-400/20 text-yellow-300 text-[8px] font-bold px-1 py-0.5 rounded uppercase border border-yellow-400/50">
                              TOP
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Ventas del Agente */}
                      <div className="text-lg font-black text-emerald-400 font-mono tracking-tighter drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
                            $<AnimatedNumber 
                              value={agent.sales}
                              duration={28}
                              formatter={(val) => val.toLocaleString()}
                            />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardView;