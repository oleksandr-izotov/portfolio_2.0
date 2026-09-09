import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ArrowRight, CheckCircle, Loader, Send } from 'lucide-react';
import { useLanguage } from '../i18n';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  description: string;
}

// Bots fill every field they find; humans never see this one. A filled value
// makes the request look identical to a success without ever reaching Telegram.
const HONEYPOT_FIELD = 'company_website';

export const ContactForm = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    description: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorKey, setErrorKey] = useState<'error_generic' | 'error_rate_limited'>('error_generic');
  const [honeypot, setHoneypot] = useState('');

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
        body: JSON.stringify({ ...form, [HONEYPOT_FIELD]: honeypot }),
      });
      if (!res.ok) {
        setErrorKey(res.status === 429 ? 'error_rate_limited' : 'error_generic');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorKey('error_generic');
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.03] transition-all duration-200 font-medium';

  const labelClass = 'block text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400 mb-1.5';

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
            {t('form.success_title')}
          </h3>
          <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-xs">
            {form.name ? `${t('form.thanks')}, ${form.name}! ` : ''}{t('form.success_sub')}{' '}
            <span className="text-white font-bold">{t('form.success_hours')}</span>.
          </p>
        </motion.div>

        {/* Reset button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          onClick={() => {
            setStatus('idle');
            setForm({ name: '', email: '', description: '' });
          }}
          className="mt-2 px-6 py-2.5 border border-white/10 rounded-xl text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-400 hover:border-blue-500/40 hover:text-white hover:bg-blue-500/5 transition-all duration-200"
        >
          {t('form.success_another')}
        </motion.button>

        {/* Checkmark badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-600 uppercase tracking-widest"
        >
          <CheckCircle size={10} className="text-green-500" />
          {t('form.success_secure')}
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
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-zinc-400">
            {t('form.request_form')}
          </span>
        </div>
        <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
          Secure // TLS 1.3
        </span>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 p-5"
      >
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className={labelClass}>{t('form.name')}</label>
        <input
          id="contact-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          autoComplete="name"
          required
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className={labelClass}>{t('form.email')}</label>
        <input
          id="contact-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@company.com"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>

      {/* Honeypot: hidden from people, irresistible to form-filling bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Company website</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Task Description */}
      <div>
        <label htmlFor="contact-description" className={labelClass}>{t('form.description')}</label>
        <textarea
          id="contact-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder={t('form.description_placeholder')}
          required
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Delivery failure. Before this existed, a failed send just quietly reset
          the button and the visitor had no idea the message never arrived. */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/[0.06] px-4 py-3"
          >
            <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-red-300">
                {t('form.error_title')}
              </span>
              <span className="text-[12px] text-zinc-400 leading-relaxed">
                {t(`form.${errorKey}`)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
          {t('form.required')}
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
                {t('form.sending')}
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                {status === 'error' ? t('form.error_retry') : t('form.send')}
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
