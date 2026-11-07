'use client';

import { Code, Monitor, Server, Database, Brain, Wrench } from 'lucide-react';

const skillGroups = [
  {
    icon: Code,
    title: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'Python', 'SQL'],
  },
  {
    icon: Monitor,
    title: 'Frontend',
    skills: ['React.js', 'Next.js', 'React Native', 'Tailwind CSS', 'Redux'],
  },
  {
    icon: Server,
    title: 'Backend',
    skills: ['Node.js', 'Express.js', 'FastAPI', 'Socket.io', 'REST APIs'],
  },
  {
    icon: Database,
    title: 'Databases',
    skills: ['MongoDB', 'PostgreSQL', 'Mongoose', 'Redis'],
  },
  {
    icon: Brain,
    title: 'AI & LLM',
    skills: ['Groq API', 'OpenAI', 'Gemini', 'LangGraph', 'LLM Integrations'],
  },
  {
    icon: Wrench,
    title: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'Vercel', 'Postman', 'Cloudinary'],
  },
];

export function Skills() {
  return (
    <section
      id="skills"
      className="relative min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-[#062f35] to-[#0a3a42]"
    >
      <div className="max-w-7xl mx-auto">
        <p className="section-label mb-4">03 — SKILLS</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-16">What I Work With</h2>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-4 auto-rows-max">
          {skillGroups.map((group, index) => {
            const Icon = group.icon;
            const colSpan = index === 0 ? 'md:col-span-2' : '';
            const rowSpan = index === skillGroups.length - 1 ? 'md:row-span-2' : '';

            return (
              <div
                key={group.title}
                className={`${colSpan} ${rowSpan} group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#ff9e68]/50 hover:bg-[#ff9e68]/5 transition-all duration-300 cursor-pointer overflow-hidden`}
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
