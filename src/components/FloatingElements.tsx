// src/components/FloatingElements.tsx
import { motion } from "framer-motion";

const FloatingElements = () => {
  // 💰 Íconos flotantes
  const floatingIcons = [
    { icon: "💎", delay: 0, x: "10vw", duration: 8 },
    { icon: "💸", delay: 1, x: "30vw", duration: 10 },
    { icon: "🎰", delay: 2, x: "50vw", duration: 9 },
    { icon: "🎲", delay: 0.5, x: "70vw", duration: 11 },
    { icon: "🪙", delay: 1.5, x: "90vw", duration: 7 },
    { icon: "💵", delay: 2.5, x: "20vw", duration: 12 },
    { icon: "🏆", delay: 3, x: "60vw", duration: 10 },
    { icon: "⭐", delay: 1, x: "40vw", duration: 9 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Elementos flotantes verticales - z-index bajo para no interferir con contenido */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-10"
          style={{ left: item.x, zIndex: 0 }}
          initial={{ y: "110vh", rotate: 0 }}
          animate={{
            y: "-10vh",
            rotate: 360,
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear",
          }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Burbujas decorativas */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute w-32 h-32 rounded-full border-2 border-yellow-400/10"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;