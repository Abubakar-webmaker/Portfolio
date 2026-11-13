'use client';

import { useEffect, useRef } from 'react';
import { Code, Monitor, Server, Database, Brain, Wrench } from 'lucide-react';

const skillGroups = [
  {
    icon: Code,
    title: 'Containers & Orchestration',
    skills: ['Docker', 'Dockerfiles', 'Docker Compose', 'Docker Hub', 'Health Checks', 'Rollbacks'],
  },
  {
    icon: Monitor,
    title: 'CI/CD Pipelines',
    skills: ['GitHub Actions', 'Build Workflows', 'Automated Testing', 'Deployment Pipelines', 'Security Scans'],
  },
  {
    icon: Server,
    title: 'Cloud Platforms',
    skills: ['AWS EC2', 'AWS ECS Fargate', 'AWS ECR', 'Oracle Cloud', 'AWS Amplify', 'AWS RDS'],
  },
  {
    icon: Database,
    title: 'Infrastructure & Security',
    skills: ['Linux Administration', 'SSH', 'Caddy Web Server', 'HTTPS/SSL', 'Firewalls', 'Security Groups'],
  },
  {
    icon: Brain,
    title: 'DevOps Tools',
    skills: ['Prisma Migrations', 'Secrets Manager', 'System Logs', 'Memory Optimization', 'PostgreSQL', 'Redis'],
  },
  {
    icon: Wrench,
    title: 'Development Tools',
    skills: ['Git & GitHub', 'Linux Terminal', 'System Troubleshooting', 'API Integration', 'Python HTTP', 'FastAPI'],
  },
];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target as HTMLDivElement;
          const cardIndex = cardsRef.current.indexOf(card);
          
          // Top 3 cards (0,1,2) come from left
          // Bottom 3 cards (3,4,5) come from right
          const isTopRow = cardIndex < 3;
          
          card.style.animation = `slideIn${isTopRow ? 'Left' : 'Right'} 0.8s ease-out ${cardIndex * 0.15}s forwards`;
          observer.unobserve(card);
        }
      });
    }, observerOptions);

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-[#062f35] to-[#0a3a42]"
    >
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <p className="section-label mb-4">03 — SKILLS</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-16">What I Work With</h2>

        {/* Skill Cards Grid - Simple 3 Column Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {skillGroups.map((group, idx) => {
            const Icon = group.icon;

            return (
              <div
                key={group.title}
                ref={(el) => {
                  if (el) cardsRef.current[idx] = el;
                }}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#ff9e68]/50 hover:bg-[#ff9e68]/5 transition-all duration-300 cursor-pointer overflow-hidden"
                style={{
                  opacity: 0,
                }}
              >
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff9e68]/0 to-[#ff9e68]/0 group-hover:from-[#ff9e68]/10 group-hover:to-[#ff9e68]/5 transition-all duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#ff9e68]/10 group-hover:bg-[#ff9e68]/20 transition-colors">
                      <Icon className="w-5 h-5 text-[#ff9e68]" />
                    </div>
                    <h3 className="text-lg font-bold">{group.title}</h3>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono hover:border-[#ff9e68]/50 hover:bg-[#ff9e68]/10 transition-all"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
