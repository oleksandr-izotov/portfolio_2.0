import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './ui/ImageWithFallback';
import liquidBackground from "../assets/liquid-bg.webp";
import { techStack } from '../data/tech';

const TechDrum = ({ label, items, duration, reverse = false }: { label: string, items: string[], duration: number, reverse?: boolean }) => {
  // Triple the items to ensure seamless infinite loop
  const extendedItems = [...items, ...items, ...items];
  
  return (
    <div className="flex flex-col gap-4 flex-1 min-w-[200px]">
      <div className="flex items-center gap-2 px-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-zinc-500">
          {label}
        </span>
      </div>
      
      <div className="relative h-64 border border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02] rounded-sm overflow-hidden group">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-20 dark:opacity-40 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* Highlight Frame */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 border-y border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 z-10 pointer-events-none flex items-center justify-between px-4">
           <div className="w-1 h-8 bg-blue-500" />
           <div className="w-1 h-8 bg-blue-500" />
        </div>

        {/* Rolling Container */}
        <motion.div
          animate={{ 
            y: reverse ? [0, -items.length * 64] : [-items.length * 64, 0] 
          }}
          transition={{ 
            duration: duration, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex flex-col"
        >
          {extendedItems.map((item, idx) => (
            <div 
              key={idx} 
              className="h-16 flex items-center justify-center px-6 whitespace-nowrap"
            >
              <span className="text-xl md:text-2xl font-black uppercase tracking-tighter text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors duration-300">
                {item}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Side Shadows for Depth */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white dark:from-[#0c0c0e] via-transparent to-white dark:to-[#0c0c0e]" />
      </div>

      <div className="flex justify-between px-2">
         <span className="text-[8px] font-mono text-gray-300 dark:text-zinc-800 uppercase tracking-widest">Async Rotation</span>
         <span className="text-[8px] font-mono text-blue-500 uppercase tracking-widest font-bold">Active</span>
      </div>
    </div>
  );
};

export const TechStack = () => {
  return (
    <section id="stack" className="relative py-24 px-6 overflow-hidden bg-white dark:bg-[#0c0c0e] border-t border-gray-100 dark:border-white/5">
      {/* Liquid Chrome Background for System Components */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.15]">
        <ImageWithFallback 
          src={liquidBackground} 
          alt="Technical Background"
          className="w-full h-full object-cover grayscale blur-[8px]"
        />
      </div>

      {/* Visual Section Divider */}
      <div className="absolute top-0 left-0 w-full flex justify-between px-6 -translate-y-1/2 pointer-events-none z-10">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-blue-500 rounded-full" />)}
        </div>
        <div className="text-[9px] font-mono text-gray-300 dark:text-zinc-800 uppercase tracking-[0.5em]">Section_02 // Stack</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 flex flex-col items-center text-center relative">
          {/* Floating Image Accent behind Title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-video opacity-[0.08] dark:opacity-[0.2] pointer-events-none blur-3xl">
            <ImageWithFallback src={liquidBackground} alt="" className="w-full h-full object-contain grayscale" />
          </div>

          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="h-[1px] w-8 bg-blue-500" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500">Tech Core Specification</span>
            <div className="h-[1px] w-8 bg-blue-500" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter dark:text-white leading-none relative z-10">
            System <span className="text-gray-300 dark:text-zinc-800">Components</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-stretch">
          {techStack.map((category) => (
            <TechDrum 
              key={category.label}
              label={category.label} 
              items={category.items} 
              duration={category.duration} 
              reverse={category.reverse} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
