import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GrainTexture } from './GrainTexture';

export const DatenschutzPage = () => {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = 'Datenschutz | Oleksandr Izotov';
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
          Datenschutz // DSGVO
        </p>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12">
          Datenschutzerklärung
        </h1>

        <div className="space-y-8 text-[13px] font-mono text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              1. Datenschutz auf einen Blick
            </h2>
            <p className="mb-3">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              2. Allgemeine Hinweise und Pflichtinformationen
            </h2>
            <p className="mb-3">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
              Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der
              gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <p className="mb-3">
              Verantwortliche Stelle:
            </p>
            <p>Oleksandr Izotov</p>
            <p>[Adresse]</p>
            <p>E-Mail: [E-Mail-Adresse]</p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              3. Datenerfassung auf dieser Website
            </h2>
            <p className="mb-3">
              Die Datenverarbeitung auf dieser Website erfolgt auf Grundlage von Art. 6 Abs. 1 lit.
              a DSGVO (Einwilligung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
            </p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              4. Kontaktformular
            </h2>
            <p className="mb-3">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus
              dem Anfrageformular inklusive der dort angegebenen Kontaktdaten zwecks Bearbeitung
              der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white mb-3">
              5. Ihre Rechte
            </h2>
            <p className="mb-3">
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten
              personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der
              Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
            </p>
          </section>
        </div>
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
};
