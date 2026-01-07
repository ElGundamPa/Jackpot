import { Play } from 'lucide-react';
import SpaceBackground from './SpaceBackground';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="min-h-screen w-screen bg-[#0f172a] flex flex-col items-center justify-center text-white relative overflow-hidden">
      <SpaceBackground />
      
      <div className="z-10 text-center space-y-10 animate-in fade-in zoom-in duration-500 px-4">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-tighter drop-shadow-2xl italic">
          SALES CHAMPIONS
        </h1>
        
        <button 
          onClick={onStart}
          className="group relative px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-3xl font-black rounded-full hover:scale-110 shadow-[0_0_50px_rgba(234,179,8,0.5)] transition-all flex items-center gap-4 mx-auto border-4 border-yellow-300"
        >
          <Play className="w-10 h-10 fill-white" />
          <span>INICIAR</span>
        </button>
      </div>
    </div>
  );
};

export default StartScreen;