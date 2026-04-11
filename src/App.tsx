import { useEffect, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { GrainTexture } from './components/GrainTexture';
import { ThemeProvider } from './components/theme-provider';
import { LanguageProvider } from './i18n';
import { ErrorBoundary } from './components/ErrorBoundary';

const CaseStudyPage = lazy(() => import('./components/CaseStudyPage').then(m => ({ default: m.CaseStudyPage })));
const AiSaaSPage = lazy(() => import('./components/AiSaaSPage').then(m => ({ default: m.AiSaaSPage })));
const LmsPage = lazy(() => import('./components/LmsPage').then(m => ({ default: m.LmsPage })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const ImpressumPage = lazy(() => import('./components/ImpressumPage').then(m => ({ default: m.ImpressumPage })));
const DatenschutzPage = lazy(() => import('./components/DatenschutzPage').then(m => ({ default: m.DatenschutzPage })));

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
  exit:    { opacity: 0, transition: { duration: 0.2,  ease: [0.4, 0, 1, 1] as const } },
};

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToProjects) {
      setTimeout(() => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    if (location.state?.scrollToContact) {
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-black text-[#f2f2f3] selection:bg-blue-600 selection:text-white font-sans">
      <GrainTexture />
      <Header />
      <main className="relative z-10">
        <Hero />
        <BentoGrid />
        <TechStack />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lms-case-study" element={<LmsPage />} />
          <Route path="/ai-saas-case-study" element={<AiSaaSPage />} />
          <Route path="/medtech-case-study" element={<CaseStudyPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <AnimatedRoutes />
          </Suspense>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
