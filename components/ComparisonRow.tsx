import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { SectionData } from '../types';

interface ComparisonRowProps {
  data: SectionData;
  index: number;
}

export const ComparisonRow: React.FC<ComparisonRowProps> = ({ data, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  
  // Parallax effect for text
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yRight = useTransform(scrollYProgress, [0, 1], [200, -200]); // Different speed for disconnect feel

  return (
    <div ref={ref} className="min-h-screen w-full flex relative z-10 snap-center pointer-events-none">
      {/* Background Year Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] md:text-[250px] font-bold opacity-[0.03] whitespace-nowrap font-mono select-none tracking-tighter">
        {data.year}
      </div>

      {/* Left Content (Merc) */}
      <div className="w-1/2 flex items-center justify-start pl-4 md:pl-24 pr-4 md:pr-12">
        <motion.div 
          style={{ y: yLeft, opacity: isInView ? 1 : 0 }}
          className="text-left transition-opacity duration-700"
        >
          <h2 className="font-serif text-3xl md:text-6xl text-merc-accent mb-6 leading-[1.1]">
            {data.mercTitle}
          </h2>
          <p className="font-serif text-merc-text text-lg md:text-xl leading-relaxed italic opacity-80 max-w-md">
            {data.mercBody}
          </p>
          <div className="mt-8 h-[1px] w-24 bg-merc-accent/50" />
        </motion.div>
      </div>

      {/* Right Content (Tesla) */}
      <div className="w-1/2 flex items-center justify-end pr-4 md:pr-24 pl-4 md:pl-12">
        <motion.div 
           style={{ y: yRight, opacity: isInView ? 1 : 0 }}
           className="text-right transition-opacity duration-700 delay-100"
        >
          <h2 className="font-sans font-black text-2xl md:text-5xl text-white mb-6 uppercase tracking-wider leading-[1.1]">
            {data.teslaTitle}
          </h2>
          <p className="font-mono text-tesla-text text-sm md:text-base leading-relaxed opacity-80 max-w-md ml-auto">
            {data.teslaBody}
          </p>
          <div className="mt-8 h-1 w-24 bg-tesla-cyber ml-auto shadow-[0_0_15px_rgba(0,240,255,0.6)]" />
        </motion.div>
      </div>
    </div>
  );
};
