import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

interface CoreEngineProps {
  scrollYProgress: MotionValue<number>;
}

export const CoreEngine: React.FC<CoreEngineProps> = ({ scrollYProgress }) => {
  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // TRANSFORMATIONS

  // 1. Rotation: Merc oscillates (idle vibration), Tesla spins (turbine)
  // We'll blend these using opacity, but let's animate the main container too.
  const rotate = useTransform(smoothProgress, [0, 1], [0, 360]);
  
  // 2. Color shift: Amber to Cyan
  const strokeColor = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ['#c9a45c', '#ffffff', '#00f0ff']
  );

  // 3. Shape Morphing (Piston/Crankshaft -> Coil/Magnetic Field)
  // Since we can't morph paths easily without same point count, we use opacity blending of two groups.
  const mercOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const teslaOpacity = useTransform(smoothProgress, [0.6, 1], [0, 1]);
  const transitionOpacity = useTransform(smoothProgress, [0.3, 0.5, 0.7], [0, 1, 0]);

  // 4. Scale Pulse
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 1]);
  
  // 5. Complexity (Dash array)
  // Merc: Chaos/Short dashes. Tesla: Solid/Long smooth lines.
  const dashArray = useTransform(smoothProgress, [0, 1], ["10 5", "100 0"]);


  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <motion.div 
        style={{ scale }}
        className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
      >
        {/* Glow Filter */}
        <svg className="absolute w-full h-full overflow-visible">
          <defs>
            <filter id="glow-merc" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-tesla" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="
                0 0 0 0 0
                0 1 0 0 1
                0 1 1 0 1
                0 0 0 1 0" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Gradient for Tesla Ring */}
            <linearGradient id="teslaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#00f0ff" />
            </linearGradient>
          </defs>

          {/* SHARED OUTER RING - The Timeline */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeDasharray={dashArray}
            style={{ rotate: useTransform(rotate, r => r * -1) }} // Counter rotate ring
            className="opacity-50"
          />
          
          {/* MERCEDES LAYER (Combustion) */}
          <motion.g style={{ opacity: mercOpacity }}>
            {/* Piston / Crankshaft abstraction */}
            <motion.path
              d="M150,100 L350,100 L300,400 L200,400 Z" // Rough engine block shape
              fill="none"
              stroke="#c9a45c"
              strokeWidth="4"
              className="md:hidden" // simple mobile fallback
            />
            {/* Complex Geometric Pattern for Desktop */}
            <motion.circle cx="50%" cy="50%" r="30%" stroke="#c9a45c" strokeWidth="1" fill="none" />
            <motion.path
               d="M 250 50 L 250 450 M 50 250 L 450 250 M 100 100 L 400 400 M 400 100 L 100 400"
               stroke="#c9a45c"
               strokeWidth="2"
               strokeLinecap="square"
               className="opacity-30"
            />
             {/* Rotating Gears */}
            <motion.g style={{ rotate }}>
              {[...Array(8)].map((_, i) => (
                <rect
                  key={i}
                  x="235"
                  y="20"
                  width="30"
                  height="80"
                  fill="#c9a45c"
                  transform={`rotate(${i * 45} 250 250)`}
                  className="opacity-80"
                />
              ))}
            </motion.g>
          </motion.g>

          {/* TRANSITION LAYER (The Meltdown) */}
          <motion.g style={{ opacity: transitionOpacity }}>
            {/* Expanding/Exploding particles */}
            {[...Array(12)].map((_, i) => (
               <motion.circle
                 key={`t-${i}`}
                 cx="50%"
                 cy="50%"
                 r="5"
                 fill="white"
                 style={{
                    x: useTransform(smoothProgress, [0.3, 0.7], [0, (i % 2 === 0 ? 100 : -100) * (Math.random() + 0.5)]),
                    y: useTransform(smoothProgress, [0.3, 0.7], [0, (i % 3 === 0 ? 100 : -100) * (Math.random() + 0.5)]),
                    scale: useTransform(smoothProgress, [0.3, 0.5, 0.7], [0.5, 2, 0])
                 }}
               />
            ))}
          </motion.g>


          {/* TESLA LAYER (Induction) */}
          <motion.g style={{ opacity: teslaOpacity }}>
            {/* Magnetic Field Lines */}
            <motion.circle cx="50%" cy="50%" r="20%" stroke="url(#teslaGrad)" strokeWidth="4" fill="none" filter="url(#glow-tesla)" />
            <motion.circle cx="50%" cy="50%" r="35%" stroke="url(#teslaGrad)" strokeWidth="1" fill="none" opacity="0.5" />
            <motion.circle cx="50%" cy="50%" r="42%" stroke="url(#teslaGrad)" strokeWidth="1" fill="none" strokeDasharray="4 4" opacity="0.3" />
            
            {/* Rapidly spinning rotor */}
            <motion.g style={{ rotate: useTransform(rotate, r => r * 5) }}> 
               <path d="M 250 150 L 250 350" stroke="#00f0ff" strokeWidth="6" strokeLinecap="round" />
               <path d="M 150 250 L 350 250" stroke="#00f0ff" strokeWidth="6" strokeLinecap="round" />
            </motion.g>
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
};
