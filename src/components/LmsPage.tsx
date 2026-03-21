import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Send, ShieldCheck, Database, Workflow, ExternalLink, Terminal } from 'lucide-react';
import { GrainTexture } from './GrainTexture';
import { ImageWithFallback } from './ui/ImageWithFallback';
import heroImg from '../assets/lms-hero.webp';
import abstractImg from '../assets/lms-tech.webp';
import finalCtaImg from '../assets/lms1.webp';


const techTags = ['React', 'Supabase', 'PostgreSQL', 'TailwindCSS', 'Role-Based Access'];

const features = [
  {
    icon: ShieldCheck,
    title: 'RBAC Architecture',
    description:
      'Granular role-based permissions ensuring that sensitive corporate data and training materials are accessible only to verified personnel.',
  },
  {
    icon: Database,
    title: 'Scalable Database',
    description:
      'Engineered with PostgreSQL on Supabase to handle high concurrent user loads and complex relational data for certification tracking.',
  },
  {
    icon: Workflow,
    title: 'Automated Workflows',
    description:
      'Custom-built logic to automate student onboarding, progress tracking, and automated reporting for HR departments.',
  },
];


export const LmsPage = () => {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = 'Corporate LMS Platform | Oleksandr Izotov';
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <GrainTexture />

      {/* ── NAV ── */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto h-14 flex items-center justify-between px-6">
          <button
            onClick={() => navigate('/', { state: { scrollToProjects: true } })}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to Cases</span>
          </button>

          <button
            onClick={() => navigate('/', { state: { scrollToContact: true } })}
            className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
          >
            Discuss Project
            <ExternalLink size={10} />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 0 — HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-36 pb-28 px-6 overflow-hidden bg-black">
        {/* Hero image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={heroImg}
            alt=""
            className="w-full h-full object-cover object-[center_25%] brightness-75"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        {/* Dark base overlay */}
        <div className="absolute inset-0 z-[1] bg-black/30" />
        {/* Blueprint grid */}
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Bottom fade to black */}
        <div className="absolute bottom-0 left-0 right-0 h-36 z-[3] bg-gradient-to-t from-black to-transparent" />
        {/* Ambient blue glow */}
        <div className="absolute z-[3] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Radial shadow mask */}
          <div className="absolute inset-0 -m-24 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.25)_55%,transparent_80%)] pointer-events-none -z-[1]" />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-10"
          >
            <div className="h-[1px] w-12 bg-blue-500/40" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.5em] text-blue-500">
              Case Study // Corporate EdTech
            </span>
            <div className="h-[1px] w-12 bg-blue-500/40" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[13vw] md:text-[90px] lg:text-[110px] font-black uppercase tracking-[-0.05em] leading-[0.88] mb-10 [text-shadow:0_4px_30px_rgba(0,0,0,0.9)]"
          >
            Corporate
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-300 to-zinc-700">
              LMS Platform
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {techTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border border-white/10 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — EXECUTIVE SUMMARY
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-6 h-[1px] bg-blue-500" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-blue-500">
              01 // Executive Summary
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Challenge */}
            <div className="relative p-8 bg-[#0D0D0D] border border-white/[0.05] hover:border-white/10 rounded-sm transition-colors duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-red-500/60" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-red-400 block mb-5">
                The Challenge
              </span>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
                Fragmented Training<br />at Enterprise Scale
              </h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                Large-scale organizations struggled with fragmented training processes and insecure data handling. There was a critical need for a centralized system to manage employee onboarding and certification at scale.
              </p>
            </div>

            {/* Solution */}
            <div className="relative p-8 bg-[#0D0D0D] border border-blue-500/[0.08] hover:border-blue-500/20 rounded-sm transition-colors duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-blue-500" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-blue-400 block mb-5">
                The Solution
              </span>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
                High-Availability<br />LMS Architecture
              </h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                A robust Learning Management System engineered for high-availability. It features a secure database architecture to automate administrative workflows and a granular access control system for multi-departmental use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1.5 — KEY OUTCOMES
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-6 h-[1px] bg-blue-500" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-blue-500">
              02 // Key Outcomes
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] border border-white/[0.04] rounded-sm overflow-hidden">
            {[
              { value: '20',  unit: 'min', label: 'Employee Onboarding Time',     sub: 'vs. 3-day manual process' },
              { value: '5',   unit: '',    label: 'RBAC Permission Tiers',         sub: 'Admin · HR · Manager · Staff · Guest' },
              { value: '3×',  unit: '',    label: 'HR Reporting Efficiency',       sub: 'Automated certification tracking' },
              { value: '100', unit: '%',   label: 'Audit Trail Coverage',          sub: 'Full access log per user action' },
            ].map(({ value, unit, label, sub }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#0D0D0D] px-8 py-10 flex flex-col gap-2"
              >
                <div className="flex items-end gap-1 leading-none">
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">{value}</span>
                  {unit && <span className="text-xl md:text-2xl font-black text-blue-500 mb-0.5">{unit}</span>}
                </div>
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider">{label}</p>
                <p className="text-[10px] font-mono text-zinc-600">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — TECHNICAL HIGHLIGHTS
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 border-t border-white/5 overflow-hidden">
        {/* Abstract background image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={abstractImg}
            alt=""
            className="w-full h-full object-cover blur-[8px] scale-105"
          />
        </div>
        {/* Gradient mask — fades image into black at top and bottom */}
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,#000000_0%,rgba(0,0,0,0.2)_50%,#000000_100%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-6 h-[1px] bg-blue-500" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-blue-500">
              03 // Technical Highlights
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 bg-[#0D0D0D] border border-white/[0.05] hover:border-blue-500/30 hover:bg-[#13131A] rounded-sm transition-all duration-500"
              >
                <div className="w-10 h-10 bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center mb-5 transition-colors duration-300 rounded-sm">
                  <f.icon size={18} className="text-blue-500" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2 leading-tight">
                  {f.title}
                </h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — PROJECT WALKTHROUGH
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-6 h-[1px] bg-blue-500" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-blue-500">
              04 // Project Walkthrough
            </span>
          </div>

          <div className="relative w-full aspect-video bg-white/[0.015] border border-white/5 rounded-sm overflow-hidden flex flex-col items-center justify-center">
            {/* Inner grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Blueprint corners */}
            {[
              'top-4 left-4 border-l-2 border-t-2',
              'top-4 right-4 border-r-2 border-t-2',
              'bottom-4 left-4 border-l-2 border-b-2',
              'bottom-4 right-4 border-r-2 border-b-2',
            ].map((cls, i) => (
              <div key={i} className={`absolute w-5 h-5 ${cls} border-blue-500/25`} />
            ))}

            {/* Top status tag */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-pulse" />
              <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
                DEMO_RENDER // PENDING
              </span>
            </div>

            {/* System ID */}
            <div className="absolute top-5 right-8 text-[8px] font-mono text-zinc-800 uppercase tracking-widest">
              PRJ-001
            </div>

            {/* Spinning ring + icon */}
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border border-white/5" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-transparent"
                  style={{ borderTopColor: '#3b82f6', borderRightColor: 'rgba(59,130,246,0.1)' }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[7px] rounded-full border border-transparent"
                  style={{ borderBottomColor: 'rgba(96,165,250,0.4)', borderLeftColor: 'rgba(96,165,250,0.1)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Terminal size={18} className="text-blue-500/70" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500">
                  Coming Soon
                </p>
                <p className="text-[11px] text-zinc-600 font-medium max-w-xs leading-relaxed">
                  The architectural deep-dive and platform walkthrough are currently being finalized.
                </p>
              </div>
            </div>

            {/* Scan line */}
            <motion.div
              animate={{ y: ['0%', '2000%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/15 to-transparent pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — CTA
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-32 px-6 overflow-hidden"
        style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={finalCtaImg}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Glassmorphism layer */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            backgroundColor: 'rgba(13,13,13,0.7)',
          }}
        />

        {/* Edge-fading gradient */}
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,#000000_0%,rgba(0,0,0,0)_22%,rgba(0,0,0,0)_78%,#000000_100%)]" />

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/25 to-transparent z-[3]" />

        <div className="max-w-4xl mx-auto text-center relative z-[4]">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.5em] text-blue-500 block mb-8">
              Ready to Build?
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-[80px] font-black uppercase tracking-[-0.04em] text-white leading-[0.88] mb-6">
              Scale Your
              <br />
              Training{' '}
              <span className="text-zinc-700">Infrastructure?</span>
            </h2>
            <p className="text-sm text-zinc-500 font-medium max-w-lg mx-auto mb-12 leading-relaxed">
              Ready to implement a centralized LMS for your organization? Let's discuss the technical requirements and access control architecture for your use case.
            </p>

            <button
              onClick={() => navigate('/', { state: { scrollToContact: true } })}
              className="group inline-flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-[1.02]"
            >
              Submit a Request
              <span className="w-7 h-7 rounded-full bg-black/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <Send size={12} />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
