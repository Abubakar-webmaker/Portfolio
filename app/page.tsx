'use client';

import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Work } from './components/Work';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';

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
        {/* Hero */}
        <Hero />

        {/* About */}
        <About />

        {/* Skills */}
        <Skills />

        {/* Work */}
        <Work />

        {/* Experience */}
        <Experience />

        {/* Contact */}
        <Contact />

        {/* Footer */}
        <footer className="relative py-12 px-4 md:px-8 border-t border-white/10 bg-gradient-to-b from-[#062f35] to-[#0a2a2f] text-center">
          <p className="text-white/50 font-mono text-sm">
            © 2026 Ahsan Aziz. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
