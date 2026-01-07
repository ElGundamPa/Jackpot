import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AnimatedGifCharacterProps {
  type: "wizard" | "duck" | "dogs" | "custom"; 
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right" | "bottom-center";
  customGifUrl?: string;
  size?: number; 
  animation?: "float" | "bounce" | "swing" | "none";
  offsetY?: number; // ✅ NUEVO: para ajustar la posición vertical
}

const AnimatedGifCharacter = ({ 
  type, 
  position, 
  customGifUrl, 
  size = 500, 
  animation = "float",
  offsetY = 0 // ✅ NUEVO: offset vertical
}: AnimatedGifCharacterProps) => {
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 500);
  }, []);

  // 🎨 GALERÍA DE PERSONAJES
  const characterGifs = {
    duck: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDhiOHl4MHk4cW9xZDM5MDFqYWE0aHVvb3hzcmJ1MjVhN3hvbWZudSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/0lSN22TNPgoeh2tEwo/giphy.gif",
    wizard: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDdscWN6Y2l2dmdxNnp1N3U0ZHFham5oYjBtemx0OWxoOTg0eTNvcCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/BnXU1WJCrcEpie46CZ/giphy.gif",
    dogs: "https://firebasestorage.googleapis.com/v0/b/verdeando-3baf2.appspot.com/o/perros.png?alt=media&token=1e0718c4-f552-42b4-81e5-6e4188241eee",
    custom: customGifUrl || ""
  };

  // 📍 Posiciones MEJORADAS
  const getPositionClasses = () => {
    switch(position) {
      case "bottom-left":
        return "bottom-0 left-0";
      case "bottom-right":
        return "bottom-0 right-0";
      case "top-left":
        return "top-20 left-0";
      case "top-right":
        return "top-20 right-0";
      case "bottom-center":
        return "left-1/2 -translate-x-1/2"; // ✅ Sin "bottom-0" para controlarlo con style
      default:
        return "bottom-0 left-0";
    }
  };

  // 🎯 Escala según posición
  const getScale = () => {
    if (position === "bottom-center") return 1.2;
    if (position === "bottom-left" || position === "bottom-right") return 1.8;
    return 1.5;
  };

  // ✅ Posición vertical dinámica
  const getBottomPosition = () => {
    if (position === "bottom-center") {
      return `${offsetY}px`; // Usa el offset personalizado
    }
    return "0px";
  };

  const animationVariants = {
    float: {
      initial: { opacity: 0, y: 50 },
      animate: { 
        opacity: 1, 
        y: [0, -15, 0], 
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }
    },
    bounce: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { 
        opacity: 1, 
        y: [0, -20, 0],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeOut" }
      }
    },
    none: {
      initial: { opacity: 0 },
      animate: { opacity: 1 }
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed ${getPositionClasses()} z-50 pointer-events-none`}
      initial={animationVariants[animation]?.initial || { opacity: 0 }}
      animate={animationVariants[animation]?.animate || { opacity: 1 }}
      style={{
        width: size,
        height: size,
        bottom: getBottomPosition(), // ✅ Control dinámico de posición vertical
      }}
    >
      <div className="relative w-full h-full">
        <img 
          src={characterGifs[type]} 
          alt={type}
          className="w-full h-full object-contain filter drop-shadow-xl origin-bottom"
          style={{
            transform: `scale(${getScale()})`,
          }}
          onLoad={() => console.log(`✅ ${type} cargado en ${position}`)}
          onError={(e) => console.error(`❌ Error cargando ${type}:`, e)}
        />
      </div>

      {/* Partículas solo para wizard y duck */}
      {(type === "wizard" || type === "duck") && [...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          style={{
            top: `${10 + i * 20}%`,
            left: `${20 + i * 10}%`
          }}
          animate={{
            y: [-20, -60],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8
          }}
        >
          ✨
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedGifCharacter;