// src/components/DashboardView.tsx
import { Trophy, TrendingUp, Crown, Target, Zap } from 'lucide-react';
import { Team } from '@/data/mockData';
import { TeamTheme } from '@/config/agents.config';
import SpaceBackground from './SpaceBackground';
import AnimatedCharacter from './AnimatedCharacter';
import AnimatedGifCharacter from './AnimatedGifCharacter';
import FloatingElements from './FloatingElements';

interface DashboardViewProps {
  teams: Team[];
  getTeamTheme: (index: number) => TeamTheme;
  getTeamIcon: (index: number) => string;
  getAgentPhoto: (name: string, fallback: string) => string;
}

const DashboardView = ({ teams, getTeamTheme, getTeamIcon, getAgentPhoto }: DashboardViewProps) => {
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
      
      {/* 🎨 Elementos flotantes decorativos */}
      <FloatingElements />
      
      {/* 🧙‍♂️ Mago en esquina inferior izquierda */}
      <AnimatedGifCharacter 
        type="wizard" 
        position="bottom-left" 
        size={180}
        animation="float"
      />
      
      <AnimatedGifCharacter 
        type="dogs" 
        position="bottom-center"
        size={250}  // ✅ Ajusta el tamaño
        animation="float"
        offsetY={-60}  // ✅ 0 = pegado al fondo, -20 = más arriba, etc
      />
      {/* 🦆 Pato en esquina inferior derecha */}
      <AnimatedGifCharacter 
        type="duck" 
        position="bottom-right" 
        size={150}
        animation="bounce"
      />
      
      {/* ⭐ Personajes emoji adicionales (opcional) */}
      <AnimatedCharacter character="rocket" position="top-left" size="sm" />
      <AnimatedCharacter character="star" position="top-right" size="sm" />
      
      {/* ========== HEADER GLOBAL ========== */}
      <div className="relative z-10 px-8 pt-10 pb-4 flex items-center justify-between shrink-0 h-auto">
        
        {/* IZQUIERDA: Logo */}
        <div className="w-1/3 flex justify-start">
          <div className="flex items-center gap-5 bg-gradient-to-r from-yellow-500 to-orange-600 px-8 py-3 rounded-full shadow-lg border-b-8 border-orange-700 transform scale-90 origin-left">
            <Trophy className="w-10 h-10 text-white drop-shadow-md" />
            <div className="flex flex-col leading-none">
              <h1 className="text-3xl font-black italic tracking-wide text-white drop-shadow-lg text-stroke-sm">
                SALES CHAMPIONS
              </h1>
              <span className="text-xs font-bold text-yellow-100 uppercase tracking-[0.2em] mt-1 ml-1">
                En Vivo • Hoy
              </span>
            </div>
          </div>
        </div>

        {/* CENTRO: Total Global */}
        <div className="w-1/3 flex justify-center">
          <div className="bg-[#2d1b4e]/90 backdrop-blur-xl px-16 py-2 rounded-[2rem] border-4 border-yellow-400/60 shadow-[0_0_50px_rgba(234,179,8,0.25)] flex flex-col items-center justify-center relative transform hover:scale-105 transition-transform z-20 mt-2">
            {/* Badge "Total Global" */}
            <div className="absolute -top-5 bg-yellow-500 text-black font-black text-xs px-4 py-1 rounded-full uppercase tracking-widest border-2 border-white shadow-lg">
              Total Global
            </div>
            
            {/* Monto */}
            <span className="text-8xl font-black text-yellow-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-mono tracking-tighter leading-none mt-2">
              ${grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* DERECHA: Stats - Porcentaje calculado dinámicamente */}
        <div className="w-1/3 flex justify-end">
          <div className="bg-[#2d1b4e]/90 backdrop-blur-xl px-8 py-3 rounded-3xl border-4 border-purple-500/30 flex items-center gap-3 shadow-2xl transform scale-90 origin-right">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <span className="text-3xl font-black text-emerald-400 drop-shadow-md">{percentageChange}</span>
          </div>
        </div>
      </div>

      {/* ========== GRID DE EQUIPOS ========== */}
      <div className="relative z-10 flex-1 grid grid-cols-3 gap-8 px-8 pt-10 pb-4 overflow-visible items-stretch">
        {teams.map((team, index) => {
          const theme = getTeamTheme(index);
          const sortedAgents = [...team.agents].sort((a, b) => b.sales - a.sales);
          const teamTotal = team.total_real;

          return (
            <div key={team.id} className="flex flex-col h-full relative group">
              
              {/* ===== Header del Equipo ===== */}
              <div className={`relative p-6 pt-6 rounded-[3rem] shadow-2xl z-20 mb-10 shrink-0 flex items-center gap-2 transition-transform duration-300 ${theme.bg} border-b-[12px] ${theme.border} overflow-visible`}>
                
                {/* Foto del Líder (Ícono del Equipo) */}
                <div className="relative shrink-0 -ml-4 -mt-6">
                  <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl transform scale-110" />
                  <img 
                    src={getTeamIcon(index)} 
                    alt="Líder del Equipo" 
                    className="relative w-64 h-64 object-cover rounded-full border-[6px] border-white shadow-[0_15px_30px_rgba(0,0,0,0.5)] animate-bounce" 
                    style={{ animationDuration: '3s' }} 
                  />
                </div>
                
                {/* Info del Equipo */}
                <div className="flex-1 flex flex-col justify-center min-w-0 z-10 pl-2">
                  {/* Nombre del Equipo */}
                  <div className="flex flex-col items-start mb-2">
                    <h3 className="text-xl font-bold text-white/90 uppercase tracking-[0.2em] drop-shadow-sm">
                      {team.name.split(' ')[0]} {team.name.split(' ')[1]}
                    </h3>
                    <h2 className="text-5xl lg:text-6xl font-black text-white uppercase tracking-wide leading-none filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]">
                      {team.name.split(' ').slice(2).join(' ') || "EQUIPO"}
                    </h2>
                  </div>
                  
                  {/* Total del Equipo */}
                  <div className="text-8xl font-black text-white drop-shadow-[0_6px_0_rgba(0,0,0,0.3)] tracking-tighter font-mono leading-none">
                    ${teamTotal.toLocaleString()}
                  </div>
                  
                  {/* Barra de Progreso */}
                  <div className="mt-4 w-full h-5 bg-black/30 rounded-full overflow-hidden border border-white/20 shadow-inner">
                    <div className={`h-full w-2/3 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] ${theme.barColor}`} />
                  </div>
                </div>
              </div>

              {/* ===== Lista de Agentes ===== */}
              <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-5 px-4 pb-6 pt-2">
                {sortedAgents.map((agent, idx) => {
                  // Estilos según ranking
                  let cardStyle = "", ringColor = "", icon = null, iconBg = "";
                  
                  if (idx === 0) {
                    // 🥇 Primer Lugar
                    cardStyle = "bg-[#2d1b4e]/95 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]";
                    ringColor = "border-yellow-400";
                    iconBg = "bg-yellow-400 text-yellow-900";
                    icon = <Crown className="w-5 h-5 fill-yellow-900" />;
                  } else if (idx === 1) {
                    // 🥈 Segundo Lugar
                    cardStyle = "bg-[#2d1b4e]/80 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.2)]";
                    ringColor = "border-pink-500";
                    iconBg = "bg-pink-500 text-white";
                    icon = <Target className="w-5 h-5 fill-pink-200" />;
                  } else if (idx === 2) {
                    // 🥉 Tercer Lugar
                    cardStyle = "bg-[#2d1b4e]/70 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.2)]";
                    ringColor = "border-orange-500";
                    iconBg = "bg-orange-500 text-white";
                    icon = <Zap className="w-5 h-5 fill-orange-200" />;
                  } else {
                    // Resto
                    cardStyle = "bg-[#2d1b4e]/40 border-blue-500/50 hover:bg-[#2d1b4e]/60";
                    ringColor = "border-blue-400/50";
                    iconBg = "bg-slate-700 text-slate-300";
                    icon = <span className="font-bold text-sm">#{idx + 1}</span>;
                  }
                  
                  const realAvatar = getAgentPhoto(agent.name, agent.avatar);

                  return (
                    <div 
                      key={agent.id} 
                      className={`relative flex items-center p-4 rounded-[2rem] border-[3px] transition-all duration-300 ml-6 overflow-visible ${cardStyle}`}
                    >
                      {/* Avatar del Agente */}
                      <div className="relative shrink-0 -ml-10 z-10">
                        <div className={`absolute inset-0 rounded-full blur-md opacity-50 transform scale-90 ${idx === 0 ? 'bg-yellow-400' : 'bg-black'}`} />
                        <img 
                          src={realAvatar} 
                          alt={agent.name} 
                          className={`relative w-24 h-24 rounded-full object-cover border-[4px] shadow-xl ${ringColor} bg-slate-800`} 
                        />
                        {/* Badge de Ranking */}
                        <div className={`absolute -top-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center border-2 border-[#2d1b4e] shadow-lg z-20 ${iconBg}`}>
                          {icon}
                        </div>
                      </div>
                      
                      {/* Info del Agente */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center pl-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white text-3xl truncate leading-none tracking-wide drop-shadow-md">
                            {agent.name}
                          </span>
                          {idx === 0 && (
                            <span className="bg-yellow-400/20 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-yellow-400/50">
                              TOP
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Ventas del Agente */}
                      <div className="text-4xl font-black text-emerald-400 font-mono tracking-tighter drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
                        ${agent.sales.toLocaleString()}
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