'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function Hero() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Ahsan Aziz';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 px-4 md:px-8 flex items-center"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#ff9e68] rounded-full filter blur-3xl opacity-5" />
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-[#06b4a0] rounded-full filter blur-3xl opacity-3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4 animate-reveal">
              <h1 className="text-5xl md:text-6xl font-bold">
                {displayedText}
                <span className="animate-pulse">|</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-display text-white/85">
                DevOps Engineer — Docker · CI/CD · Cloud Infrastructure
              </h2>
            </div>

            <p className="text-lg text-white/75 max-w-md leading-relaxed animate-reveal animation-delay-100">
              I build scalable cloud infrastructure and production-ready containerized applications.
              <br />
              <span className="text-[#ff9e68]">Freelance DevOps Engineer | Karachi, Pakistan.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 animate-reveal animation-delay-200">
              <a href="#work" className="pill-btn pill-btn-primary">
                View My Work
              </a>
              <a href="mailto:ahsanaziz.dev@gmail.com" className="pill-btn pill-btn-outline">
                Contact Me
              </a>
              <a
                href="/Ahsan_Aziz_DevOps_CV.pdf"
                download="Ahsan_Aziz_DevOps_Portfolio.pdf"
                className="pill-btn pill-btn-outline"
              >
                Download CV ↓
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full md:min-h-96 animate-reveal animation-delay-300">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image
                src="/images/231317241.png"
                alt="Ahsan Aziz"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#062f35] opacity-40" />
              <div className="absolute inset-0 rounded-2xl ring-2 ring-[#ff9e68]/20" />
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-b from-[#ff9e68]/5 to-transparent rounded-3xl blur-xl -z-10 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
