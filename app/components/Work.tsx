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
    title: 'AI Project Manager',
    description:
      'Enterprise-grade project management tool with Kanban board, 16 AI-powered features, client portal, analytics, gamification, and role-based access control.',
    tech: ['MERN', 'Groq API', 'DnD Kit', 'MongoDB', 'JWT'],
    featured: true,
    accent: '#a78bfa',
    links: [{ label: 'GitHub', url: 'https://github.com/Abubakar-webmaker/ai-project-manager' }],
  },
  {
    id: 2,
    number: '02',
    title: 'Postman AI Agent',
    description:
      'Analyzes backend source code and auto-generates complete Postman Collections. Published to PyPI and VS Code Marketplace.',
    tech: ['FastAPI', 'LangGraph', 'Groq API', 'Python'],
    accent: '#ff9e68',
    links: [
      { label: 'GitHub', url: 'https://github.com/Abubakar-webmaker/postman-collection-ai-agent' },
      { label: 'PyPI', url: 'https://pypi.org/project/postman-collection-ai-agent/' },
      { label: 'VS Code', url: 'https://marketplace.visualstudio.com/items?itemName=Abubakar-webmaker.postman-ai-agent' },
    ],
  },
  {
    id: 3,
    number: '03',
    title: 'AI Chat Platform',
    description:
      'Claude-style real-time chat application with multi-provider AI, streaming responses, JWT authentication, and persistent conversation history.',
    tech: ['React', 'Node.js', 'Socket.io', 'Groq', 'OpenAI', 'Gemini'],
    accent: '#38bdf8',
    links: [{ label: 'GitHub', url: 'https://github.com/Abubakar-webmaker/ai-chat-platform' }],
  },
  {
    id: 4,
    number: '04',
    title: 'CollabNotes',
    description:
      'Real-time collaborative note-taking platform with live multi-user editing, conflict-free auto-sync, and persistent storage.',
    tech: ['MERN', 'Socket.io', 'Real-time', 'MongoDB'],
    accent: '#06b6d4',
    links: [{ label: 'GitHub', url: 'https://github.com/Abubakar-webmaker/collabNotes' }],
  },
  {
    id: 5,
    number: '05',
    title: 'AI Resume Builder',
    description:
      'Intelligent resume generator with multiple ATS-optimised templates, AI-powered content suggestions, real-time preview, and PDF export.',
    tech: ['React', 'Groq API', 'PDF Export', 'TypeScript'],
    accent: '#34d399',
    links: [{ label: 'GitHub', url: 'https://github.com/Abubakar-webmaker/ai-resume-builder' }],
  },
  {
    id: 6,
    number: '06',
    title: 'Freelancer Invoices',
    description:
      'Full-stack invoice management tool for freelancers with glassmorphism UI, JWT auth, multi-currency support, and PDF generation.',
    tech: ['MERN', 'TypeScript', 'JWT', 'Multi-currency'],
    accent: '#fb923c',
    links: [{ label: 'GitHub', url: 'https://github.com/Abubakar-webmaker/freelancer-invoice-generator' }],
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

  return (
    <section id="work" className="relative min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-[#0a3a42] to-[#062f35]" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <p className="section-label mb-4">04 — PROJECTS</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-16">Projects From The Field</h2>

        {/* Project Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#ff9e68]/50 transition-all duration-300 overflow-hidden h-full flex flex-col"
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
