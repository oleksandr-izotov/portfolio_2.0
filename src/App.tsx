import { Fragment, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { GrainTexture } from './components/GrainTexture';
import { LanguageProvider } from './i18n';
import { stripLang } from './i18n/paths';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useRouteSeo } from './useRouteSeo';

// Routes are imported eagerly on purpose. They used to be React.lazy chunks,
// but with prerendered HTML that breaks hydration: the server ships the full
// page while the client's first render is still the Suspense fallback, so React
// discards the markup and re-renders from scratch. The six route modules add
// ~12 kB gzipped to the entry bundle and save six extra requests.
import { CaseStudyPage } from './components/CaseStudyPage';
import { FortochkaPage } from './components/FortochkaPage';
import { LmsPage } from './components/LmsPage';
import { NotFoundPage } from './components/NotFoundPage';
import { ImpressumPage } from './components/ImpressumPage';
import { DatenschutzPage } from './components/DatenschutzPage';

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
    </div>
  );
};

/**
 * Sends the viewport to the top on navigation. Skipped when the home page was
 * entered with a scroll target in the router state — that flow wants to land on
 * a specific section, not at the top.
 */
const useScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    const state = location.state as { scrollToProjects?: boolean; scrollToContact?: boolean } | null;
    if (state?.scrollToProjects || state?.scrollToContact) return;
    window.scrollTo(0, 0);
  }, [location.pathname, location.state]);
};

const AnimatedRoutes = () => {
  const location = useLocation();
  useRouteSeo();
  useScrollToTop();

  return (
    <AnimatePresence mode="wait">
      <m.div
        // Keyed by the language-neutral path: switching language re-renders
        // the text in place instead of fading the whole page out and back in.
        key={stripLang(location.pathname)}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          {['', '/de', '/ru'].map(prefix => (
            <Fragment key={prefix || '/'}>
              <Route path={prefix || '/'} element={<HomePage />} />
              <Route path={`${prefix}/lms-case-study`} element={<LmsPage />} />
              <Route path={`${prefix}/fortochka-case-study`} element={<FortochkaPage />} />
              <Route path={`${prefix}/medtech-case-study`} element={<CaseStudyPage />} />
              <Route path={`${prefix}/impressum`} element={<ImpressumPage />} />
              <Route path={`${prefix}/datenschutz`} element={<DatenschutzPage />} />
            </Fragment>
          ))}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </m.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      {/* `m` components plus the domAnimation feature set instead of the full
          `motion` bundle: nothing here uses drag or layout animations, and
          `strict` turns an accidental `motion.*` import back into an error. */}
      <LazyMotion features={domAnimation} strict>
        <LanguageProvider>
          <AnimatedRoutes />
        </LanguageProvider>
      </LazyMotion>
    </ErrorBoundary>
  );
}
