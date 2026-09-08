import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GrainTexture } from './GrainTexture';
import { useLanguage } from '../i18n';
import { translations } from '../i18n/translations';

export const ImpressumPage = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang].impressum;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <GrainTexture />

      {/* NAV */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto h-14 flex items-center justify-between px-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t.back}</span>
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500 mb-6">
          {t.label}
        </p>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12">
          {t.title}
        </h1>

        <div className="space-y-8 text-[13px] font-mono text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              {t.intro_label}
            </h2>
            <p>{t.intro_text}</p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              {t.contact_label}
            </h2>
            <p className="mb-1">{t.name}</p>
            <p className="mb-3">{t.city}</p>
            <p className="mb-1"><span className="text-zinc-600">{t.email_label}: </span><a href={`mailto:${t.email}`} className="hover:text-blue-400 transition-colors">{t.email}</a></p>
            <p><span className="text-zinc-600">{t.phone_label}: </span>{t.phone}</p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              {t.responsible_label}
            </h2>
            <p>{t.responsible_text}</p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              {t.liability_label}
            </h2>
            <p>{t.liability_text}</p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              {t.links_label}
            </h2>
            <p>{t.links_text}</p>
          </section>
        </div>
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
};
