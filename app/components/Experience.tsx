'use client';

import { Calendar, MapPin, Building2 } from 'lucide-react';

const experiences = [
  {
    id: 1,
    number: '01',
    role: 'Freelance DevOps Engineer',
    company: 'Self-Employed',
    location: 'Karachi, Pakistan',
    period: 'Current',
    description: 'Delivering production-ready CI/CD pipelines, containerized environments, and cloud infrastructure solutions. Specializing in Docker, GitHub Actions, AWS, and Oracle Cloud deployments for developer teams.',
    type: 'job',
    status: 'Current',
  },
  {
    id: 2,
    number: '02',
    role: 'DevOps & Cloud Infrastructure Specialist',
    company: 'Multiple Projects',
    location: 'Remote',
    period: 'Past 2 Years',
    description: 'Architected and deployed production infrastructure across AWS and Oracle Cloud. Managed container orchestration, CI/CD automation, Linux system administration, and security hardening.',
    type: 'professional',
  },
  {
    id: 3,
    number: '03',
    role: 'Self-Directed DevOps Learning',
    company: 'Continuous Education',
    location: 'Remote',
    period: 'Ongoing',
    description: 'Focused learning in advanced DevOps technologies, cloud certifications, and staying updated with infrastructure best practices and automation tools.',
    type: 'learning',
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-[#062f35] to-[#0a3a42]">
      <style>{`
        @keyframes waterWave {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 600px 0;
          }
        }

        .water-border {
          position: relative;
          width: 100%;
          height: clamp(40px, 5vw, 64px);
          overflow: hidden;
          border-radius: 0 0 16px 16px;
          margin-top: auto;
          z-index: 10;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255, 158, 104, 0.3) 0%, rgba(201, 122, 78, 0.4) 100%);
        }

        .wave-container {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
        }

        .wave-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          bottom: 0;
          left: 0;
          background-repeat: repeat-x;
          background-position: 0 bottom;
        }

        .wave-layer1 {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 60'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff9e68;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23c97a4e;stop-opacity:0.6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M0,30 Q150,10 300,30 T600,30 L600,60 L0,60 Z' fill='url(%23grad1)'/%3E%3C/svg%3E");
          background-size: 600px 60px;
          animation: waterWave 12s linear infinite;
          opacity: 0.9;
        }

        .wave-layer2 {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 60'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffb380;stop-opacity:0.8'/%3E%3Cstop offset='100%25' style='stop-color:%23e87d4f;stop-opacity:0.5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M0,40 Q150,20 300,40 T600,40 L600,60 L0,60 Z' fill='url(%23grad2)'/%3E%3C/svg%3E");
          background-size: 600px 60px;
          animation: waterWave 15s linear infinite reverse;
          opacity: 0.75;
        }

        .wave-layer3 {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 60'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff9e68;stop-opacity:0.6'/%3E%3Cstop offset='100%25' style='stop-color:%23d17a5f;stop-opacity:0.4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M0,45 Q150,25 300,45 T600,45 L600,60 L0,60 Z' fill='url(%23grad3)'/%3E%3C/svg%3E");
          background-size: 600px 60px;
          animation: waterWave 18s linear infinite;
          opacity: 0.6;
        }

        .experience-card {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: visible;
        }

        .experience-content {
          flex: 1;
          z-index: 1;
        }

        @media (max-width: 767px) {
          .wave-layer2,
          .wave-layer3 {
            display: none;
          }

          .wave-layer1 {
            animation: waterWave 20s linear infinite;
            opacity: 0.6;
          }
        }
      `}</style>

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
              <div className="experience-card group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl hover:border-[#ff9e68]/50 hover:bg-[#ff9e68]/5 transition-all duration-300 md:ml-20">
                {/* Timeline dot */}
                <div className="absolute left-0 top-8 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#ff9e68] to-[#c97a4e] flex items-center justify-center border-4 border-[#062f35] hidden md:flex z-20">
                  <span className="text-xs font-bold text-[#062f35]">{exp.number}</span>
                </div>

                {/* Content */}
                <div className="experience-content p-6 md:p-8">
                  {/* Badge and number */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      {exp.status === 'Current' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/50 text-xs font-mono text-[#4ade80]">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-2xl font-bold text-white/10">{exp.number}</span>
                  </div>

                  {/* Main Content */}
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
                  <p className="text-white/75 leading-relaxed mb-4">{exp.description}</p>
                </div>

                {/* Water at Border */}
                <div className="water-border">
                  <div className="wave-container">
                    <div className="wave-layer wave-layer1"></div>
                    <div className="wave-layer wave-layer2"></div>
                    <div className="wave-layer wave-layer3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
