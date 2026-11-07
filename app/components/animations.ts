import gsap from 'gsap';

/**
 * GSAP Animation Utilities for Portfolio
 * Handles scroll-triggered and timed animations
 */

export const animateOnScroll = (
  selector: string,
  options?: gsap.TweenVars
) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none none',
        },
        ...options,
      }
    );
  });
};

export const animateHeroSection = () => {
  const timeline = gsap.timeline();

  timeline.fromTo(
    '.hero-title',
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    0
  );

  timeline.fromTo(
    '.hero-subtitle',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    0.2
  );

  timeline.fromTo(
    '.hero-description',
    { opacity: 0 },
    { opacity: 1, duration: 0.6, ease: 'power2.out' },
    0.4
  );

  timeline.fromTo(
    '.hero-cta',
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
    0.6
  );
};

export const animateStaggered = (
  selector: string,
  stagger = 0.1,
  options?: gsap.TweenVars
) => {
  gsap.fromTo(
    selector,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: selector,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      ...options,
    }
  );
};

export const animateHover = (selector: string) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener('mouseenter', () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });
};

export const animateCounter = (
  selector: string,
  target: number,
  duration = 2
) => {
  gsap.fromTo(
    selector,
    { innerText: 0 },
    {
      innerText: target,
      duration,
      snap: { innerText: 1 },
      ease: 'power2.out',
      scrollTrigger: {
        trigger: selector,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );
};

export const initScrollAnimations = () => {
  // Register ScrollTrigger plugin if not already registered
  if (!gsap.plugins.ScrollTrigger) {
    console.warn('ScrollTrigger plugin not registered');
  }

  animateHeroSection();
  animateOnScroll('.section-fade');
  animateStaggered('.project-card');
  animateHover('.interactive-element');
};
