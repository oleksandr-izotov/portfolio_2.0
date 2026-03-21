import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle, Loader, Send } from 'lucide-react';

type ContactType = 'private' | 'company';
type ContactMethod = 'email' | 'whatsapp' | 'telegram';
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  phone: string;
  email: string;
  type: ContactType;
  description: string;
  contactMethod: ContactMethod;
}

export const ContactForm = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    type: 'private',
    description: '',
    contactMethod: 'telegram',
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.03] transition-all duration-200 font-medium';

  const labelClass = 'block text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 mb-1.5';

  const panelClass = "border border-white/[0.08] rounded-2xl bg-white/[0.02] overflow-hidden";

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`${panelClass} flex flex-col items-center justify-center gap-6 py-16 px-8 text-center`}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"
        >
          <Send size={32} className="text-blue-400" strokeWidth={1.5} />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-2"
        >
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">
            Request Sent!
          </h3>
          <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-xs">
            Thanks{form.name ? `, ${form.name}` : ''}! I'll get back to you within{' '}
            <span className="text-white font-bold">24 hours</span>.
          </p>
        </motion.div>

        {/* Reset button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          onClick={() => {
            setStatus('idle');
            setForm({ name: '', phone: '', email: '', type: 'private', description: '', contactMethod: 'telegram' });
          }}
          className="mt-2 px-6 py-2.5 border border-white/10 rounded-xl text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-400 hover:border-blue-500/40 hover:text-white hover:bg-blue-500/5 transition-all duration-200"
        >
          Send another request
        </motion.button>

        {/* Checkmark badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-600 uppercase tracking-widest"
        >
          <CheckCircle size={10} className="text-green-500" />
          Message delivered securely
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={panelClass}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-zinc-500">
            Request_Form
          </span>
        </div>
        <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
          Secure // TLS 1.3
        </span>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 p-5"
      >
      {/* Type Toggle */}
      <div>
        <span className={labelClass}>Request Type</span>
        <div className="flex gap-2">
          {(['private', 'company'] as ContactType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, type: t }))}
              className={`flex-1 py-2.5 px-4 text-[10px] font-mono font-bold uppercase tracking-[0.25em] rounded-lg border transition-all duration-200 ${
                form.type === t
                  ? 'border-blue-500/60 bg-blue-500/10 text-blue-400'
                  : 'border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-400'
              }`}
            >
              {t === 'private' ? 'Private' : 'Company'}
            </button>
          ))}
        </div>
      </div>

      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+49 123 456 789"
            className={inputClass}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>Email *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@company.com"
          required
          className={inputClass}
        />
      </div>

      {/* Task Description */}
      <div>
        <label className={labelClass}>Task Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Briefly describe what you need..."
          required
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Contact Method */}
      <div>
        <span className={labelClass}>Preferred Contact</span>
        <div className="flex gap-2">
          {(['email', 'whatsapp', 'telegram'] as ContactMethod[]).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, contactMethod: m }))}
              className={`flex-1 py-2.5 px-2 text-[9px] font-mono font-bold uppercase tracking-[0.2em] rounded-lg border transition-all duration-200 ${
                form.contactMethod === m
                  ? 'border-blue-500/60 bg-blue-500/10 text-blue-400'
                  : 'border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-400'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
          * Required fields
        </span>
        <motion.button
          type="submit"
          disabled={status === 'submitting'}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-[10px] font-mono font-bold uppercase tracking-[0.3em] rounded-lg transition-colors duration-200"
        >
          <AnimatePresence mode="wait">
            {status === 'submitting' ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader size={12} className="animate-spin" />
                Sending
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                Send Request
                <ArrowRight size={12} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.form>
    </motion.div>
  );
};
