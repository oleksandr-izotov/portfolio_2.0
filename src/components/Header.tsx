import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin } from 'lucide-react';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false); // Close mobile menu on click
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
        <div className="flex items-center z-50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-blue-400 font-bold text-[10px]">//</span>
            <span className="text-[11px] font-bold tracking-[0.3em] text-white uppercase">
              Izotov
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
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

        {/* Right: Metadata & Socials (Desktop) */}
        <div className="hidden md:flex items-center gap-8 z-10">
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

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} 
              className="w-full h-0.5 bg-white origin-center transition-all"
            />
            <motion.span 
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} 
              className="w-full h-0.5 bg-white transition-all"
            />
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} 
              className="w-full h-0.5 bg-white origin-center transition-all"
            />
          </div>
        </button>

        {/* Mobile Fullscreen Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-[60] bg-[#0c0c0e]/98 backdrop-blur-xl flex flex-col items-center justify-center pt-20"
            >
               <nav className="flex flex-col items-center gap-8">
                {[
                  { name: 'About', id: 'about' },
                  { name: 'Stack', id: 'stack' },
                  { name: 'Works', id: 'projects' },
                  { name: 'Contact', id: 'contact' }
                ].map((item, i) => (
                  <motion.a 
                    key={item.id} 
                    href={`#${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className="text-2xl font-black uppercase tracking-tighter text-white hover:text-blue-500 transition-colors"
                  >
                    {item.name}
                  </motion.a>
                ))}
              </nav>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex gap-8"
              >
                <a href="https://github.com/oleksandr-izotov" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-full text-white hover:bg-blue-600 transition-colors">
                  <Github size={20} />
                </a>
                <a href="https://www.linkedin.com/in/oleksandr-izotov/" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-full text-white hover:bg-blue-600 transition-colors">
                  <Linkedin size={20} />
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};
