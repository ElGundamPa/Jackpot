import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CoinParticles from "./CoinParticles";
import { Agent, formatCurrency } from "@/data/mockData";
import CountUp from "react-countup";
import { useEffect, useRef } from "react";

interface JackpotCelebrationProps {
  isActive: boolean;
  agent: Agent | null;
  saleAmount: number;
  onComplete: () => void;
}

const JackpotCelebration = ({
  isActive,
  agent,
  saleAmount,
  onComplete,
}: JackpotCelebrationProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isActive) {
      // Play celebration sound
      try {
        audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3");
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {});
      } catch (e) {
        // Audio might fail in some browsers
      }

      // Auto-complete after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 4500);

      return () => {
        clearTimeout(timer);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    }
  }, [isActive, onComplete]);

  if (!agent) return null;

  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 jackpot-overlay z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Coin Particles */}
          <CoinParticles count={60} />

          {/* Hero Content */}
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Glowing Ring */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.8,
              }}
            >
              {/* Outer glow rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)",
                  transform: "scale(2.5)",
                }}
                animate={{
                  scale: [2.5, 3, 2.5],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />

              {/* Golden circle frame */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full p-2 treasure-glow animate-glow-pulse">
                <div
                  className="w-full h-full rounded-full p-1"
                  style={{
                    background: "linear-gradient(135deg, #FFF8DC 0%, #FFD700 30%, #DAA520 70%, #B8860B 100%)",
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-card">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={agent.avatar}
                        alt={agent.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-5xl md:text-6xl bg-muted text-muted-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Agent Name */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.h2
                className="font-display text-4xl md:text-6xl gold-text tracking-wider"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255,215,0,0.5)",
                    "0 0 30px rgba(255,215,0,0.8)",
                    "0 0 10px rgba(255,215,0,0.5)",
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ¡{agent.name.split(" ")[0].toUpperCase()}!
              </motion.h2>
            </motion.div>

            {/* JACKPOT Text */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              <h1
                className="font-display text-6xl md:text-8xl tracking-widest"
                style={{
                  background: "linear-gradient(180deg, #FFF8DC 0%, #FFD700 30%, #DAA520 70%, #B8860B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 20px rgba(255,215,0,0.5))",
                }}
              >
                ¡JACKPOT!
              </h1>
            </motion.div>

            {/* Sale Amount */}
            <motion.div
              className="mt-6 px-8 py-4 rounded-2xl gold-border treasure-glow bg-card/80"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <p className="text-muted-foreground text-lg mb-1">Nueva Venta</p>
              <div className="font-display text-5xl md:text-7xl gold-text">
                <CountUp
                  end={saleAmount}
                  prefix="+$"
                  separator=","
                  duration={1.5}
                  delay={0.8}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JackpotCelebration;
