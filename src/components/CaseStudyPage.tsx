import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Shield, GitBranch, RefreshCcw, Users, ExternalLink, Terminal } from 'lucide-react';
import { GrainTexture } from './GrainTexture';

interface CaseStudyPageProps {
  onBack: () => void;
}

const techTags = ['Java 25', 'Spring Boot', 'PostgreSQL', 'Vue 3', 'Redis'];

const features = [
  {
    icon: Shield,
    title: 'mTLS API Security',
    description: 'Zero-trust transport layer authentication between all microservices, ensuring encrypted and mutually verified communication.',
  },
  {
    icon: GitBranch,
    title: 'State Machine Logic',
    description: 'Custom Finite State Machine preventing concurrent OR booking conflicts with fully deterministic state transitions.',
  },
  {
    icon: RefreshCcw,
    title: 'Real-Time Sync',
    description: 'Redis Pub/Sub architecture broadcasts live OR status updates to all connected scheduling dashboards instantly.',
  },
  {
    icon: Users,
    title: 'RBAC Access Control',
    description: 'Granular role-based permissions for surgeons, scheduling staff, administrators, and external clinic partners.',
  },
];

export const CaseStudyPage = ({ onBack }: CaseStudyPageProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <GrainTexture />

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto h-14 flex items-center justify-between px-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to Cases</span>
          </button>

          <a
            href="https://t.me/YOUR_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
          >
            Discuss Project
            <ExternalLink size={10} />
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-[65vh] flex flex-col items-center justify-center pt-36 pb-24 px-6 overflow-hidden">
        {/* Blueprint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_30%,#000_100%)]" />
        {/* Blue ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-10"
          >
            <div className="h-[1px] w-12 bg-blue-500/40" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.5em] text-blue-500">
              Case Study // B2B MedTech
            </span>
            <div className="h-[1px] w-12 bg-blue-500/40" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[13vw] md:text-[90px] lg:text-[110px] font-black uppercase tracking-[-0.05em] leading-[0.88] mb-10"
          >
            Enterprise
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-300 to-zinc-700">
              MedTech System
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
                className="px-3 py-1 border border-white/10 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── EXECUTIVE SUMMARY ── */}
      <section className="relative py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-6 h-[1px] bg-blue-500" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-blue-500">
              01 // Executive Summary
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative p-8 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-sm transition-colors duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-red-500/60" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-red-400 block mb-5">
                The Challenge
              </span>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
                Surgical Scheduling<br />at Breaking Point
              </h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                Surgical clinic networks were managing operating room allocations through fragmented spreadsheets and manual phone coordination. The result: overlapping bookings, zero real-time OR visibility, and hours of administrative overhead per day — directly compressing patient throughput and cutting into clinic revenue.
              </p>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative p-8 bg-blue-600/[0.04] border border-blue-500/10 hover:border-blue-500/20 rounded-sm transition-colors duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-16 h-[2px] bg-blue-500" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-blue-400 block mb-5">
                The Solution
              </span>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
                State Machine<br />Core Architecture
              </h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                A custom Finite State Machine was built at the platform core — each operating room managed as a deterministic stateful entity. A mTLS-protected API Gateway authenticates all inter-service communication at the transport layer. A Vue 3 drag-and-drop timeline delivers real-time visual feedback, while Redis Pub/Sub propagates state changes to all connected clients instantly.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VIDEO DEMO ── */}
      <section className="relative py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-6 h-[1px] bg-blue-500" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-blue-500">
              02 // Project Walkthrough
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-video bg-white/[0.015] border border-white/5 rounded-sm overflow-hidden flex flex-col items-center justify-center"
          >
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
              PRJ-003
            </div>

            {/* Spinning ring + icon */}
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="relative w-24 h-24">
                {/* Static outer ring */}
                <div className="absolute inset-0 rounded-full border border-white/5" />
                {/* Fast outer spinner */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-transparent"
                  style={{ borderTopColor: '#3b82f6', borderRightColor: 'rgba(59,130,246,0.1)' }}
                />
                {/* Slow inner counter-spinner */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[7px] rounded-full border border-transparent"
                  style={{ borderBottomColor: 'rgba(96,165,250,0.4)', borderLeftColor: 'rgba(96,165,250,0.1)' }}
                />
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Terminal size={18} className="text-blue-500/70" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500">
                  Coming Soon
                </p>
                <p className="text-[11px] text-zinc-600 font-medium max-w-xs leading-relaxed">
                  Project walk-through and logic demonstration is currently under final rendering.
                </p>
              </div>
            </div>

            {/* Bottom scan line */}
            <motion.div
              animate={{ y: ['0%', '2000%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/15 to-transparent pointer-events-none"
            />
          </motion.div>
        </div>
      </section>

      {/* ── KEY FEATURES GRID ── */}
      <section className="relative py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-6 h-[1px] bg-blue-500" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.45em] text-blue-500">
              03 // Technical Highlights
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="group p-6 bg-white/[0.02] border border-white/5 hover:border-blue-500/20 hover:bg-blue-500/[0.03] rounded-sm transition-all duration-500"
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative py-32 px-6 border-t border-white/5 overflow-hidden">
        {/* Ambient glow from bottom */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(59,130,246,0.07),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.5em] text-blue-500 block mb-8">
              Ready to Build?
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-[80px] font-black uppercase tracking-[-0.04em] text-white leading-[0.88] mb-6">
              Implement a
              <br />
              Similar{' '}
              <span className="text-zinc-700">Architecture?</span>
            </h2>
            <p className="text-sm text-zinc-500 font-medium max-w-lg mx-auto mb-12 leading-relaxed">
              Ready to implement a similar architecture for your business? Let's discuss the technical requirements and scope of your project.
            </p>

            <a
              href="https://t.me/YOUR_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-400 hover:scale-[1.02]"
            >
              Connect via Telegram
              <span className="w-7 h-7 rounded-full bg-black/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <Send size={12} />
              </span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
