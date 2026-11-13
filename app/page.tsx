'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';

// Lazy load heavy animated components
const About = lazy(() => import('./components/About').then(mod => ({ default: mod.About })));
const Skills = lazy(() => import('./components/Skills').then(mod => ({ default: mod.Skills })));
const Work = lazy(() => import('./components/Work').then(mod => ({ default: mod.Work })));
const Experience = lazy(() => import('./components/Experience').then(mod => ({ default: mod.Experience })));
const Contact = lazy(() => import('./components/Contact').then(mod => ({ default: mod.Contact })));

// Simple loading fallback
const SectionFallback = () => <div className="min-h-screen bg-gradient-to-b from-[#062f35] to-[#0a3a42]" />;

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress-bar fixed top-0 left-0 right-0 h-1 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Noise Overlay */}
      <div className="noise" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative">
        {/* Hero - Always load (LCP element) */}
        <Hero />

        {/* Other sections - Lazy load */}
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Work />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Experience />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>

        {/* Footer */}
        <footer className="relative py-12 px-4 md:px-8 border-t border-white/10 bg-gradient-to-b from-[#062f35] to-[#0a2a2f] text-center">
          <p className="text-white/50 font-mono text-sm">
            © 2026 Ahsan Aziz — DevOps Engineer. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
