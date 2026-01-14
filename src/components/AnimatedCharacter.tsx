// src/components/AnimatedCharacter.tsx
import { motion, easeInOut } from "framer-motion";

interface AnimatedCharacterProps {
  character: "wizard" | "duck" | "rocket" | "trophy" | "star";
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  size?: "sm" | "md" | "lg";
}

const AnimatedCharacter = ({ character, position, size = "md" }: AnimatedCharacterProps) => {
  
  // 🎭 Definir personajes con sus emojis y animaciones
  const characters = {
    wizard: { emoji: "🧙‍♂️", animation: "float" },
    duck: { emoji: "🦆", animation: "waddle" },
    rocket: { emoji: "🚀", animation: "fly" },
    trophy: { emoji: "🏆", animation: "spin" },
    star: { emoji: "⭐", animation: "twinkle" }
  };

  // 📏 Tamaños
  const sizes = {
    sm: "text-6xl",
    md: "text-8xl",
    lg: "text-9xl"
  };

  // 📍 Posiciones - Ajustadas para evitar superposiciones con contenido principal
  const positions = {
    "bottom-left": "bottom-8 left-8",
    "bottom-right": "bottom-8 right-8",
    "top-left": "top-2 left-2", // Movido más arriba y a la izquierda
    "top-right": "top-2 right-2" // Movido más arriba y a la derecha
  };

  // 🎬 Animaciones personalizadas
  const animations = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easeInOut
      }
    },
    waddle: {
      x: [0, 10, -10, 0],
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: easeInOut
      }
    },
    fly: {
      y: [0, -30, 0],
      x: [0, 5, -5, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: easeInOut
      }
    },
    spin: {
      rotate: [0, 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: (t: number) => t
      }
    },
    twinkle: {
      opacity: [1, 0.3, 1],
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: easeInOut
      }
    }
  };

  const selectedChar = characters[character];
  const animationType = selectedChar.animation as keyof typeof animations;

  return (
    <motion.div
      className={`fixed ${positions[position]} z-5 pointer-events-none select-none opacity-30`}
      animate={animations[animationType]}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 0.3, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      {/* Brillo detrás del personaje */}
      <div className="absolute inset-0 blur-2xl opacity-50 bg-yellow-400/30 rounded-full" />
      
      {/* Personaje */}
      <div className={`relative ${sizes[size]} drop-shadow-2xl filter`}>
        {selectedChar.emoji}
      </div>
      
      {/* Partículas decorativas */}
      <motion.div
        className="absolute -top-4 -right-4 text-2xl"
        animate={{
          y: [0, -10, 0],
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5
        }}
      >
        ✨
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCharacter;