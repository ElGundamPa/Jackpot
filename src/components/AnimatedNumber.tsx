import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number; // Duración en segundos (por defecto 28 segundos)
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (value: number) => string;
}

/**
 * Componente que anima un número de un valor inicial al valor final en una duración fija
 * La animación siempre dura exactamente 28 segundos sin importar el número
 * Incluye efectos visuales emocionantes: glow, pulse, scale y transiciones de color
 */
const AnimatedNumber = ({ 
  value, 
  duration = 28, 
  prefix = '', 
  suffix = '', 
  className = '', 
  formatter 
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(value);
  const targetValueRef = useRef<number>(value);
  const previousValueRef = useRef<number>(value);
  const displayValueRef = useRef<number>(value);
  const logStartValueRef = useRef<number>(value);
  const logTargetValueRef = useRef<number>(value);

  // Actualizar la referencia cuando cambia el displayValue
  useEffect(() => {
    displayValueRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    // Si el valor objetivo cambió, decidir si reiniciar la animación
    const valueDifference = Math.abs(value - previousValueRef.current);
    const targetDifference = isAnimating ? Math.abs(value - targetValueRef.current) : valueDifference;
    
    // Solo reiniciar si:
    // 1. El cambio es significativo (> 0.01)
    // 2. Y (NO estamos animando, O el cambio al target es muy grande (>1% del target), O la animación está casi completa (>98%))
    const isSignificantChange = valueDifference > 0.01;
    const isTargetChangeSignificant = isAnimating && targetDifference > Math.abs(targetValueRef.current) * 0.01;
    const shouldInterrupt = !isAnimating || isTargetChangeSignificant || animationProgress > 0.98;
    
    if (isSignificantChange && shouldInterrupt) {
      // Si hay una animación en progreso y el cambio al target es pequeño, solo actualizar el target sin reiniciar
      if (isAnimating && !isTargetChangeSignificant && animationProgress <= 0.98) {
        // Actualizar el target sin reiniciar la animación
        const currentStart = startValueRef.current;
        const currentTarget = targetValueRef.current;
        
        // Calcular el nuevo punto de inicio basado en el progreso actual
        const interpolatedValue = currentStart + (currentTarget - currentStart) * animationProgress;
        startValueRef.current = interpolatedValue;
        targetValueRef.current = value;
        logTargetValueRef.current = value;
        previousValueRef.current = value;
        
        console.log(`🔄 Actualizando target de animación (progreso: ${(animationProgress * 100).toFixed(1)}%): ${interpolatedValue.toLocaleString()} → ${value.toLocaleString()} (sin reiniciar)`);
        return; // No reiniciar la animación
      }
      
      // Cancelar animación anterior si existe
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Guardar el valor actual como punto de inicio (usando ref para evitar dependencias)
      const animationStartValue = displayValueRef.current;
      const animationTargetValue = value;
      
      startValueRef.current = animationStartValue;
      targetValueRef.current = animationTargetValue;
      logStartValueRef.current = animationStartValue;
      logTargetValueRef.current = animationTargetValue;
      previousValueRef.current = value;
      startTimeRef.current = null;
      setIsAnimating(true);
      setAnimationProgress(0);

      console.log(`🎬 Iniciando animación: ${animationStartValue.toLocaleString()} → ${animationTargetValue.toLocaleString()} (duración: ${duration}s)`);

      const animate = (currentTime: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = currentTime;
        }

        const elapsed = (currentTime - startTimeRef.current) / 1000; // Convertir a segundos
        const progress = Math.min(elapsed / duration, 1); // Progreso de 0 a 1
        setAnimationProgress(progress);
        
        // Actualizar targetValueRef por si cambió durante la animación (para permitir actualización suave)
        const currentTarget = targetValueRef.current;

        // Easing dramático y emocionante en 3 fases:
        // 1. Aceleración suave (0-25%): Construye expectativa
        // 2. Aceleración rápida y emocionante (25-75%): El momento pico
        // 3. Desaceleración dramática (75-100%): Llegada épica
        let easeOut;
        if (progress < 0.25) {
          // Primera fase: aceleración suave y constante (construye expectativa)
          const t = progress / 0.25;
          easeOut = t * t * t * 0.3; // Curva cúbica suave
        } else if (progress < 0.75) {
          // Segunda fase: aceleración rápida y emocionante (el momento pico)
          const t = (progress - 0.25) / 0.5;
          // Curva exponencial para una aceleración intensa
          easeOut = 0.3 + (Math.pow(t, 1.5) * 0.55); // Acelera más rápido en el medio
        } else {
          // Tercera fase: desaceleración dramática hacia el final (llegada épica)
          const t = (progress - 0.75) / 0.25;
          // Curva de ease-out suave pero definitiva
          easeOut = 0.85 + (1 - Math.pow(1 - t, 4)) * 0.15; // Curva cuarta potencia para suavidad
        }
        
        // Usar targetValueRef en lugar de value directamente para permitir actualizaciones suaves
        const currentValue = startValueRef.current + (currentTarget - startValueRef.current) * easeOut;
        setDisplayValue(currentValue);
        displayValueRef.current = currentValue;

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Asegurar que llegue exactamente al valor final
          setDisplayValue(value);
          displayValueRef.current = value;
          setIsAnimating(false);
          setAnimationProgress(1);
          
          // Log para verificar que completó la animación
          const totalElapsed = (currentTime - startTimeRef.current!) / 1000;
          console.log(`✅ Animación completada: ${logStartValueRef.current.toLocaleString()} → ${logTargetValueRef.current.toLocaleString()} en ${totalElapsed.toFixed(2)}s (objetivo: ${duration}s)`);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]); // Solo dependencias esenciales

  const formatValue = formatter 
    ? formatter(Math.floor(displayValue))
    : Math.floor(displayValue).toLocaleString();

  // Calcular intensidad del efecto visual basado en el progreso de la animación
  // Pulso más intenso durante la fase emocionante (25-75%)
  const phaseMultiplier = animationProgress >= 0.25 && animationProgress <= 0.75 ? 1.5 : 1;
  const glowIntensity = isAnimating 
    ? (Math.sin(animationProgress * Math.PI * 10) * 0.5 + 0.5) * phaseMultiplier // Pulso rápido e intenso
    : 0;
  
  // Escala que pulsa más fuerte durante la fase emocionante
  const baseScale = 1 + Math.sin(animationProgress * Math.PI * 8) * 0.15;
  const peakScale = animationProgress >= 0.4 && animationProgress <= 0.6 ? 1.05 : 1;
  const scaleIntensity = isAnimating
    ? baseScale * peakScale // Escala más dramática durante la animación
    : 1;

  // Color que cambia dinámicamente: dorado brillante durante la fase emocionante
  const baseHue = 45; // Dorado base
  const hueVariation = Math.sin(animationProgress * Math.PI * 6) * 20; // Oscila entre 25 y 65
  const peakHueBoost = animationProgress >= 0.4 && animationProgress <= 0.6 ? 10 : 0; // Más dorado en el pico
  const hue = isAnimating 
    ? baseHue + hueVariation + peakHueBoost
    : baseHue;
  
  // Saturación que aumenta durante la fase emocionante
  const saturation = isAnimating
    ? 85 + Math.sin(animationProgress * Math.PI * 4) * 15 + (phaseMultiplier > 1 ? 10 : 0)
    : 100;
  
  // Luminosidad que pulsa para crear efecto de brillo
  const lightness = isAnimating
    ? 60 + Math.sin(animationProgress * Math.PI * 8) * 15
    : 65;

  return (
    <motion.span 
      className={className}
      animate={{
        scale: scaleIntensity,
      }}
      transition={{
        duration: 0.1,
        ease: 'easeOut',
      }}
      style={{
        filter: isAnimating 
          ? `drop-shadow(0 0 ${10 + glowIntensity * 20}px rgba(255, 215, 0, ${0.5 + glowIntensity * 0.5})) 
             drop-shadow(0 0 ${15 + glowIntensity * 25}px rgba(255, 165, 0, ${0.3 + glowIntensity * 0.4}))
             drop-shadow(0 0 ${20 + glowIntensity * 30}px rgba(255, 140, 0, ${0.2 + glowIntensity * 0.3}))`
          : '',
        textShadow: isAnimating 
          ? [
              `0 0 ${15 + glowIntensity * 25}px rgba(255, 215, 0, ${0.4 + glowIntensity * 0.8})`,
              `0 0 ${25 + glowIntensity * 35}px rgba(255, 165, 0, ${0.3 + glowIntensity * 0.6})`,
              `0 0 ${35 + glowIntensity * 45}px rgba(255, 140, 0, ${0.2 + glowIntensity * 0.4})`,
              `0 0 ${45 + glowIntensity * 55}px rgba(255, 69, 0, ${0.1 + glowIntensity * 0.3})`,
            ].join(', ')
          : '',
      }}
    >
      {prefix}
      <motion.span
        animate={{
          color: isAnimating 
            ? [
                `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                `hsl(${hue + 5}, ${Math.min(saturation + 5, 100)}%, ${Math.min(lightness + 10, 90)}%)`,
                `hsl(${hue}, ${saturation}%, ${lightness}%)`
              ]
            : undefined,
        }}
        transition={{
          duration: 0.6,
          repeat: isAnimating ? Infinity : 0,
          ease: 'easeInOut',
        }}
        style={{
          display: 'inline-block',
          fontWeight: isAnimating ? 900 : 'inherit',
          transition: 'font-weight 0.3s ease',
        }}
      >
        {formatValue}
      </motion.span>
      {suffix}
    </motion.span>
  );
};

export default AnimatedNumber;
