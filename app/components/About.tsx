'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-content > *', {
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top center',
          end: 'center center',
          scrub: 1,
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: 2, label: 'Years Experience' },
    { number: 7, label: 'Projects Shipped' },
    { number: 2, label: 'Published Packages' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section relative min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-[#062f35] via-[#0a3a42] to-[#062f35]"
    >
      <div className="max-w-7xl mx-auto">
        <p className="section-label mb-4">02 — ABOUT</p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Image */}
          <div className="sticky top-32 h-fit">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/images/abubakar.png"
                alt="M. Abubakar"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 rounded-2xl ring-2 ring-[#ff9e68]/20" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#062f35]/40 rounded-2xl" />
            </div>
            <div className="absolute -inset-4 bg-gradient-radial from-[#ff9e68]/10 to-transparent rounded-3xl blur-3xl -z-10" />
          </div>

          {/* Right: Content */}
          <div className="about-content space-y-8">
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">Full Stack Developer</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-[#ff9e68] to-transparent rounded" />
            </div>

            <div className="space-y-4 text-lg text-white/75 leading-relaxed">
              <p>
                I build production-grade web applications with React, Node.js, and AI integrations.
                Currently shipping full-stack features at Revolix Technologies in Karachi.
              </p>
              <p>
                My focus is on building scalable, maintainable systems that solve real problems. From
                MERN applications to AI-powered features, I deliver end-to-end solutions.
              </p>
            </div>

            {/* Currently Section */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-xs font-mono tracking-widest text-white/50 mb-2">CURRENTLY</p>
              <div>
                <h3 className="text-xl font-bold">Full Stack Developer (Full-time)</h3>
                <p className="text-[#ff9e68] font-mono text-sm">Revolix Technologies</p>
              </div>
            </div>

            {/* Focus Section */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-xs font-mono tracking-widest text-white/50 mb-3">FOCUS</p>
              <div className="flex flex-wrap gap-2">
                <span className="skill-tag">MERN Stack</span>
                <span className="skill-tag">AI Integrations</span>
                <span className="skill-tag">React Native</span>
                <span className="skill-tag">Production Deployment</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-[#ff9e68]">{stat.number}+</p>
                  <p className="text-xs font-mono tracking-widest text-white/50 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-3 pt-6 border-t border-white/10">
              <a href="#work" className="pill-btn pill-btn-primary">
                View My Work
              </a>
              <a href="mailto:m.abubakar.codes@gmail.com" className="pill-btn pill-btn-outline">
                Email me →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
