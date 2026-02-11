import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { Sparkles, ArrowRight, FileDown } from 'lucide-react';
import backgroundImage from '../assets/background.webp';
import cvFile from '../assets/Oleksandr_Izotov_CV.pdf';

const MarqueeItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-16 px-8">
    {children}
  </div>
);

const Marquee = () => {
  return (
    <div className="relative w-full overflow-hidden py-6 bg-transparent border-t border-gray-100 dark:border-white/5">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1500] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center">
            <MarqueeItem>
              <span className="text-[10px] font-mono font-medium text-gray-400 dark:text-zinc-600 uppercase tracking-[0.4em]">
                Stuttgart / Germany
              </span>
            </MarqueeItem>
            <MarqueeItem>
              <span className="text-[10px] font-mono font-medium text-gray-400 dark:text-zinc-600 uppercase tracking-[0.4em]">
                Software Engineering
              </span>
            </MarqueeItem>
            <MarqueeItem>
              <span className="text-[10px] font-mono font-medium text-gray-400 dark:text-zinc-600 uppercase tracking-[0.4em]">
                Available 2026
              </span>
            </MarqueeItem>
            <MarqueeItem>
              <span className="text-[10px] font-mono font-medium text-gray-400 dark:text-zinc-600 uppercase tracking-[0.4em]">
                System Architecture
              </span>
            </MarqueeItem>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center md:justify-between bg-transparent overflow-hidden pt-24 pb-12 md:pt-32 md:pb-0 px-0">
      
      {/* Dynamic Background Element */}
      <motion.div 
        animate={{ 
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 z-0 opacity-10 dark:opacity-30"
      >
        <ImageWithFallback 
          src={backgroundImage} 
          alt="Technical Background"
          className="w-full h-full object-cover grayscale blur-[2px]"
        />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl px-6 flex-1 flex flex-col justify-center">
        
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="px-4 py-1.5 rounded-full border border-gray-100 dark:border-white/10 flex items-center gap-2 backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">System Core v2.0 // Active</span>
          </div>
        </motion.div>

        {/* The Name Component */}
        <div 
          className="relative text-center cursor-default group py-6 md:py-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-[13vw] md:text-[12vw] lg:text-[160px] font-black tracking-[-0.08em] leading-[0.9] md:leading-[0.8] mb-4 dark:text-white transition-all duration-700 group-hover:tracking-wider group-hover:opacity-10 group-hover:blur-sm">
              OLEKSANDR<br />IZOTOV
            </h1>

            {/* Hover Content */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="text-center"
                  >
                    <div className="relative inline-block">
                      <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter italic dark:text-blue-500">
                        ENGINEERING<br />ARTISTRY
                      </h2>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="h-1 bg-blue-600 mt-2 rounded-full"
                      />
                    </div>
                    <p className="mt-8 text-[11px] font-mono uppercase tracking-[0.6em] text-gray-400">
                      Precision Built in Stuttgart
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-8 md:mt-12 mb-12 md:mb-20 w-full max-w-sm md:max-w-none mx-auto"
        >

          {/* Primary Action: Start Collaboration */}
          <a 
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative flex items-center justify-center w-full md:w-auto gap-6 px-10 py-4 bg-zinc-950 dark:bg-white rounded-full transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
          >
             {/* Hover Fill Effect */}
             <div className="absolute inset-0 bg-blue-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.19,1,0.22,1]" />
             
             <div className="relative z-10 flex flex-col items-start">
                <span className="text-[7px] font-mono font-bold uppercase tracking-[0.3em] text-blue-500 mb-0.5 group-hover:text-white/70 transition-colors italic">Active // Connect</span>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white dark:text-zinc-950 group-hover:text-white transition-colors">Start Collaboration</span>
             </div>
             
             <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowRight size={14} className="text-white dark:text-zinc-950 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
             </div>
          </a>

          {/* Secondary Action: Download CV */}
          <a 
            href={cvFile}
            download="Oleksandr_Izotov_CV.pdf"
            className="group relative flex items-center justify-center w-full md:w-auto gap-6 px-10 py-4 bg-white/50 dark:bg-transparent border border-zinc-200 dark:border-white/10 rounded-full transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 overflow-hidden backdrop-blur-sm"
          >
             {/* Hover Grid Reveal */}
             <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:10px_10px] transition-opacity duration-500" />
             
             <div className="relative z-10 flex flex-col items-start">
                <span className="text-[7px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400 group-hover:text-blue-500 transition-colors italic">System // Dossier</span>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">Download CV</span>
             </div>
             
             <div className="relative z-10 w-8 h-8 rounded-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                <FileDown size={14} className="text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 transition-colors" />
             </div>
          </a>
        </motion.div>
      </div>

      {/* INFINITE MARQUEE CAROUSEL */}
      <div className="w-full mt-auto">
        <Marquee />
      </div>

      {/* Decorative Blueprint Corner */}
      <div className="absolute top-0 right-0 p-8 hidden lg:block opacity-20">
         <div className="flex flex-col items-end gap-2 border-r-2 border-t-2 border-blue-600 pr-4 pt-4">
            <span className="text-[10px] font-mono font-black text-blue-600">STG-2026</span>
            <Sparkles size={12} className="text-blue-600" />
         </div>
      </div>

    </section>
  );
};
