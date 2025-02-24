import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const fontSize = 32; // Slightly smaller for retro look
const padding = 15;
const height = fontSize + padding;

interface CounterProps {
  value: number;
  className?: string;
}

export function AnimatedCounter({ value, className = "" }: CounterProps) {
  // Calculate how many digits we need based on the value
  const numDigits = Math.max(Math.floor(Math.log10(value)) + 1, 1);
  const places = Array.from({ length: numDigits }, (_, i) => Math.pow(10, numDigits - i - 1));

  return (
    <div 
      className={`inline-flex bg-[#FDFBF7] rounded-lg p-2 shadow-inner overflow-hidden ${className}`}
      style={{
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      {places.map((place, i) => (
        <>
          <Digit key={i} place={place} value={value} />
          {i < places.length - 1 && i % 3 === 2 && (
            <span className="mx-1 self-center font-mono text-black">,</span>
          )}
        </>
      ))}
    </div>
  );
}

function Digit({ place, value }: { place: number; value: number }) {
  let valueRoundedToPlace = Math.floor(value / place);
  // Add some spring configuration for smoother animation
  let animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 100,
    damping: 30,
    mass: 1
  });

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div 
      style={{ height }} 
      className="relative w-[1ch] font-mono tabular-nums bg-[#FDFBF7] text-black overflow-hidden"
    >
      {[...Array(10).keys()].map((i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </div>
  );
}

function Number({ mv, number }: { mv: MotionValue; number: number }) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center font-mono text-black"
    >
      {number}
    </motion.span>
  );
} 