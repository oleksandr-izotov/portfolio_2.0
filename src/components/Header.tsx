import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin } from 'lucide-react';

export const Header = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c0e]/80 backdrop-blur-xl border-b border-white/5 transition-colors duration-500">
      <div className="max-w-[1800px] mx-auto h-14 flex items-center justify-between px-6 relative">
        
        {/* Left: Identity */}
        <div className="flex items-center z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-blue-400 font-bold text-[10px]">//</span>
            <span className="text-[11px] font-bold tracking-[0.3em] text-white uppercase">
              Izotov
            </span>
          </div>
        </div>

        {/* Center: Clean Navigation (Perfectly centered) */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-12">
          {[
            { name: 'About', id: 'about' },
            { name: 'Stack', id: 'stack' },
            { name: 'Works', id: 'projects' },
            { name: 'Contact', id: 'contact' }
          ].map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`}
              onClick={(e) => scrollToSection(e, item.id)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Right: Metadata & Socials */}
        <div className="flex items-center gap-8 z-10">
          <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            <span>Stuttgart</span>
            <span className="text-zinc-800">/</span>
            <span className="tabular-nums">{time || '00:00:00'}</span>
          </div>
          
          <div className="flex items-center gap-5 border-l border-white/10 pl-8">
            <a href="https://github.com/oleksandr-izotov" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Github size={14} />
            </a>
            <a href="https://www.linkedin.com/in/oleksandr-izotov/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Linkedin size={14} />
            </a>
          </div>
        </div>

      </div>
    </header>
  );
};
