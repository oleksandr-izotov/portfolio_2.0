import React from 'react';
import { Github, Linkedin, Send } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';
import liquidBackground from "../assets/liquid-bg.webp";
import contactBackground from "../assets/testx.webp";
import { ContactForm } from './ContactForm';
import { SystemPulse } from './SystemPulse';

export const Contact = () => {
  return (
    <section id="contact" className="relative pt-12 pb-24 px-6 bg-white dark:bg-[#0c0c0e] transition-colors duration-500 overflow-hidden">
      {/* Contact Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.1] dark:opacity-[0.25]">
        <ImageWithFallback
          src={contactBackground}
          alt="Contact Background"
          className="w-full h-full object-cover blur-sm grayscale"
        />
      </div>

      {/* Background Technical Grid / Blueprint elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute top-10 right-10 text-[60px] font-black uppercase tracking-tighter text-blue-500 rotate-90 origin-top-right opacity-20">
          STUTTGART_SE
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Subtle separator with label and Metadata Fill */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-16">
          <div className="flex items-center gap-4 flex-grow">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-600">04 // CONTACTS</span>
            <div className="h-[1px] flex-grow bg-gray-100 dark:bg-white/5" />
          </div>
          
          {/* Engineering Metadata Block to fill space */}
          <div className="hidden md:flex gap-10">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-0.5">Location</span>
              <span className="text-[9px] font-bold dark:text-zinc-500 uppercase tracking-wider">48.7758° N, 9.1829° E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-0.5">Protocol</span>
              <span className="text-[9px] font-bold dark:text-zinc-500 uppercase tracking-wider">Secure_Transport // TLS 1.3</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-0.5">Deployment</span>
              <span className="text-[9px] font-bold dark:text-zinc-500 uppercase tracking-wider">Cloud_Edge // Vercel</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
          {/* Floating Image Accent behind Title */}
          <div className="absolute top-0 left-0 w-full max-w-lg aspect-square opacity-[0.06] dark:opacity-[0.15] pointer-events-none blur-3xl -translate-x-1/4 -translate-y-1/4">
            <ImageWithFallback src={liquidBackground} alt="" className="w-full h-full object-contain grayscale" />
          </div>

          <div className="relative z-10 flex flex-col gap-8">
            <div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] dark:text-white mb-8">
                LET'S BUILD <br />
                <span style={{ color: '#27272a' }}>THE FUTURE</span>
              </h2>
              <p className="max-w-md text-sm text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">
                Ready to elevate your business with scalable web architecture and tailored AI integrations? I'm always open to discussing complex technical challenges, consulting opportunities, or immediate B2B collaborations.
              </p>
            </div>

            <SystemPulse />
          </div>

          <div className="flex flex-col gap-6">
            {/* Contact Form */}
            <ContactForm />

            {/* Socials + Status below form */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-2 border-t border-white/5">
              <div className="flex items-center gap-4">
                <a href="https://github.com/oleksandr-izotov" className="p-2 border border-gray-100 dark:border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors rounded-lg group">
                  <Github size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </a>
                <a href="https://www.linkedin.com/in/oleksandr-izotov/" className="p-2 border border-gray-100 dark:border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors rounded-lg group">
                  <Linkedin size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </a>
                <a href="https://t.me/lunevvvv" className="p-2 border border-gray-100 dark:border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors rounded-lg group">
                  <Send size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </a>
              </div>

              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1">Status</span>
                  <span className="text-[10px] font-bold dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Available
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1">Response Time</span>
                  <span className="text-[10px] font-bold dark:text-white uppercase tracking-wider underline decoration-blue-500/30">
                    &lt; 24 Hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
