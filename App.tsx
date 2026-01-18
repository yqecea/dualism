import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { CoreEngine } from './components/CoreEngine';
import { ComparisonRow } from './components/ComparisonRow';
import { SECTIONS } from './constants';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Custom cursor state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      backgroundColor: "white",
      mixBlendMode: "difference" as any,
    },
    text: {
      height: 80,
      width: 80,
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      backgroundColor: "white",
      mixBlendMode: "difference" as any,
    }
  };


  return (
    <div 
      ref={containerRef} 
      className="relative bg-black text-white selection:bg-merc-accent selection:text-black min-h-[400vh] cursor-none"
    >
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[100] hidden md:block"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Fixed Background Elements */}
      <div className="fixed inset-0 z-0 flex">
        {/* Left Background (Merc) */}
        <div className="w-1/2 h-full bg-[#080808] border-r border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none mix-blend-overlay" />
           <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-merc-accent/10 to-transparent" />
        </div>
        
        {/* Right Background (Tesla) */}
        <div className="w-1/2 h-full bg-[#050505] relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,240,255,0.03),_transparent_70%)]" />
           <div className="absolute top-0 right-0 w-full h-[30%] bg-gradient-to-b from-tesla-cyber/5 to-transparent" />
           {/* Grid lines */}
           <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
      </div>

      {/* Fixed Central Scrubber / Visualization */}
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <CoreEngine scrollYProgress={scrollYProgress} />
      </div>
      
      {/* Scrollable Content */}
      <main className="relative z-20 pt-[50vh] pb-[50vh]">
        
        {/* Hero Text */}
        <div className="h-[60vh] flex items-center justify-center w-full mb-24 relative pointer-events-auto">
            <div className="w-full flex justify-between px-4 md:px-24">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-left"
                  onMouseEnter={() => setCursorVariant("text")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                    <h1 className="font-serif text-5xl md:text-8xl text-merc-accent tracking-tight">Legacy</h1>
                    <p className="font-serif italic text-white/50 mt-2">Est. 1886</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 50 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-right"
                  onMouseEnter={() => setCursorVariant("text")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                    <h1 className="font-sans font-bold text-5xl md:text-8xl text-white tracking-tighter uppercase">Future</h1>
                    <p className="font-mono text-tesla-cyber mt-2">Est. 2003</p>
                </motion.div>
            </div>
            
            <motion.div 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono uppercase tracking-[0.3em] animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                Scroll to Evolve
            </motion.div>
        </div>

        {/* Comparison Sections */}
        <div className="space-y-[30vh]">
          {SECTIONS.map((section, idx) => (
            <ComparisonRow key={section.id} data={section} index={idx} />
          ))}
        </div>

        {/* Footer / CTA */}
        <div className="h-[80vh] flex items-center justify-center relative pointer-events-auto" onMouseEnter={() => setCursorVariant("text")} onMouseLeave={() => setCursorVariant("default")}>
            <div className="text-center">
                <h2 className="text-4xl md:text-7xl font-sans font-black uppercase tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-merc-accent via-white to-tesla-cyber">
                    Choose Your Era
                </h2>
                <div className="flex gap-8 justify-center">
                    <button className="px-8 py-3 border border-merc-accent text-merc-accent font-serif hover:bg-merc-accent hover:text-black transition-colors duration-300">
                        Configure SL
                    </button>
                    <button className="px-8 py-3 bg-white text-black font-sans font-bold uppercase hover:bg-tesla-cyber hover:text-black hover:shadow-[0_0_20px_#00f0ff] transition-all duration-300">
                        Order Plaid
                    </button>
                </div>
            </div>
        </div>
      </main>

      {/* Progress Bar (Bottom) */}
      <motion.div 
        className="fixed bottom-0 left-0 h-1 bg-gradient-to-r from-merc-accent to-tesla-cyber z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
