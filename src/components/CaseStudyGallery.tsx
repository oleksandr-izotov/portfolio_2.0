import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export interface GallerySlide {
  src: string;
  caption: string;
}

interface Props {
  slides: GallerySlide[];
  /** Small tag above the frame, e.g. "LIVE // CP-BINOM.RU". */
  tag: string;
  systemId: string;
  /** Status line and note under the frame (the text that used to sit in the placeholder). */
  status: string;
  note: string;
  labels: { prev: string; next: string; pause: string; play: string; slide: string };
  /** Milliseconds per slide while autoplay runs. */
  interval?: number;
}

/**
 * Screenshot carousel for the case-study pages.
 *
 * Autoplay stops while the pointer or keyboard focus is inside, while the frame
 * is off screen or the tab is hidden, and never starts for prefers-reduced-motion.
 * Only the current slide is in the DOM; the next one is preloaded so the
 * crossfade does not flash an empty frame.
 */
export const CaseStudyGallery = ({ slides, tag, systemId, status, note, labels, interval = 5000 }: Props) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // explicit pause button
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const count = slides.length;
  const running = !paused && !hovered && visible && !reducedMotion && count > 1;

  const go = useCallback((delta: number) => {
    setIndex((i) => (i + delta + count) % count);
  }, [count]);

  const goTo = (i: number) => {
    setIndex(i);
  };

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && !document.hidden), { threshold: 0.4 });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden && el.getBoundingClientRect().top < window.innerHeight);
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  // Restarting the timer on every index change keeps a manual click from being
  // followed by an immediate automatic jump.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => go(1), interval);
    return () => window.clearTimeout(id);
  }, [running, index, interval, go]);

  useEffect(() => {
    const next = slides[(index + 1) % count];
    if (next) { const img = new Image(); img.src = next.src; }
  }, [index, slides, count]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };

  const slide = slides[index];

  return (
    <div>
      <div
        ref={frameRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={tag}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={(e) => { if (e.target.matches(':focus-visible')) setHovered(true); }}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false); }}
        className="group/gal relative w-full bg-[#0a0a0b] border border-white/10 rounded-sm overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50"
      >
        {/* Window bar: keeps the tags off the screenshot itself. */}
        <div className="relative flex items-center justify-between gap-3 h-9 px-4 border-b border-white/5">
          <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-white/10" />
            <span className="w-2 h-2 rounded-full bg-white/10" />
            <span className="w-2 h-2 rounded-full bg-white/10" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shrink-0" />
            <span className="text-[8px] md:text-[9px] font-mono text-zinc-400 uppercase tracking-widest truncate">{tag}</span>
          </div>
          <span className="text-[8px] md:text-[9px] font-mono text-zinc-600 uppercase tracking-widest shrink-0">{systemId}</span>
        </div>

        {/* Screenshot */}
        <div
          className="relative w-full aspect-[16/10] overflow-hidden bg-white/[0.015]"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <m.img
              key={slide.src}
              src={slide.src}
              alt={slide.caption}
              initial={{ opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full object-cover object-top select-none"
              draggable={false}
              decoding="async"
            />
          </AnimatePresence>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.prev}
                className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 border border-white/15 backdrop-blur-sm text-white hover:bg-blue-600 hover:border-blue-600 transition-all md:opacity-0 md:group-hover/gal:opacity-100 md:group-focus-within/gal:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 border border-white/15 backdrop-blur-sm text-white hover:bg-blue-600 hover:border-blue-600 transition-all md:opacity-0 md:group-hover/gal:opacity-100 md:group-focus-within/gal:opacity-100"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Control bar */}
        <div className="relative border-t border-white/5">
          <div className="absolute inset-x-0 top-0 h-[2px] -translate-y-px pointer-events-none">
            {running && (
              <m.div
                key={index}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: interval / 1000, ease: 'linear' }}
                className="h-full bg-blue-500 origin-left"
              />
            )}
          </div>
          <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3">
            <div className="flex items-baseline gap-3 min-w-0" aria-live="polite">
              <span className="shrink-0 text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-blue-500">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              <span className="text-[12px] md:text-[13px] font-medium text-zinc-300 truncate">{slide.caption}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.src}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`${labels.slide} ${i + 1}`}
                    aria-current={i === index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/25 hover:bg-white/60'}`}
                  />
                ))}
              </div>
              {count > 1 && !reducedMotion && (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? labels.play : labels.pause}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-white/15 text-zinc-400 hover:text-white hover:border-white/40 transition-colors"
                >
                  {paused ? <Play size={11} /> : <Pause size={11} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* The note that used to fill the placeholder */}
      <div className="mt-6 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
        <p className="shrink-0 text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500">{status}</p>
        <p className="text-[12px] text-zinc-500 font-medium leading-relaxed max-w-3xl">{note}</p>
      </div>
    </div>
  );
};
