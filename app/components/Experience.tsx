'use client';

import { Calendar, MapPin, Building2 } from 'lucide-react';

const experiences = [
  {
    id: 1,
    number: '01',
    role: 'Full Stack Developer (Full-time)',
    company: 'Revolix Technologies',
    location: 'Karachi, Pakistan',
    period: 'Apr 2026 – Present',
    description: 'Building production-grade client products full-time at a fast-moving AI software company. Shipping real features across full-stack MERN applications.',
    type: 'job',
    status: 'Current',
  },
  {
    id: 2,
    number: '02',
    role: 'Full Stack MERN Application Development',
    company: 'Jawan Pakistan',
    location: 'Pakistan',
    period: 'Dec 2025 – May 2026',
    description: 'Comprehensive full-stack development training covering React, Node.js, MongoDB, and Express.js. Built multiple production-ready applications.',
    type: 'certification',
  },
  {
    id: 3,
    number: '03',
    role: 'Internship - AI/ML Integration',
    company: 'Self-Directed Learning',
    location: 'Remote',
    period: 'Jan 2025 – Present',
    description: 'Focused learning and project development in AI integrations, LLM APIs (Groq, OpenAI, Gemini), and building AI-powered applications.',
    type: 'learning',
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-[#062f35] to-[#0a3a42]">
      <div className="max-w-7xl mx-auto">
        <p className="section-label mb-4">05 — EXPERIENCE</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-16">Where I've Built Things</h2>

        {/* Timeline */}
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative">
              {/* Timeline line */}
              {index < experiences.length - 1 && (
                <div className="absolute left-6 top-20 bottom-0 w-px bg-gradient-to-b from-[#ff9e68]/50 to-transparent hidden md:block" />
              )}

              {/* Card */}
              <div className="group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#ff9e68]/50 hover:bg-[#ff9e68]/5 transition-all duration-300 md:ml-20">
                {/* Timeline dot */}
                <div className="absolute left-0 top-8 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#ff9e68] to-[#c97a4e] flex items-center justify-center border-4 border-[#062f35] hidden md:flex">
                  <span className="text-xs font-bold text-[#062f35]">{exp.number}</span>
                </div>

                {/* Badge and number */}
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    {exp.status === 'Current' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/50 text-xs font-mono text-[#4ade80]">
                        <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-white/10">{exp.number}</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                <p className="text-[#ff9e68] font-mono text-sm mb-4">{exp.company}</p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {exp.period}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {exp.location}
                  </div>
                  {exp.company !== 'Self-Directed Learning' && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {exp.type === 'job' ? 'Company' : exp.type === 'certification' ? 'Certification' : 'Learning'}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-white/75 leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
