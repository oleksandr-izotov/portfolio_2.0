import React from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, Activity, Zap, GitBranch, Layers, 
  GraduationCap, Briefcase, Code2, Globe, Database, Server, Cpu
} from 'lucide-react';

const BentoBox = ({ children, className = '', delay = 0, noPadding = false }: { children: React.ReactNode, className?: string, delay?: number, noPadding?: boolean }) => (
  <motion.div
    initial={{ opacity: 1, y: 0 }}
    className={`bg-white dark:bg-[#161618] border border-gray-100 dark:border-white/5 ${noPadding ? '' : 'p-5 md:p-8'} hover:border-black dark:hover:border-blue-500/50 transition-all duration-500 group relative overflow-hidden rounded-sm ${className}`}
  >
    {children}
  </motion.div>
);

const TimelineItem = ({ title, subtitle, date, type, current = false }: { title: string, subtitle: string, date: string, type: 'edu' | 'work', current?: boolean }) => (
  <div className="relative pl-6 md:pl-8 pb-8 last:pb-0 group/time">
    <div className="absolute left-[9px] md:left-[11px] top-0 bottom-0 w-[1px] bg-gray-100 dark:bg-white/5 group-last/time:h-4" />
    <div className={`absolute left-0 top-1 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
      current 
        ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
        : 'bg-white dark:bg-[#1a1a1c] border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500 group-hover/time:border-blue-500'
    }`}>
      {type === 'edu' ? <GraduationCap size={10} className="md:w-3 md:h-3" /> : <Briefcase size={10} className="md:w-3 md:h-3" />}
    </div>
    <div className="transition-transform group-hover/time:translate-x-1 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
        <h4 className={`text-sm font-bold uppercase tracking-tight ${current ? 'text-blue-500 dark:text-blue-400' : 'dark:text-white'}`}>
          {title}
        </h4>
        <span className="text-[9px] md:text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full self-start">
          {date}
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wide font-bold">{subtitle}</p>
    </div>
  </div>
);

const ArchitectureBlueprint = () => {
  return (
    <div className="relative h-full min-h-[300px] w-full bg-gray-50 dark:bg-[#0c0c0e] overflow-hidden p-5 md:p-8 font-mono hidden md:block">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 dark:opacity-20" />
      
      {/* Schematic Lines (Static) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40">
        <path d="M 100 150 L 250 150 M 250 150 L 250 100 M 250 150 L 250 200 M 250 150 L 400 150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-blue-500" />
      </svg>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 h-full items-center">
        {/* Client Layer */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border border-blue-500/30 bg-white dark:bg-[#1a1a1c] flex items-center justify-center rounded-sm group-hover:border-blue-500 transition-colors shadow-lg shadow-blue-500/5">
            <Globe size={24} className="text-blue-500" />
          </div>
          <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Client Layer</span>
        </div>

        {/* Logic Layer */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 border-2 border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 flex items-center justify-center rounded-sm relative group-hover:scale-110 transition-transform">
            <Server size={28} className="text-blue-500" />
            {/* Pulsing indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#0c0c0e] animate-pulse" />
          </div>
          <span className="text-[8px] uppercase tracking-widest text-blue-500 font-bold">API / Engine</span>
        </div>

        {/* Data Layer */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border border-blue-500/30 bg-white dark:bg-[#1a1a1c] flex items-center justify-center rounded-sm group-hover:border-blue-500 transition-colors">
            <Database size={24} className="text-blue-500" />
          </div>
          <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Persistence</span>
        </div>
      </div>

      {/* Decorative Technical Stats */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-between">
        <div className="flex flex-col">
          <span className="text-[7px] text-gray-400 uppercase tracking-tighter">Latency</span>
          <span className="text-[10px] text-blue-500 font-bold">~24ms</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[7px] text-gray-400 uppercase tracking-tighter">Uptime</span>
          <span className="text-[10px] text-blue-500 font-bold">99.9%</span>
        </div>
      </div>

      {/* "Scanning" Effect — only animate when in view */}
      <motion.div
        whileInView={{ translateY: ['0%', '1000%'] }}
        viewport={{ once: false }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none"
      />
    </div>
  );
};

export const BentoGrid = () => {
  return (
    <section id="about" className="relative py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto border-t border-gray-100 dark:border-white/5">
      {/* Visual Section Divider */}
      <div className="absolute top-0 left-0 w-full flex justify-between px-6 -translate-y-1/2 pointer-events-none">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-blue-500 rounded-full" />)}
        </div>
        <div className="text-[9px] font-mono text-gray-300 dark:text-zinc-800 uppercase tracking-[0.5em]">Section_01 // Identity</div>
      </div>

      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-8 md:w-12 h-[1px] bg-blue-500" />
           <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500">Core Foundation</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter dark:text-white leading-[0.9] md:leading-[0.85]">
          Architectural <span className="text-gray-200 dark:text-zinc-800">Identity</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
        
        {/* TOP LEFT: EDUCATION & EXPERIENCE */}
        <div className="lg:col-span-8">
          <BentoBox className="h-full">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-12 gap-4 md:gap-0">
               <div>
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Professional Journey</h3>
                  <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight dark:text-white leading-none">Education & Experience</h2>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Active</span>
               </div>
            </div>

            <div className="space-y-4">
              <TimelineItem 
                title="Uni Stuttgart" 
                subtitle="B.Sc. Software Engineering" 
                date="Oct 2025 — Sep 2029" 
                type="edu" 
                current 
              />
              <TimelineItem 
                title="Evangelisches Schulzentrum" 
                subtitle="Abitur (Maths, Physics)" 
                date="2022 - 2025" 
                type="edu" 
              />
            </div>
          </BentoBox>
        </div>

        {/* TOP RIGHT: ABOUT ME */}
        <div className="lg:col-span-4">
          <BentoBox className="h-full bg-blue-600 text-white border-blue-600 hover:border-white/50 dark:hover:border-blue-400/50">
            <div className="flex flex-col h-full">
              <div className="mb-6 md:mb-8">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] opacity-60">Status // Stuttgart</span>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mt-2 leading-none">About Me</h3>
              </div>
              
              <div className="space-y-4 md:space-y-6 flex-1">
                <p className="text-xs md:text-sm font-bold leading-relaxed uppercase tracking-tight italic opacity-90">
                  "MINDSET: GET SH*T DONE"
                </p>
                <p className="text-[10px] md:text-xs font-medium leading-relaxed opacity-80 uppercase tracking-wider">
                  Stuttgart University Software Engineering student. Target on high-performance systems. Clean code, built to last.
                </p>
              </div>

              <div className="mt-8 md:mt-12 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Activity size={14} className="text-white" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">System Architect</span>
                </div>
              </div>
            </div>
          </BentoBox>
        </div>

        {/* BOTTOM LEFT: METHODOLOGY */}
        <div className="lg:col-span-6">
           <BentoBox className="flex flex-col justify-between min-h-[160px] md:min-h-[180px]">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 md:mb-6">
                 <Code2 className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                 <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Development Methodology</p>
                 <h4 className="text-lg md:text-xl font-black uppercase tracking-tight dark:text-white leading-tight">Agile, TDD & Clean Code</h4>
              </div>
           </BentoBox>
        </div>

        {/* BOTTOM RIGHT: EXPERIENCE YEARS */}
        <div className="lg:col-span-6">
           <BentoBox className="flex flex-col justify-between min-h-[160px] md:min-h-[180px]">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl md:text-6xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">02+</span>
                <span className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-widest animate-pulse">Years</span>
              </div>
              <div>
                 <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Practical Experience</p>
                 <h4 className="text-lg md:text-xl font-black uppercase tracking-tight dark:text-white leading-tight">Years in Software Craft</h4>
              </div>
           </BentoBox>
        </div>

      </div>
    </section>
  );
};
