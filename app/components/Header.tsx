'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#work', label: 'Work' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm bg-[#062f35]/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Brand */}
          <Link href="#home" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border-2 border-[#f5f0e8] flex items-center justify-center">
              <span className="font-display font-bold text-lg text-[#f5f0e8]">A</span>
            </div>
            <div className="hidden md:flex flex-col gap-1">
              <p className="font-mono text-xs tracking-widest text-[#f5f0e8] leading-none">
                AHSAN AZIZ
              </p>
              <p className="font-mono text-xs text-white/60 leading-none">
                DEVOPS ENGINEER
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white/90 hover:bg-white/5 rounded-lg transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#062f35]/95 backdrop-blur-sm">
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Side Navigation */}
      <nav className="hidden lg:fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            className="w-10 h-10 flex flex-col items-center justify-center text-xs font-mono text-white/40 hover:text-white transition-colors group relative"
            title={link.label}
          >
            <span className="absolute right-full mr-4 bg-black/70 px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {link.label}
            </span>
            {String(i + 1).padStart(2, '0')}
          </a>
        ))}
      </nav>
    </>
  );
}
