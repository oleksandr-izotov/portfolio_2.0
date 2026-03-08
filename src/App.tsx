import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { GrainTexture } from './components/GrainTexture';
import { ThemeProvider } from './components/theme-provider';
import { CaseStudyPage } from './components/CaseStudyPage';

export default function App() {
  const [showCaseStudy, setShowCaseStudy] = useState(false);

  const handleBack = () => {
    setShowCaseStudy(false);
    setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (showCaseStudy) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <CaseStudyPage onBack={handleBack} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <div className="min-h-screen bg-[#0c0c0e] text-[#f2f2f3] selection:bg-blue-600 selection:text-white font-sans">
        <GrainTexture />
        <Header />
        <main className="relative z-10">
          <Hero />
          <BentoGrid />
          <TechStack />
          <Projects onCaseStudyClick={() => setShowCaseStudy(true)} />
          <Contact />
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    </ThemeProvider>
  );
}
