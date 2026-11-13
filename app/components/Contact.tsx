'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error('Please fill in all fields');
      }

      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Send email via EmailJS
      // For now, we'll just show a success message
      // In production, integrate with EmailJS API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-20 px-4 md:px-8 bg-gradient-to-br from-[#0a3a42] via-[#062f35] to-[#0a3a42]">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff9e68] rounded-full filter blur-3xl opacity-3" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label justify-center mb-4">06 — CONTACT</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-lg text-white/75">
            Have a project in mind or want to collaborate? Drop me a message and I'll get back to you soon.
          </p>
        </div>

        {/* Contact Form */}
        <div className="relative group bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 md:p-12 hover:border-[#ff9e68]/50 transition-all duration-300 overflow-hidden">
          {/* Hover glow box animation */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff9e68]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Animated box on hover */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#ff9e68]/20 to-transparent opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 -z-10 pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full h-12 md:h-10 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#ff9e68]/50 focus:ring-1 focus:ring-[#ff9e68]/50 transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full h-12 md:h-10 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#ff9e68]/50 focus:ring-1 focus:ring-[#ff9e68]/50 transition-all"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Project enquiry"
                className="w-full h-12 md:h-10 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#ff9e68]/50 focus:ring-1 focus:ring-[#ff9e68]/50 transition-all"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#ff9e68]/50 focus:ring-1 focus:ring-[#ff9e68]/50 transition-all resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full pill-btn pill-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  Send Message <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="flex items-center gap-3 p-4 bg-[#4ade80]/10 border border-[#4ade80]/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#4ade80]" />
                <p className="text-[#4ade80] text-sm">
                  Message sent successfully! I'll get back to you soon.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-3 p-4 bg-[#ff4b42]/10 border border-[#ff4b42]/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-[#ff4b42]" />
                <p className="text-[#ff4b42] text-sm">{errorMessage}</p>
              </div>
            )}
          </form>
        </div>

        {/* Alternative Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-white/70 mb-6">Or reach out directly:</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a
              href="mailto:ahsanaziz.dev@gmail.com"
              className="pill-btn pill-btn-outline"
            >
              Email
            </a>
            <a
              href="https://github.com/mahsanaziz"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn pill-btn-outline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-ahsan-b912a7284/"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn pill-btn-outline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
