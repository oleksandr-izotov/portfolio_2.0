import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Terminal, Lock } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

interface Project {
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  stack: string[];
  status?: 'active' | 'development';
  link?: string;
}

export const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  const isLocked = project.status === 'development';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col ${isLocked ? 'opacity-80' : ''}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] md:aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-[#111113] rounded-sm border border-transparent group-hover:border-blue-500/30 transition-colors duration-500">
        
        {/* Base Image */}
        <ImageWithFallback 
          src={project.image} 
          alt={project.title}
          className={`w-full h-full object-cover grayscale dark:brightness-75 transition-all duration-1000 ease-out ${isLocked ? '' : 'group-hover:grayscale-0 group-hover:scale-105'}`}
        />

        {/* Grid Overlay (Blueprint style) */}
        {!isLocked && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:10px_10px] transition-opacity duration-700" />
        )}

        {/* Advanced Hover Content */}
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
          {/* Blurred backdrop for readability */}
          <div className={`absolute inset-0 bg-white/90 dark:bg-[#0c0c0e]/95 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out ${isLocked ? 'dark:bg-[#0c0c0e]/90' : ''}`} />
          
          <div className="relative z-30 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-2 border rounded-sm ${isLocked ? 'border-zinc-500/20' : 'border-blue-500/20'}`}>
                 {isLocked ? <Lock size={14} className="text-zinc-500" /> : <Terminal size={14} className="text-blue-500" />}
              </div>
              <div className="text-right">
                 <span className="block text-[8px] font-mono text-gray-400 dark:text-zinc-500 uppercase tracking-tighter">System ID</span>
                 <span className={`block text-[10px] font-mono font-bold ${isLocked ? 'dark:text-zinc-500' : 'dark:text-blue-400'}`}>PRJ-0{index + 1}</span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col justify-center">
              {isLocked ? (
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                   <Lock size={32} className="text-zinc-700 dark:text-zinc-600 mb-2" />
                   <h4 className="text-xl font-black uppercase tracking-widest text-zinc-500">Locked</h4>
                   <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] bg-zinc-500/10 px-2 py-1 rounded-full border border-zinc-500/20">
                     In Development
                   </span>
                </div>
              ) : (
                <>
                  <motion.h4 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-2xl font-black uppercase tracking-tighter dark:text-white mb-3"
                  >
                    {project.title}
                  </motion.h4>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[13px] leading-relaxed text-gray-600 dark:text-zinc-400 font-medium mb-6 line-clamp-4"
                  >
                    {project.description}
                  </motion.p>
                </>
              )}
            </div>

            {!isLocked && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="h-[1px] flex-1 bg-blue-500/20" />
                   <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-500">Built With</span>
                   <div className="h-[1px] w-4 bg-blue-500/20" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech, i) => (
                    <span 
                      key={tech}
                      className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[9px] font-mono uppercase tracking-wider dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Year Badge (Always Visible) */}
        <div className="absolute top-4 left-4 z-10">
           <div className={`px-2 py-1 backdrop-blur-sm border rounded-sm ${isLocked ? 'bg-zinc-900/40 border-zinc-500/30' : 'bg-black/40 border-white/10'}`}>
              <span className={`text-[9px] font-mono font-bold tracking-widest ${isLocked ? 'text-zinc-400' : 'text-white'}`}>{project.year}</span>
           </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex justify-between items-end">
        <div>
          <p className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-1 ${isLocked ? 'text-zinc-600' : 'text-blue-500'}`}>{project.category}</p>
          <h3 className={`text-xl font-black uppercase tracking-tighter transition-colors duration-300 ${isLocked ? 'text-zinc-600' : 'dark:text-white group-hover:text-blue-500'}`}>
            {project.title}
          </h3>
        </div>
        
        {/* Actions Button - ONLY this part handles the link/locked state interaction */}
        {isLocked ? (
          <div className="w-10 h-10 border border-zinc-800 bg-zinc-900/50 flex items-center justify-center cursor-not-allowed transition-all duration-300">
            <Lock size={14} className="text-zinc-600" />
          </div>
        ) : (
          <a 
            href={project.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => !project.link && e.preventDefault()}
            className="w-10 h-10 border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:rotate-45 cursor-pointer"
          >
            <ArrowUpRight size={18} className="dark:text-white" />
          </a>
        )}
      </div>
    </motion.div>
  );
};
