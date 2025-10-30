import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== POWER BAR COMPONENT ====================
interface PowerBarProps {
  currentEnergy: number;
  threshold: number;
  exploded: boolean;
}

export function PowerBar({ currentEnergy, threshold, exploded }: PowerBarProps) {
  const percentage = Math.min((currentEnergy / threshold) * 100, 100);
  const [showShockwave, setShowShockwave] = useState(false);

  useEffect(() => {
    if (exploded) {
      setShowShockwave(true);
      const timer = setTimeout(() => setShowShockwave(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [exploded]);

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        {/* Energy Label */}
        <div className="flex justify-between mb-2 px-2">
          <span className="text-[#00ff88] font-bold text-lg">PSYCHIC ENERGY</span>
          <span className="text-white font-bold text-lg">{Math.round(currentEnergy)}%</span>
        </div>

        {/* Power Bar Container */}
        <div className="relative h-12 bg-black/60 rounded-lg border-2 border-[#00ff88]/30 overflow-hidden shadow-lg">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-10 h-full">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="border-r border-[#00ff88]/20" />
              ))}
            </div>
          </div>

          {/* Energy Fill */}
          <motion.div
            className="absolute inset-y-0 left-0"
            initial={{ width: 0 }}
            animate={{ 
              width: `${percentage}%`,
              background: exploded 
                ? 'linear-gradient(to right, #ff0055, #ff3377)'
                : 'linear-gradient(to right, #00ff88, #00ffaa)'
            }}
            transition={{ 
              width: { type: 'spring', stiffness: 100, damping: 20 },
              background: { duration: 0.2 }
            }}
          >
            {/* Animated Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            />
          </motion.div>

          {/* Danger Glow at High Energy */}
          {percentage > 80 && !exploded && (
            <motion.div
              className="absolute inset-0 bg-red-500/20"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}

          {/* Shockwave Effect */}
          <AnimatePresence>
            {showShockwave && (
              <>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-4 border-[#ff0055] rounded-lg"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Energy Particles */}
        <AnimatePresence>
          {percentage > 70 && !exploded && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#00ff88] rounded-full"
                  initial={{ 
                    x: '50%', 
                    y: '50%', 
                    opacity: 0 
                  }}
                  animate={{
                    x: `${50 + Math.cos(i * Math.PI / 4) * 100}%`,
                    y: `${50 + Math.sin(i * Math.PI / 4) * 100}%`,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: i * 0.1,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Explosion Alert */}
      {exploded && (
        <motion.div 
          className="text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <span className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg shadow-red-500/50">
            💥 EXPLOSION! Energy Reset to 0
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ==================== EXPLOSION SCENE COMPONENT ====================
interface ExplosionSceneProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function ExplosionScene({ isActive, onComplete }: ExplosionSceneProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => {
        setPhase(0);
        onComplete?.();
      }, 3500)
    ];

    return () => timers.forEach(clearTimeout);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Pulsating Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[#0a0a23] via-purple-900 to-black"
          animate={{
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
        />

        {/* Psychic Aura Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2"
              initial={{ width: 100, height: 100, opacity: 0 }}
              animate={{
                width: [100, 800],
                height: [100, 800],
                opacity: [0.8, 0],
                borderColor: ['#00ff88', '#ff0055']
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: i * 0.3,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-[#00ff88] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                delay: Math.random() * 2,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-6">
          {/* Phase 1: Title Fade In */}
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-wider">
                MOB PSYCHO 100
              </h1>
              <p className="text-2xl md:text-3xl text-[#00ff88] font-light">
                Psychic Energy Accumulation
              </p>
            </motion.div>
          )}

          {/* Phase 2: Glowing Eyes */}
          {phase >= 2 && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center space-x-8">
                {[0, 1].map((i) => (
                  <motion.div
                    key={i}
                    className="w-16 h-16 rounded-full bg-[#00ff88]"
                    animate={{
                      boxShadow: [
                        '0 0 20px #00ff88',
                        '0 0 60px #00ff88',
                        '0 0 20px #00ff88'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Phase 3: Explosion */}
          {phase >= 3 && (
            <motion.div
              className="mt-12"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <motion.div
                  className="text-6xl md:text-8xl font-bold"
                  animate={{
                    textShadow: [
                      '0 0 20px #ff0055',
                      '0 0 60px #ff0055',
                      '0 0 20px #ff0055'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  💥 EXPLOSION 💥
                </motion.div>
                <p className="text-3xl text-white mt-4 font-bold">
                  TRIGGERED
                </p>
              </div>

              {/* Burst Particles */}
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-gradient-to-r from-[#ff0055] to-[#00ff88] rounded-full"
                  style={{
                    left: '50%',
                    top: '50%'
                  }}
                  animate={{
                    x: Math.cos(i * Math.PI / 8) * 300,
                    y: Math.sin(i * Math.PI / 8) * 300,
                    opacity: [1, 0],
                    scale: [1, 0]
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Screen Flash */}
        {phase === 3 && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ==================== PSYCHIC BACKGROUND COMPONENT ====================
interface PsychicBackgroundProps {
  intensity?: number;
}

export function PsychicBackground({ intensity = 0.5 }: PsychicBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a23] via-purple-950/50 to-black" />

      {/* Lightning Streaks */}
      {intensity > 0.7 && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-full w-1 bg-gradient-to-b from-transparent via-[#00ff88] to-transparent"
              style={{
                left: `${20 + i * 30}%`,
                filter: 'blur(2px)'
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scaleY: [0.5, 1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: i * 0.3,
                ease: 'easeInOut'
              }}
            />
          ))}
        </>
      )}

      {/* Floating Energy Orbs */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#00ff88] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(1px)'
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/80" />
    </div>
  );
}