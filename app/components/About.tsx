'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Container, Cloud, GitBranch, Database, Shield } from 'lucide-react';

let gsap: any = null;

// Lazy load GSAP only when needed
const loadGSAP = async () => {
  if (!gsap) {
    const gsapModule = await import('gsap');
    gsap = gsapModule.default;
    gsap.registerPlugin(ScrollTrigger);
  }
  return gsap;
};

export function About() {
  const sectionRef = useRef(null);
  const orbitRef = useRef(null);

  useEffect(() => {
    loadGSAP().then((gsapLib) => {
      const ctx = gsapLib.context(() => {
        gsapLib.from('.about-content > *', {
          scrollTrigger: {
            trigger: '#about',
            start: 'top center',
            end: 'center center',
            scrub: 1,
          },
          y: 50,
          opacity: 0,
          stagger: 0.1,
        });
      }, sectionRef);

      // Orbital animation - continuous rotation
      if (orbitRef.current) {
        gsapLib.to('.orbit-item', {
          rotation: 360,
          duration: 15,
          repeat: -1,
          ease: 'none',
          transformOrigin: 'center center',
        });
      }

      return () => ctx.revert();
    });
  }, []);

  const stats = [
    { number: 2, label: 'Years Experience' },
    { number: 5, label: 'Projects Deployed' },
    { number: 10, label: 'Pipelines Built' },
  ];

  const coreSkills = [
    { icon: Container, label: 'Docker & Containers', color: '#3b82f6' },
    { icon: Code, label: 'CI/CD Pipelines', color: '#ef4444' },
    { icon: Cloud, label: 'AWS & Cloud', color: '#22c55e' },
    { icon: Database, label: 'Databases & Caching', color: '#10b981' },
    { icon: Shield, label: 'Security & Hardening', color: '#8b5cf6' },
    { icon: GitBranch, label: 'Version Control', color: '#06b6d4' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section relative min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-[#062f35] via-[#0a3a42] to-[#062f35]"
    >
      <div className="max-w-7xl mx-auto">
        <p className="section-label mb-4">02 — ABOUT</p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Orbital Animation */}
          <div className="flex justify-center items-center h-96 order-first md:order-first">
            <div ref={orbitRef} className="relative w-80 h-80">
              {/* Orbital Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9e68]/10 to-transparent rounded-full blur-3xl" />

              {/* Outer Orbit Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#ff9e68]/40" />
              
              {/* Middle Orbit Ring */}
              <div className="absolute inset-10 rounded-full border border-[#ff9e68]/20" />

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#ff9e68] via-[#e87a4f] to-[#c97a4e] flex items-center justify-center shadow-2xl shadow-[#ff9e68]/60 border-2 border-[#ff9e68]/40">
                  <Code className="w-12 h-12 text-[#062f35]" />
                </div>
              </div>

              {/* Orbiting Skills - 6 items */}
              {coreSkills.map((skill, index) => {
                const Icon = skill.icon;
                const angle = (index / coreSkills.length) * 360;
                const radius = 130;
                const x = Math.round(radius * Math.cos((angle * Math.PI) / 180) * 100) / 100;
                const y = Math.round(radius * Math.sin((angle * Math.PI) / 180) * 100) / 100;

                return (
                  <div
                    key={skill.label}
                    className="orbit-item absolute"
                    style={{
                      width: '64px',
                      height: '64px',
                      left: 'calc(50% + ' + x + 'px)',
                      top: 'calc(50% + ' + y + 'px)',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl cursor-pointer transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${skill.color}40 0%, ${skill.color}15 100%)`,
                        border: `2.5px solid ${skill.color}`,
                      }}
                      title={skill.label}
                    >
                      <Icon className="w-6 h-6" style={{ color: skill.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Content */}
          <div className="about-content space-y-6 order-last md:order-last">
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">DevOps Engineer</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#ff9e68] to-transparent rounded" />
            </div>

            <div className="space-y-4 text-base md:text-lg text-white/70 leading-relaxed">
              <p>
                Self-taught DevOps engineer specializing in containerization and cloud infrastructure. 
                I design and deploy production-ready pipelines for developer teams.
              </p>
              <p>
                My expertise spans Docker, GitHub Actions CI/CD, AWS, Oracle Cloud, and Linux administration. 
                I focus on building secure, scalable, and efficient infrastructure solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
