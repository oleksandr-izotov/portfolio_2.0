import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-10 px-6 bg-white dark:bg-[#0c0c0e] border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Simple minimal stamp */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
            System Online // Stuttgart, DE
          </span>
        </div>

        {/* Core Copyright */}
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] dark:text-white">
            Oleksandr Izotov
          </span>
          <span className="mx-3 text-gray-300 dark:text-zinc-800">/</span>
          <span className="text-[10px] font-mono text-gray-400 dark:text-zinc-600 tracking-widest">
            © {currentYear} All Rights Reserved
          </span>
        </div>

        {/* Blueprint version / Technical info */}
        <div className="hidden md:block">
          <span className="text-[9px] font-mono text-gray-300 dark:text-zinc-800 uppercase tracking-[0.4em]">
            v1.0.4_stable
          </span>
        </div>

      </div>
    </footer>
  );
};
