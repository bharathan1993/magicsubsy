import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Heart, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface CelebrationAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

interface SparkleItem {
  id: number;
  x: number;
  y: number;
  delay: number;
  icon: React.ReactNode;
}

export function CelebrationAnimation({ 
  isActive, 
  onComplete, 
  duration = 3000 
}: CelebrationAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);

  const colors = [
    "#3B82F6", // blue-500
    "#6366F1", // indigo-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
    "#F59E0B", // amber-500
    "#10B981", // emerald-500
    "#EF4444", // red-500
  ];

  const sparkleIcons = [
    <Sparkles className="w-full h-full" />,
    <Star className="w-full h-full" />,
    <Heart className="w-full h-full" />,
    <Zap className="w-full h-full" />,
  ];

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const newConfetti: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
      }));

      // Generate sparkles
      const newSparkles: SparkleItem[] = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        icon: sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)],
      }));

      setConfetti(newConfetti);
      setSparkles(newSparkles);

      // Auto-complete after duration
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setConfetti([]);
      setSparkles([]);
    }
  }, [isActive, duration, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Confetti */}
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute rounded-full"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
              }}
              initial={{
                y: piece.y,
                rotate: piece.rotation,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: piece.rotation + 720,
                opacity: 0,
              }}
              transition={{
                duration: 3,
                delay: piece.delay,
                ease: "easeIn",
              }}
            />
          ))}

          {/* Sparkles */}
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute text-yellow-400"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: "24px",
                height: "24px",
              }}
              initial={{
                scale: 0,
                rotate: 0,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1.5, 1, 1.2, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: sparkle.delay,
                ease: "easeInOut",
              }}
            >
              {sparkle.icon}
            </motion.div>
          ))}

          {/* Central burst effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 1.5, 0], opacity: [0, 1, 0.8, 0] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Radiating circles */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-4 border-blue-400"
                  style={{
                    width: 100 + i * 50,
                    height: 100 + i * 50,
                    left: -(50 + i * 25),
                    top: -(50 + i * 25),
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                />
              ))}
              
              {/* Central star */}
              <motion.div
                className="w-16 h-16 text-yellow-400"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1.5, 1], rotate: 360 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Star className="w-full h-full fill-current" />
              </motion.div>
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}