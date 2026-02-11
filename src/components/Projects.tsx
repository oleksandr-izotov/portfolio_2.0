import React from 'react';
import { ProjectCard } from './ProjectCard';
import { projects } from '../data/projects';

export const Projects = () => {
  return (
    <section id="projects" className="relative pt-20 pb-8 px-6 max-w-7xl mx-auto border-t border-gray-100 dark:border-white/5">
      {/* Visual Section Divider */}
      <div className="absolute top-0 left-0 w-full flex justify-between px-6 -translate-y-1/2 pointer-events-none">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-blue-500 rounded-full" />)}
        </div>
        <div className="text-[9px] font-mono text-gray-300 dark:text-zinc-800 uppercase tracking-[0.5em]">Section_03 // Portfolio</div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-[1px] bg-blue-500" />
             <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500">Engineering Portfolio</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter dark:text-white leading-[0.85]">
            Proj<span className="text-gray-200 dark:text-zinc-800">ects</span>
          </h2>
        </div>
        <div className="max-w-xs space-y-4">
           <div className="flex gap-2 text-blue-500">
              <div className="w-1 h-1 bg-blue-500" />
              <div className="w-1 h-1 bg-blue-500/50" />
              <div className="w-1 h-1 bg-blue-500/20" />
           </div>
           <p className="text-[11px] font-mono text-gray-500 dark:text-zinc-500 uppercase tracking-widest leading-relaxed">
             Architectural case studies focusing on performance, scalability, and robust system implementation.
           </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
        {projects.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
      </div>
    </section>
  );
};
