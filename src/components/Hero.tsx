import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import { HeroBackground } from './HeroBackground';
import { useLanguage } from '../i18n';

const MarqueeItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-16 px-8">
    {children}
  </div>
);

const Marquee = ({ items }: { items: string[] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "100px" });

  // Two identical copies scrolled by exactly -50% loop seamlessly whatever the
  // text width is. The previous version animated to a hard-coded -1500px, which
  // only lined up for the English strings — German and Russian are longer and
  // showed a visible jump on every cycle.
  const strip = (
    <div className="flex items-center shrink-0" aria-hidden={undefined}>
      {items.map((item) => (
        <MarqueeItem key={item}>
          <span className="text-[12px] md:text-[10px] font-mono font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-[0.4em]">
            {item}
          </span>
        </MarqueeItem>
      ))}
    </div>
  );

  return (
    <div ref={ref} className="relative w-full overflow-hidden py-6 bg-transparent border-t border-gray-100 dark:border-white/5">
      <div
        className="flex w-max whitespace-nowrap marquee-track"
        style={{ animationPlayState: isInView ? 'running' : 'paused' }}
      >
        {strip}
        <div aria-hidden="true" className="flex items-center shrink-0">
          {items.map((item) => (
            <MarqueeItem key={`dup-${item}`}>
              <span className="text-[12px] md:text-[10px] font-mono font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-[0.4em]">
                {item}
              </span>
            </MarqueeItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center md:justify-between bg-transparent overflow-hidden pt-24 pb-12 md:pt-32 md:pb-0 px-0">
      
      {/* Dynamic Background Element */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-30">
        <HeroBackground />
      </div>

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
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-zinc-300">{t('hero.badge')}</span>
          </div>
        </motion.div>

        {/* Name and role */}
        <div className="relative text-center py-6 md:py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-[13vw] md:text-[12vw] lg:text-[150px] font-black tracking-[-0.08em] leading-[0.9] md:leading-[0.8] mb-6 dark:text-white">
              OLEKSANDR<br />IZOTOV
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1.2 }}
              // A readable sentence, not a decorative label: 11px uppercase with
              // wide tracking is fine for a caption and hostile to a paragraph.
              className="max-w-xl text-[13px] md:text-sm font-mono tracking-wide text-zinc-500 dark:text-zinc-400 leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>
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
                <span className="text-[7px] font-mono font-bold uppercase tracking-[0.3em] text-blue-700 mb-0.5 group-hover:text-white/70 transition-colors italic">{t('hero.btn_primary_top')}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white dark:text-zinc-950 group-hover:text-white transition-colors">{t('hero.btn_primary')}</span>
             </div>
             
             <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowRight size={14} className="text-white dark:text-zinc-950 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
             </div>
          </a>

          {/* Secondary Action: Explore Services */}
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative flex items-center justify-center w-full md:w-auto gap-6 px-10 py-4 bg-white/50 dark:bg-transparent border border-zinc-200 dark:border-white/10 rounded-full transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 overflow-hidden backdrop-blur-sm"
          >
             {/* Hover Grid Reveal */}
             <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:10px_10px] transition-opacity duration-500" />

             <div className="relative z-10 flex flex-col items-start">
                <span className="text-[7px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400 group-hover:text-blue-500 transition-colors italic">{t('hero.btn_secondary_top')}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">{t('hero.btn_secondary')}</span>
             </div>

             <div className="relative z-10 w-8 h-8 rounded-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                <ChevronDown size={14} className="text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 transition-colors" />
             </div>
          </a>
        </motion.div>
      </div>

      {/* INFINITE MARQUEE CAROUSEL */}
      <div className="w-full mt-auto">
        <Marquee items={[
          t('hero.marquee_location'),
          t('hero.marquee_engineering'),
          t('hero.marquee_available'),
          t('hero.marquee_architecture'),
        ]} />
      </div>

      {/* Decorative blueprint corner. The frame stays faint, but the label itself
          carries text and has to clear WCAG AA — at the old opacity-20 over blue-600
          it rendered as #041332 on black, a contrast ratio of 1.14. */}
      <div className="absolute top-0 right-0 p-8 hidden lg:block">
         <div className="flex flex-col items-end gap-2 border-r-2 border-t-2 border-blue-600/20 pr-4 pt-4">
            <span className="text-[10px] font-mono font-black text-blue-300/80">STG-2026</span>
            <Sparkles aria-hidden="true" size={12} className="text-blue-600/30" />
         </div>
      </div>

    </section>
  );
};
