import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GrainTexture } from './GrainTexture';

export const ImpressumPage = () => {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = 'Impressum | Oleksandr Izotov';
    return () => { document.title = prev; };
  }, []);

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
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back</span>
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500 mb-6">
          Legal Notice // § 5 TMG
        </p>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12">
          Impressum
        </h1>

        <div className="space-y-8 text-[13px] font-mono text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              Angaben gemäß § 5 TMG
            </h2>
            <p className="mb-1">Oleksandr Izotov</p>
            <p>Schwäbisch Hall</p>
            <p>Deutschland</p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              Kontakt
            </h2>
            <p>Telefon: +4915172447262</p>
            <p>E-Mail: izotovoleksandr05@gmail.com</p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              Umsatzsteuer-ID
            </h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: comming soon...</p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p>Oleksandr Izotov</p>
            <p>Schwäbisch Hall</p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              Haftungsausschluss
            </h2>
            <p className="mb-3">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </p>
            <p className="mb-3">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
          </section>
        </div>
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
};
