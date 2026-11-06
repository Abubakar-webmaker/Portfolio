# Portfolio Animation & UI Enhancement Plan

**Task:** Implement 7 animation and UI improvements to M. Abubakar's portfolio.  
**Project Type:** Vanilla HTML/CSS/JS with GSAP 3.13 + Vite 5  
**Build Command:** `npm run dev` / `npm run build`  
**Test Command:** Open in browser, test via Vite dev server  

---

## Executive Summary

The portfolio is a full-screen, section-snapping cinematic experience built with vanilla JS, CSS3, and GSAP. It already has:
- Page navigation with smooth transitions
- Scroll progress bar (✓ already working, needs verification)
- 3D-tilt project cards with drag/wheel/touch interaction
- Floating skill bubbles
- Contact form with EmailJS
- Experience timeline

This plan adds 7 professional enhancements in order of dependency and effort. Each feature is grounded in the existing GSAP/ScrollTrigger setup and respects the project's vanilla-JS, no-React philosophy.

---

## Feature 1: Verify & Optimize Scroll Progress Bar
**Status:** VERIFICATION ONLY  
**Effort:** 30 min  
**Dependencies:** None

### Current State
The scroll progress bar (`.scroll-progress-bar`) is already implemented:
- HTML: `<div class="scroll-progress-bar"></div>` in the `<body>`
- CSS: Fixed position, gradient background, box-shadow glow
- JS: `ScrollTrigger.create()` hook updates width on scroll using `onUpdate(self)` callback

### What to Verify
1. Progress bar appears at top of page with correct gradient (orange → rust → teal)
2. Width animates smoothly from 0–100% as user scrolls through all sections
3. Box-shadow glow is visible (not too subtle, not overwhelming)
4. Performance: no jank when scrolling rapidly
5. Mobile: bar remains visible on mobile, scales correctly

### Potential Issues to Check
- If scroll feels stuck/unresponsive, ScrollTrigger may need a refresh after DOM load
- Gradient may be too muted on some displays — check opacity/saturation
- Mobile viewport height (`100dvh`) may cause bar to overflow

### Changes Needed (if any)
- Ensure `ScrollTrigger.refresh()` is called after page load
- If bar jumps unexpectedly, add `overwrite: true` to the GSAP tween (already done)
- Test on actual mobile device (iOS/Android)

### Verification Steps
1. Open dev server: `npm run dev`
2. Scroll through all sections and watch the progress bar fill 0–100%
3. Check browser DevTools → Performance: animation should run at 60 FPS
4. Test mobile (use browser DevTools mobile emulation) — bar should scale and remain visible

---

## Feature 2: Hero Section Parallax Layers
**Status:** IMPLEMENTATION  
**Effort:** 2–3 hours  
**Dependencies:** Feature 1 (scroll progress working)  
**Complexity:** Medium

### Goal
Add depth perception to the hero section by moving background shapes slowly (0.3–0.5 scrub) and foreground text faster (0.8 scrub) as user scrolls. This creates a "3D layering" effect popular in premium portfolios (Aceternity, Skiper).

### Current State
- Hero section (`.panel-home`) has a radial gradient background with two radial gradients layered on top
- Background SVG noise overlay
- No parallax — static background

### Design Approach
1. **Background shapes (slow parallax, 0.3–0.5 scrub)**
   - Apply `gsap.to()` with `ScrollTrigger` to existing background gradients
   - Use CSS custom properties (`--parallax-y`) to control `translateY()` of pseudo-elements
   - Scrub value: 0.4 (gentle, smooth lag behind scroll)

2. **Foreground text (fast parallax, 0.8 scrub)**
   - Animate `.home-copy` and `.hero-media` up slightly as user scrolls
   - Scrub value: 0.8 (more responsive, follows scroll closely)

3. **Trigger**
   - Use `ScrollTrigger.create()` scoped to the hero section
   - Start: when hero enters viewport
   - End: when hero exits viewport
   - Duration: full height of section

### Implementation Details

#### CSS Changes
```css
/* Add to :root */
--parallax-y: 0px;

/* Modify .panel-home::before */
.panel-home::before {
  /* existing styles */
  transform: translateY(var(--parallax-y));
  will-change: transform;
}

/* Optional: add parallax to hero text container */
.home-copy {
  transform: translateY(var(--parallax-text-y, 0px));
  will-change: transform;
}

.hero-media {
  transform: translateY(var(--parallax-media-y, 0px));
  will-change: transform;
}
```

#### JS Changes (in `script.js`, after section setup)
```javascript
// ── HERO PARALLAX ──────────────────────────────────────────────────
function initHeroParallax() {
  const heroPanel = document.getElementById('home');
  if (!heroPanel) return;

  // Background shapes: slow parallax
  ScrollTrigger.create({
    trigger: heroPanel,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.4,
    onUpdate: (self) => {
      const dist = self.progress * 60; // 60px total travel
      heroPanel.style.setProperty('--parallax-y', `-${dist}px`);
    },
    markers: false // set to true for debugging
  });

  // Foreground text: fast parallax (optional, more premium feel)
  const homeText = heroPanel.querySelector('.home-copy');
  if (homeText) {
    ScrollTrigger.create({
      trigger: heroPanel,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
      onUpdate: (self) => {
        const dist = self.progress * 30; // 30px total travel
        homeText.style.transform = `translateY(${dist}px)`;
      }
    });
  }
}

// Call after panels are initialized
initHeroParallax();
```

### Accessibility & Performance
- **prefers-reduced-motion:** Later feature (#7) will disable/reduce scrub on reduced-motion users
- **Performance:** Parallax uses `will-change: transform` and CSS transforms (GPU-accelerated), not layout properties
- **Mobile:** Scrub values may feel too aggressive on mobile (slower devices) — adjust if needed

### Verification Steps
1. Scroll through hero section — background should lag behind scroll (0.4s delay)
2. Text should move slightly forward relative to background (depth effect)
3. No jank or stuttering; animation stays at 60 FPS
4. Mobile: parallax should still feel smooth (may reduce scrub to 0.2 on mobile if needed)

### Files to Modify
- `style.css` — add `--parallax-y` and transform to `.panel-home::before`, `.home-copy`, `.hero-media`
- `script.js` — add `initHeroParallax()` function and call it after `showInitialPage()`

---

## Feature 3: Projects Section Pinned Horizontal Scroll
**Status:** IMPLEMENTATION  
**Effort:** 3–4 hours  
**Dependencies:** Feature 1 (scroll working), existing work card code  
**Complexity:** High

### Goal
Create an Apple-style "pinned horizontal scroll" effect:
1. Pin the `.panel-work` section to the viewport as user scrolls
2. Transform `.cw-track` (project cards) horizontally based on scroll distance
3. Unpin and snap to next section when all cards are scrolled

### Current State
- Project cards are already interactive (drag, wheel, keyboard)
- Cards have 3D perspective transforms applied based on center distance
- Dots pagination exists
- Wheel handler already exists (`_cwHandleWheel`)

### Design Approach
1. **ScrollTrigger Pin**
   - `pin: '#work'` when entering section
   - Duration: long enough to show all cards (typically 300–400vh height)
   - Stop: when user reaches end of cards or next section

2. **Horizontal Transform**
   - Calculate total scroll distance needed to show all cards
   - Map scroll progress (0–1) to translateX offset
   - Disable page navigation while pinned (only card navigation)

3. **Unpin Behavior**
   - When last card is reached, unpin and allow page nav to next section
   - Smooth transition from pin → unpin

### Implementation Details

#### JS Changes (in the cinematic work section init)
```javascript
// ── PINNED HORIZONTAL SCROLL ──────────────────────────────────────
function initWorkPin() {
  const workPanel = document.getElementById('work');
  const cwTrack = document.getElementById('cwTrack');
  if (!workPanel || !cwTrack) return;

  const cards = Array.from(cwTrack.querySelectorAll('.cw-card'));
  const cardWidth = () => cards[0]?.offsetWidth || 300;
  const gap = () => parseFloat(getComputedStyle(cwTrack).gap) || 20;
  const totalTrackWidth = cards.length * cardWidth() + (cards.length - 1) * gap();
  const viewportWidth = window.innerWidth;
  const scrollDistance = totalTrackWidth - viewportWidth;

  // Create pin trigger
  const pinTrigger = ScrollTrigger.create({
    trigger: workPanel,
    pin: true,
    start: 'top top',
    end: `+=${scrollDistance + 400}px`, // extra buffer for final snap
    scrub: 1, // smooth scrub tied to scroll
    onUpdate: (self) => {
      // Map scroll progress to horizontal offset
      const progress = self.progress; // 0 to 1
      const offset = -progress * scrollDistance;
      gsap.set(cwTrack, { x: offset, overwrite: 'auto' });
    },
    markers: false
  });

  // Cleanup on resize
  window.addEventListener('resize', () => {
    pinTrigger.kill();
    initWorkPin(); // re-init with new measurements
  });
}

// Call after cinematic work initialization
initWorkPin();
```

### CSS Considerations
- `.cw-track` already has `will-change: transform` (good)
- `.cw-track-outer` has overflow clipping (good)
- Fade masks (`.cw-track-outer::before/after`) will help smooth edges

### Accessibility & Performance
- **Reduced Motion:** Disable pinning on `prefers-reduced-motion` users (Feature #7)
- **Mobile:** Pinned scroll can feel strange on small screens — consider disabling on mobile (< 768px)
- **Performance:** Uses GPU-accelerated transforms; should stay at 60 FPS

### Potential Issues
- **Scroll hijacking:** Users expect normal page scroll, not pinned behavior. Add a visual hint ("drag/scroll" text already exists as `.cw-hint`)
- **Resizing:** If window resizes mid-scroll, ScrollTrigger needs refresh
- **Mobile:** Swipe/touch might behave unexpectedly with pin active

### Verification Steps
1. Enter work section — should pin immediately
2. Scroll down — cards move left, new cards appear from right
3. Last card reaches center — continue scrolling should unpin and move to next section
4. No jank; smooth at 60 FPS
5. Test mobile: consider disabling on < 768px viewport

### Files to Modify
- `script.js` — add `initWorkPin()` and call after `initCinematicWork()`

---

## Feature 4: Spotlight/Cursor-Glow Effect (Aceternity-style)
**Status:** IMPLEMENTATION  
**Effort:** 2–3 hours  
**Dependencies:** None (can work alongside other features)  
**Complexity:** Medium

### Goal
Add a mouse-following radial gradient glow effect to the hero section and project cards. This is a signature Aceternity UI effect that adds interactivity and polish without requiring React.

### Principle
1. Track mouse position with `mousemove` listener
2. Create a radial gradient that follows cursor
3. Apply as a background or use a pseudo-element overlay
4. Use CSS custom properties to update gradient position in real-time

### Current State
- Project cards already have hover effects (rotation, glow)
- No cursor-glow effect yet
- Experience section already has `--mx` and `--my` custom properties for mouse tracking

### Design Approach

#### 1. Add a cursor-glow overlay to hero section
```javascript
// ── HERO CURSOR GLOW ──────────────────────────────────────────────
function initHeroCursorGlow() {
  const heroPanel = document.getElementById('home');
  if (!heroPanel) return;

  // Create or use existing overlay
  let glowOverlay = heroPanel.querySelector('.hero-glow-overlay');
  if (!glowOverlay) {
    glowOverlay = document.createElement('div');
    glowOverlay.className = 'hero-glow-overlay';
    heroPanel.appendChild(glowOverlay);
  }

  heroPanel.addEventListener('mousemove', (e) => {
    const rect = heroPanel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set custom properties for radial gradient positioning
    heroPanel.style.setProperty('--glow-x', x + 'px');
    heroPanel.style.setProperty('--glow-y', y + 'px');
  });

  heroPanel.addEventListener('mouseleave', () => {
    glowOverlay.style.opacity = '0';
  });

  heroPanel.addEventListener('mouseenter', () => {
    glowOverlay.style.opacity = '1';
  });
}
```

#### 2. Add cursor-glow to project cards
```javascript
// ── CARD CURSOR GLOW ──────────────────────────────────────────────
function initCardCursorGlow() {
  document.querySelectorAll('.cw-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);

      // Existing code in cinematic work already does this
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');

      // Add glow effect
      const glow = card.querySelector('.cw-glow');
      if (glow) {
        // Position glow at cursor (offset slightly)
        const offsetX = (parseFloat(x) - 50) * 0.5;
        const offsetY = (parseFloat(y) - 50) * 0.5;
        glow.style.setProperty('--glow-offset-x', offsetX + '%');
        glow.style.setProperty('--glow-offset-y', offsetY + '%');
      }
    });
  });
}
```

### CSS Changes

#### Hero Glow Overlay
```css
.hero-glow-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: radial-gradient(
    circle 300px at var(--glow-x, 50%) var(--glow-y, 50%),
    rgba(255, 158, 104, 0.15) 0%,
    rgba(255, 158, 104, 0.05) 25%,
    transparent 70%
  );
  will-change: background;
}
```

#### Card Glow Enhancement
```css
.cw-glow {
  /* existing styles */
  left: calc(50% + var(--glow-offset-x, 0%));
  top: calc(50% + var(--glow-offset-y, 0%));
  transition: left 0.2s ease, top 0.2s ease;
}
```

### Accessibility & Performance
- **Reduced Motion:** Disable glow updates on `prefers-reduced-motion`
- **Performance:** Uses CSS custom properties (GPU-optimized), not layout recalculation
- **Throttle:** On mobile, throttle mousemove to every 50ms to avoid spam

### Verification Steps
1. Move cursor over hero section — radial glow should follow smoothly
2. Move cursor over project cards — glow should drift with cursor (subtle)
3. No jank; stays at 60 FPS
4. Mobile: glow optional (touch doesn't have mouse tracking)

### Files to Modify
- `style.css` — add `.hero-glow-overlay` and update `.cw-glow`
- `script.js` — add `initHeroCursorGlow()` and enhance `initCardCursorGlow()` (if separate from existing)

---

## Feature 5: Skills Section Bento Grid Layout
**Status:** IMPLEMENTATION  
**Effort:** 3–4 hours  
**Dependencies:** None (independent)  
**Complexity:** Medium

### Goal
Convert the flat 3-column grid of skill groups into a bento-grid layout with varying card sizes. Keep floating bubbles animation but enhance with staggered entrance, hover effects, and premium card styling.

### Current State
- `.skills-grid` is a `3-column, 2-row` CSS grid
- Skill groups have bubble animations (physics-based floating)
- Floating bubbles are controlled by JS (not CSS animations)
- No varying sizes or bento aesthetic

### Design Approach

#### Bento Layout Grid
```css
.skills-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto auto;
  gap: 14px;
  grid-auto-flow: dense; /* Fill gaps intelligently */
}

/* Define card sizes using grid-column/row spans */
.skill-group:nth-child(1) {
  grid-column: span 2;
  grid-row: span 2;
}

.skill-group:nth-child(2) {
  grid-column: span 1;
  grid-row: span 1;
}

.skill-group:nth-child(3) {
  grid-column: span 1;
  grid-row: span 1;
}

.skill-group:nth-child(4) {
  grid-column: span 2;
  grid-row: span 1;
}

.skill-group:nth-child(5) {
  grid-column: span 2;
  grid-row: span 1;
}

.skill-group:nth-child(6) {
  grid-column: span 2;
  grid-row: span 2;
}
```

#### Larger Card Styling
```css
.skill-group {
  /* existing base styles */
  padding: 20px; /* increased from 14px */
  background: rgba(255, 255, 255, 0.05); /* slightly more opaque */
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.4s cubic-bezier(.22, 1, .36, 1);
}

.skill-group:hover {
  border-color: rgba(255, 158, 104, 0.3);
  background: rgba(255, 158, 104, 0.08);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

#### Floating Bubbles Scaling
Larger cards get more space, so bubbles can animate in larger area:
```css
.skill-group:nth-child(1) .skill-bubble-wrap {
  /* larger container for bubbles */
  width: 100%;
  height: 100%;
}

.skill-group:nth-child(1) .skill-bubble-ball {
  width: 72px; /* larger for big card */
  height: 72px;
}
```

### JS Enhancements
1. **Staggered entrance animation**
   - Animate skill cards in sequence (0.1s stagger) when section becomes visible
   - Use `.reveal` pattern already in codebase

2. **Enhanced floating physics**
   - Larger cards get larger amplitude floating motion
   - Bubble animation continues (no changes to physics)

```javascript
// ── SKILL CARDS ENTRANCE ANIMATION ──────────────────────────────
function initSkillCardEntrance() {
  const skillCards = document.querySelectorAll('.skill-group');
  skillCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 30, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: i * 0.08, ease: 'power3.out' }
    );
  });
}

// Call when skills section becomes visible
function triggerSkillBalls() {
  initSkillCardEntrance();
  // existing bubble animation code continues
}
```

### Accessibility & Performance
- **Reduced Motion:** Skip entrance animation and stagger on `prefers-reduced-motion`
- **Mobile Responsiveness:** Collapse to 2-column on tablet, 1-column on mobile (use CSS media queries)
- **Performance:** Grid layout is native CSS, no performance hit

### Mobile Breakpoints
```css
@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .skill-group {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
}

@media (max-width: 480px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
```

### Verification Steps
1. Skills section loads with staggered card animation
2. Bento layout is visually balanced (not too many large cards in one area)
3. Floating bubbles animate inside cards (no overflow)
4. Hover effect: cards lift slightly and glow
5. Mobile: grid collapses gracefully

### Files to Modify
- `style.css` — rewrite `.skills-grid` as bento layout, add size spans, hover effects
- `script.js` — add `initSkillCardEntrance()` and call in `triggerSkillBalls()`

---

## Feature 6: WebGL/Noise Texture Background
**Status:** IMPLEMENTATION  
**Effort:** 4–5 hours  
**Dependencies:** None (independent)  
**Complexity:** High

### Goal
Add an animated noise/gradient-mesh background to the entire page (behind all sections). This creates a premium, dynamic feel without being too intrusive. Use Canvas 2D with layered noise and subtle color gradients (Animmaster library style).

### Current State
- Page background is solid dark blue (`#062f35`)
- Static SVG noise overlay (`.noise` element) with grain animation
- Each section has its own gradient background

### Design Approach

#### Option A: Canvas 2D Noise (Recommended for mobile)
- Lightweight
- Uses Perlin-like noise (Simplex or custom algorithm)
- Animate by shifting noise offset every frame
- Less GPU intensive than WebGL

#### Option B: WebGL Shader (Premium but risky)
- More complex, requires shader compilation
- Could break on older devices
- **Decision:** Use Canvas 2D for better compatibility; WebGL optional for future

### Canvas 2D Implementation

```javascript
// ── ANIMATED NOISE BACKGROUND ──────────────────────────────────────
class NoiseBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.imageData = null;
    this.data = null;
    this.time = 0;
    this.speed = 0.02; // noise offset speed
    this.scale = 80; // noise cell size
    this.init();
  }

  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'noise-bg-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    `;
    document.body.insertBefore(this.canvas, document.body.firstChild);

    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    this.data = this.imageData.data;

    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  perlinNoise(x, y, z) {
    // Simplified Perlin-like noise (hash-based)
    const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
    return n - Math.floor(n);
  }

  generateNoise(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const scale = this.scale;

    for (let i = 0; i < w * h; i++) {
      const x = (i % w) / scale;
      const y = Math.floor(i / w) / scale;

      // Multi-octave noise
      let noise = 0;
      noise += this.perlinNoise(x, y, time) * 0.5;
      noise += this.perlinNoise(x * 2, y * 2, time * 0.7) * 0.3;
      noise += this.perlinNoise(x * 4, y * 4, time * 0.4) * 0.2;

      // Color mapping: dark grays with subtle orange/teal tint
      const val = Math.floor(noise * 255);
      const baseColor = Math.floor(15 + val * 0.08); // 15–35 range (dark)

      const idx = i * 4;
      this.data[idx] = baseColor;        // R
      this.data[idx + 1] = baseColor;    // G
      this.data[idx + 2] = baseColor;    // B
      this.data[idx + 3] = 255;          // A
    }

    this.ctx.putImageData(this.imageData, 0, 0);
  }

  animate = () => {
    this.time += this.speed;
    this.generateNoise(this.time);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    this.data = this.imageData.data;
  }
}

// Initialize
const noiseBg = new NoiseBackground();
```

### CSS Adjustments

```css
body {
  /* Ensure canvas stays behind everything */
  z-index: 0;
}

.noise-bg-canvas {
  opacity: 0.06; /* subtle, not overwhelming */
}

/* Ensure all panels sit above canvas */
.panel {
  z-index: 1;
}

.site-header {
  z-index: 30;
}

/* On prefers-reduced-motion, pause animation */
@media (prefers-reduced-motion: reduce) {
  .noise-bg-canvas {
    animation: none !important;
  }
}
```

### Performance Optimization
- **Throttle on mobile:** Reduce animation speed on < 768px
- **Disable on low-end devices:** Check for `devicePixelRatio > 2` or use feature detection
- **Canvas size:** Use 1/4 resolution on mobile (every 2nd pixel), upscale with CSS

```javascript
// Detect low-end device
if (window.devicePixelRatio > 2 || window.innerWidth < 768) {
  noiseBg.speed = 0.01; // slower
  // Or disable entirely on very old devices
}
```

### Verification Steps
1. Page loads with subtle animated noise background
2. Animation is smooth (doesn't stutter)
3. Noise doesn't overwhelm content (opacity ~0.06)
4. Mobile: animation speed reduced or disabled
5. Performance check: Chrome DevTools → Performance shows stable 60 FPS

### Files to Modify
- `script.js` — add `NoiseBackground` class and initialize at page load
- `style.css` — adjust z-index stacking, add canvas styling

---

## Feature 7: Accessibility & Mobile Performance
**Status:** IMPLEMENTATION  
**Effort:** 3–4 hours  
**Dependencies:** All previous features (needs to be applied everywhere)  
**Complexity:** Medium

### Goal
1. Respect `prefers-reduced-motion` media query — disable/reduce all animations for users who prefer it
2. Handle ScrollTrigger refresh/kill on viewport breakpoint changes (prevents lag on resize)
3. Throttle mousemove listeners (especially cursor glow) to avoid jank on mobile
4. Disable WebGL/heavy Canvas on mobile (< 768px or low-end devices)
5. Test on real devices (iOS Safari, Android Chrome)

### Current State
- No `prefers-reduced-motion` handling
- ScrollTrigger may not refresh properly on window resize
- Cursor glow and floating bubbles animate constantly (could be heavy on mobile)
- No mobile-specific feature detection

### Implementation

#### 1. Respect prefers-reduced-motion

```javascript
// ── ACCESSIBILITY: REDUCED MOTION ──────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Global flag for animation features
window.animationEnabled = !prefersReducedMotion;

// If reduced motion is preferred, disable/reduce animations
if (prefersReducedMotion) {
  // Disable parallax scrub
  // Disable cursor glow animation
  // Reduce animation duration
  // Skip staggered entrance animations
}
```

**CSS Disable Parallax:**
```css
@media (prefers-reduced-motion: reduce) {
  .panel-home::before,
  .home-copy,
  .hero-media {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }

  .scroll-progress-bar {
    transition: width 0s !important;
  }

  /* Disable all GSAP animations */
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**JS Disable Animations:**
```javascript
function initHeroParallax() {
  if (prefersReducedMotion) return; // skip parallax entirely
  // ... existing parallax code
}

function initCardCursorGlow() {
  if (prefersReducedMotion) return; // skip glow
  // ... existing glow code
}

// Reduce scrub values on reduced motion
const scrubValue = prefersReducedMotion ? 0 : 0.4; // 0 = instant, no scrub
```

#### 2. ScrollTrigger Refresh on Resize

```javascript
// ── SCROLLTRIGGER MANAGEMENT ──────────────────────────────────────
let resizeTimer;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Kill and reinitialize ScrollTriggers that depend on layout
    ScrollTrigger.getAll().forEach(trigger => {
      trigger.kill();
    });

    // Reinitialize critical ScrollTriggers
    initHeroParallax();
    initWorkPin();
    // ... reinit others as needed

    // Or use ScrollTrigger.refresh() as shortcut
    ScrollTrigger.refresh();
  }, 200); // wait 200ms after resize stops
});
```

#### 3. Throttle Mousemove (Cursor Glow)

```javascript
// ── THROTTLED MOUSEMOVE ──────────────────────────────────────────
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Apply to hero glow
const heroPanel = document.getElementById('home');
const throttledMousemove = throttle((e) => {
  const rect = heroPanel.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  heroPanel.style.setProperty('--glow-x', x + 'px');
  heroPanel.style.setProperty('--glow-y', y + 'px');
}, 50); // throttle to 50ms (max 20 updates/sec)

heroPanel.addEventListener('mousemove', throttledMousemove);
```

#### 4. Mobile-Specific Feature Detection

```javascript
// ── MOBILE OPTIMIZATION ──────────────────────────────────────────
const isMobile = window.innerWidth < 768 || /iPhone|iPad|Android/i.test(navigator.userAgent);
const isLowEnd = window.devicePixelRatio > 2;

// Disable heavy features on mobile
if (isMobile) {
  // Disable WebGL/Canvas noise, or reduce refresh rate
  noiseBg.speed = 0.01; // slower animation
  
  // Disable cursor glow (touch doesn't have mouse tracking)
  // already handled by checking for mousemove

  // Reduce parallax scrub (can feel sluggish)
  // Reduce project card pin height
}

// Detect media query changes (portrait ↔ landscape)
window.addEventListener('orientationchange', () => {
  // Refresh ScrollTriggers after orientation change
  setTimeout(() => ScrollTrigger.refresh(), 200);
});
```

#### 5. CSS Media Queries for Performance

```css
/* Mobile: reduce animations */
@media (max-width: 768px) {
  .scroll-progress-bar {
    height: 2px; /* thinner on mobile */
  }

  .cw-track {
    /* Reduce 3D effect on mobile */
    perspective: none;
  }

  .skill-group {
    transform: none !important; /* no hover lift */
  }

  /* Disable hero glow overlay on mobile */
  .hero-glow-overlay {
    display: none;
  }
}

/* Very small devices */
@media (max-width: 480px) {
  .panel-work {
    /* Disable pin on very small screens */
    /* handled in JS, but CSS can disable if needed */
  }
}
```

### Testing Checklist

- [ ] **prefers-reduced-motion:** Enable in macOS System Preferences → Accessibility → Display → Reduce motion. Animations should be disabled or instant.
- [ ] **Mobile Safari (iOS):** Open on iPhone, test scroll, carousel, touch interactions. Check for 60 FPS performance.
- [ ] **Android Chrome:** Test on Android device. Check performance, glow/parallax behavior.
- [ ] **Resize:** Open on desktop, resize window from full-width to mobile. Sections should reflow, ScrollTriggers should refresh.
- [ ] **Throttle:** Use Chrome DevTools Throttling (slow 3G, etc.). Page should still be interactive.
- [ ] **Low-end Device:** Use Chrome DevTools Device Emulation (low-end Android). Reduce feature set should work smoothly.

### Verification Steps
1. Enable reduced motion on OS → open portfolio → no animations, instant transitions
2. Resize window from 1920px to 480px → no layout breaks, ScrollTriggers update correctly
3. Mobile: scroll/tap should be smooth at 60 FPS
4. Cursor glow should not fire excessively (throttled to ~20 updates/sec)
5. Canvas noise should pause/reduce on mobile

### Files to Modify
- `script.js` — add prefers-reduced-motion check, throttle function, resize handler, mobile detection
- `style.css` — add media queries for mobile performance

---

## Integration & Rollout Strategy

### Order of Implementation
1. **Feature 1:** Verify scroll progress (quick win, no breaking changes)
2. **Feature 2:** Hero parallax (isolated, builds on scroll progress)
3. **Feature 3:** Project pin (more complex, builds on existing wheel handler)
4. **Feature 4:** Cursor glow (independent, can add anytime)
5. **Feature 5:** Bento grid (CSS-heavy, isolated)
6. **Feature 6:** Noise background (Canvas, independent)
7. **Feature 7:** Accessibility (applies retroactively to all above)

### Branch Strategy
- Create feature branches: `feat/scroll-progress-verify`, `feat/hero-parallax`, etc.
- Test each locally: `npm run dev`
- Build and preview: `npm run build && npm run preview`
- Lint: `npm run lint`
- Merge to main once verified

### Performance Budget
- **Scroll Progress:** < 1 KB, instant rendering
- **Hero Parallax:** < 2 KB, smooth 60 FPS
- **Project Pin:** < 2 KB, smooth 60 FPS with 6 cards
- **Cursor Glow:** < 1 KB, throttled mousemove
- **Bento Grid:** 0 KB (CSS), smooth with 6 cards
- **Noise Canvas:** ~3 KB, 15–25 FPS on mobile (acceptable for background)
- **Accessibility:** 0 KB (CSS + JS flags)

**Total Expected Size:** < 10 KB min.js additional

### Testing Environment
- **Local:** Vite dev server, live reload
- **Desktop:** Chrome/Firefox/Safari full-width
- **Mobile:** iOS Safari (iPad/iPhone), Android Chrome
- **Performance:** Chrome DevTools Performance tab, Network throttling

---

## Potential Issues & Workarounds

| Issue | Cause | Workaround |
|-------|-------|-----------|
| Parallax feels sluggish on mobile | Scrub value too high | Reduce `scrub: 0.4` to `0.15` on mobile |
| Project carousel jumps after pin | ScrollTrigger not refreshed | Call `ScrollTrigger.refresh()` after animation completes |
| Cursor glow causes lag | Too many mousemove events | Throttle to 50ms (20 updates/sec max) |
| Bento grid breaks on mobile | Spans too wide | Collapse all to 1-column on < 480px |
| Canvas noise flickers | Frame skip | Reduce animation speed or disable on slow devices |
| Skill bubbles don't float in large cards | Container too small | Increase bubble container size on larger cards |
| Scroll progress bar jitters | Velocity detection | Add `overwrite: 'auto'` to GSAP tween |

---

## Success Criteria

✅ **Feature 1:** Scroll progress bar fills 0–100% smoothly, no jank  
✅ **Feature 2:** Hero parallax visible, background lags text by ~0.4s, 60 FPS  
✅ **Feature 3:** Projects pin and scroll horizontally, unpin smoothly, 60 FPS on 6 cards  
✅ **Feature 4:** Cursor glow follows mouse smoothly, no visible lag  
✅ **Feature 5:** Bento grid visually balanced, hover effects work, bubbles animate freely  
✅ **Feature 6:** Canvas noise animates subtly, doesn't overwhelm content, < 25 FPS acceptable on mobile  
✅ **Feature 7:** Animations disabled on `prefers-reduced-motion`, mobile performs at 60 FPS, ScrollTriggers refresh on resize  

---

## Deployment Checklist

- [ ] All features tested locally on dev server
- [ ] `npm run lint` passes (no ESLint errors)
- [ ] `npm run build` succeeds, no console errors
- [ ] `npm run preview` shows all features working
- [ ] Tested on iOS Safari (iPhone/iPad)
- [ ] Tested on Android Chrome
- [ ] Tested on desktop (Chrome, Firefox, Safari)
- [ ] `prefers-reduced-motion` respected
- [ ] No console warnings/errors
- [ ] Performance: > 90 Lighthouse score (if applicable)
- [ ] Branches merged, conflicts resolved
- [ ] Commit messages follow Conventional Commits (`feat:`, `fix:`, etc.)

---

## References & Inspiration

- **Aceternity UI:** Cursor glow, 3D cards, premium animations
- **Skiper:** Bento grid layout, entrance animations
- **Animmaster:** Animated noise backgrounds, premium feel
- **GSAP Docs:** https://gsap.com/docs/
- **ScrollTrigger Docs:** https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **MDN: prefers-reduced-motion:** https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

---

**Last Updated:** [Current Date]  
**Status:** READY FOR IMPLEMENTATION
