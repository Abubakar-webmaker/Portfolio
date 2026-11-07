'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    number: '01',
    title: 'J.M.S Web App - Oracle Cloud Deployment',
    description:
      'Deployed a full-stack React/Node application on Oracle Cloud using Caddy for HTTPS and two GitHub Actions pipelines. Resolved memory limitations and Prisma migration issues for production stability.',
    tech: ['Docker', 'React', 'Node.js', 'GitHub Actions', 'Oracle Cloud', 'Caddy', 'Prisma'],
    featured: true,
    accent: '#a78bfa',
    links: [],
  },
  {
    id: 2,
    number: '02',
    title: 'Vursell AI Sales Platform',
    description:
      'Hosted a Next.js/FastAPI stack on low-spec Oracle Cloud server with automated CI/CD scans, zero-cost deployment strategy, and hardened security configurations for production use.',
    tech: ['Next.js', 'FastAPI', 'CI/CD', 'Oracle Cloud', 'Security', 'GitHub Actions'],
    accent: '#ff9e68',
    links: [],
  },
  {
    id: 3,
    number: '03',
    title: 'Voice Agent Infrastructure - AWS',
    description:
      'Architected scalable infrastructure utilizing AWS ECS Fargate for containerized deployments, ECR for image management, RDS PostgreSQL, Redis caching, Secrets Manager, and Amplify frontend hosting.',
    tech: ['AWS ECS Fargate', 'ECR', 'RDS', 'Redis', 'Secrets Manager', 'AWS Amplify'],
    accent: '#38bdf8',
    links: [],
  },
  {
    id: 4,
    number: '04',
    title: 'BMS Deployment - AWS EC2',
    description:
      'Containerized and deployed lightweight Python and Docker workloads on AWS EC2 instances with automated CI/CD pipelines and production-grade security configurations.',
    tech: ['Docker', 'Python', 'AWS EC2', 'GitHub Actions', 'CI/CD', 'Linux'],
    accent: '#06b6d4',
    links: [],
  },
  {
    id: 5,
    number: '05',
    title: 'Multi-Cloud Infrastructure Setup',
    description:
      'Designed and implemented infrastructure across AWS and Oracle Cloud platforms, managing container orchestration, security groups, firewalls, and automated deployment pipelines.',
    tech: ['Docker Compose', 'AWS', 'Oracle Cloud', 'Security', 'Linux', 'CI/CD'],
    accent: '#34d399',
    links: [],
  },
];

export function Work() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return;

    const cards = trackRef.current.querySelectorAll('.project-card');
    const container = containerRef.current;

    // Animate cards on scroll
    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: container,
          start: 'top center',
          markers: false,
        },
        opacity: 0,
        y: 50,
        delay: i * 0.1,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create wave effect
    const wave = document.createElement('div');
    wave.style.position = 'absolute';
    wave.style.left = x + 'px';
    wave.style.top = y + 'px';
    wave.style.width = '30px';
    wave.style.height = '30px';
    wave.style.borderRadius = '50%';
    wave.style.border = '2px solid #ff9e68';
    wave.style.pointerEvents = 'none';
    wave.style.zIndex = '10';
    card.appendChild(wave);

    gsap.to(wave, {
      width: '200px',
      height: '200px',
      left: x - 85 + 'px',
      top: y - 85 + 'px',
      borderColor: '#ff9e68 rgba(255, 158, 104, 0)',
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        wave.remove();
      },
    });
  };

  return (
    <section id="work" className="relative min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-[#0a3a42] to-[#062f35]" ref={containerRef}>
      <style>{`
        .project-card {
          position: relative;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <p className="section-label mb-4">04 — PROJECTS</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-16">Projects From The Field</h2>

        {/* Project Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#ff9e68]/50 transition-all duration-300 overflow-hidden h-full flex flex-col"
              onMouseMove={handleCardHover}
              style={
                {
                  '--accent': project.accent,
                } as React.CSSProperties
              }
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: project.accent }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#062f35]/50 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                    {project.number}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 rounded-full bg-[#ff9e68]/20 border border-[#ff9e68]/50 text-xs font-mono text-[#ff9e68]">
                      Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 group-hover:text-[#ff9e68] transition-colors">{project.title}</h3>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed mb-4 flex-grow">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-2 py-1 rounded text-xs font-mono bg-white/5 border border-white/10">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-mono text-white/70 hover:text-[#ff9e68] transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Hover border animation */}
              <div className="absolute inset-0 rounded-2xl border border-[#ff9e68]/0 group-hover:border-[#ff9e68]/30 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
