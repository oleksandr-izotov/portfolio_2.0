import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GrainTexture } from './GrainTexture';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden">
      <GrainTexture />

      <div className="relative z-10 text-center px-6">
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500 mb-6">
          Error // 404
        </p>

        <h1 className="text-[120px] md:text-[200px] font-black leading-none tracking-tighter text-white/5 select-none mb-2">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white -mt-8 mb-4">
          Page Not Found
        </h2>

        <p className="text-[12px] font-mono text-zinc-500 uppercase tracking-widest mb-10">
          The requested route does not exist in this system.
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 text-[11px] font-mono font-bold uppercase tracking-widest text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to Home
        </button>
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
};
