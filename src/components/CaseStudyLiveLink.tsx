import { motion } from 'motion/react';
import { ExternalLink, Lock } from 'lucide-react';
import { projects, type Project } from '../data/projects';
import { useLanguage } from '../i18n';

/**
 * The "view live" control on a case-study page.
 *
 * Whether a project has a public demo lives in one place — data/projects.ts —
 * so the card on the home page and this button can never disagree. A project
 * still in development shows a badge instead of a link: the demo URL used to be
 * hard-coded here and kept pointing at a hostname that no longer resolved.
 */
export const CaseStudyLiveLink = ({ caseStudyId }: { caseStudyId: NonNullable<Project['caseStudyId']> }) => {
  const { t } = useLanguage();
  const project = projects.find(p => p.caseStudyId === caseStudyId);
  // Translation sections are named per case study, not per route id.
  const section = caseStudyId === 'ai-saas' ? 'aisaas' : caseStudyId;
  const label = t(`${section}.view_live`);

  if (!project?.liveUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="inline-flex items-center gap-3 mt-8 px-6 py-2.5 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400"
      >
        <Lock size={11} />
        {t('projects.in_development')}
      </motion.div>
    );
  }

  return (
    <motion.a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="inline-flex items-center gap-3 mt-8 px-6 py-2.5 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/60 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-blue-400 hover:text-white transition-all duration-300"
    >
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
      {label}
      <ExternalLink size={11} />
    </motion.a>
  );
};
