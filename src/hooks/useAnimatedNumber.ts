import { useState, useEffect, useRef } from 'react';

interface UseAnimatedNumberOptions {
  duration?: number; // Duración en milisegundos (por defecto 4000ms = 4 segundos)
  initialValue?: number;
}

/**
 * Hook personalizado para animar un número de un valor inicial a un valor final
 * en una duración fija de 4 segundos
 */
export const useAnimatedNumber = (
  targetValue: number,
  options: UseAnimatedNumberOptions = {}
) => {
  const { duration = 4000, initialValue = 0 } = options;
  const [displayValue, setDisplayValue] = useState(initialValue);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef<number>(initialValue);
  const previousTargetRef = useRef<number>(initialValue);

  useEffect(() => {
    // Si el valor objetivo cambió, actualizar el valor inicial
    if (targetValue !== previousTargetRef.current) {
      startValueRef.current = displayValue;
      previousTargetRef.current = targetValue;
      startTimeRef.current = undefined;
    }

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1); // 0 a 1

      // Función de easing ease-out para suavidad
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValueRef.current + (targetValue - startValueRef.current) * easeOut;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Asegurar que llegue exactamente al valor final
        setDisplayValue(targetValue);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration, displayValue]);

  return Math.floor(displayValue);
};
