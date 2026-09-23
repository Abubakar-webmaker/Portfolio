/* global gsap, ScrollTrigger, lucide */
gsap.registerPlugin(ScrollTrigger);

const panels = gsap.utils.toArray(".panel");
const navButtons = gsap.utils.toArray(".side-nav button");
const sweep1 = document.querySelector(".sweep-1");
const sweep2 = document.querySelector(".sweep-2");

let current = 0;
let isTransitioning = false;
let touchStartY = 0;
let touchStartX = 0;

// Track skill ball RAF ids so we can cancel when panel is hidden
const rafIds = [];

document.body.classList.add("page-mode");

gsap.set(panels, { position: "absolute", inset: 0, autoAlpha: 0, y: 0 });
gsap.set(panels[0], { autoAlpha: 1 });

function setActive(index) {
  navButtons.forEach((button, i) => {
    button.classList.toggle("active", i === index);
  });
  const headerBtns = document.querySelectorAll(".header-nav button");
  headerBtns.forEach(btn => {
    const targetId = btn.dataset.target;
    const targetIndex = panels.findIndex(p => p.id === targetId);
    btn.classList.toggle("active", targetIndex === index);
  });
}

function showInitialPage() {
  const first = panels[0];
  gsap.fromTo(first.querySelectorAll(".reveal"),
    { y: 60, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, stagger: .07, ease: "power3.out" }
  );
  first.querySelectorAll(".reveal-media").forEach(media => {
    gsap.fromTo(media,
      { clipPath: "inset(0 0 100% 0)", y: 40 },
      { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.2, ease: "power4.out" }
    );
    const img = media.querySelector("img");
    if (img) gsap.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.5, ease: "power3.out" });
  });
}

function animatePageContent(panel, direction) {
  const reveals = panel.querySelectorAll(".reveal");
  const media = panel.querySelectorAll(".reveal-media");
  gsap.fromTo(reveals,
    { y: direction > 0 ? 70 : -70, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: .85, stagger: .065, delay: .12, ease: "power3.out" }
  );
  media.forEach(mediaEl => {
    gsap.fromTo(mediaEl,
      { clipPath: direction > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)", y: direction > 0 ? 35 : -35 },
      { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1, delay: .08, ease: "power4.out" }
    );
    const img = mediaEl.querySelector("img");
    if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.35, delay: .05, ease: "power3.out" });
  });
}

function goToPage(target, direction = target > current ? 1 : -1) {
  target = Math.max(0, Math.min(panels.length - 1, target));
  if (target === current || isTransitioning) return;
  isTransitioning = true;
  const outgoing = panels[current];
  const incoming = panels[target];
  // Pause skill balls when leaving skills panel
  if (outgoing.id === 'skills') { rafIds.forEach(id => cancelAnimationFrame(id)); rafIds.length = 0; }
  sweep1.classList.remove("run");
  sweep2.classList.remove("run");
  void sweep1.offsetWidth;
  sweep1.classList.add("run");
  sweep2.classList.add("run");
  setTimeout(() => {
    gsap.set(outgoing, { autoAlpha: 0 });
    gsap.set(incoming, { autoAlpha: 1, y: 0 });
    current = target;
    setActive(current);
  }, 200);
  setTimeout(() => {
    sweep1.classList.remove("run");
    sweep2.classList.remove("run");
    animatePageContent(incoming, direction);
    if (incoming.id === 'work') setTimeout(triggerWorkStagger, 300);
    if (incoming.id === 'experience') setTimeout(triggerExpTimeline, 400);
    if (incoming.id === 'skills') setTimeout(triggerSkillBalls, 100);
    isTransitioning = false;
  }, 650);
}

function nextPage() { if (!isTransitioning) goToPage(current + 1, 1); }
function previousPage() { if (!isTransitioning) goToPage(current - 1, -1); }

window.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (isTransitioning) return;
  if (Math.abs(event.deltaY) < 12) return;
  if (event.deltaY > 0) nextPage(); else previousPage();
}, { passive: false });

window.addEventListener("keydown", (event) => {
  if (["ArrowDown", "PageDown", " "].includes(event.key)) { event.preventDefault(); nextPage(); }
  if (["ArrowUp", "PageUp"].includes(event.key)) { event.preventDefault(); previousPage(); }
  if (event.key === "Home") { event.preventDefault(); goToPage(0); }
  if (event.key === "End")  { event.preventDefault(); goToPage(panels.length - 1); }
});

window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0].clientY;
  touchStartX = event.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchend", (event) => {
  if (isTransitioning) return;
  const dy = touchStartY - event.changedTouches[0].clientY;
  const dx = touchStartX - event.changedTouches[0].clientX;
  if (Math.abs(dy) < 45 || Math.abs(dy) < Math.abs(dx)) return;
  if (dy > 0) nextPage(); else previousPage();
}, { passive: true });

const allNavButtons = gsap.utils.toArray(".side-nav button, .header-nav button");
allNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    const index = panels.findIndex(p => p.id === target);
    if (index !== -1 && index !== current) goToPage(index, index > current ? 1 : -1);
  });
});

// data-target on pill buttons (hero, about, etc.)
document.querySelectorAll('[data-target]').forEach(btn => {
  if (btn.closest('.side-nav') || btn.closest('.header-nav')) return;
  btn.addEventListener('click', () => {
    const index = panels.findIndex(p => p.id === btn.dataset.target);
    if (index !== -1) goToPage(index, index > current ? 1 : -1);
  });
});

document.querySelector(".back-top")?.addEventListener("click", () => goToPage(0, -1));

// ── CONTACT FORM ──
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('cfName').value.trim();
  const email   = document.getElementById('cfEmail').value.trim();
  const message = document.getElementById('cfMessage').value.trim();
  if (!name || !email || !message) return;
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:m.abubakar.codes@gmail.com?subject=${subject}&body=${body}`;
  // Show success, disable button, reset fields after delay
  document.getElementById('cfSuccess').classList.add('show');
  this.querySelector('.cf-submit').disabled = true;
  setTimeout(() => {
    this.reset();
    document.getElementById('cfSuccess').classList.remove('show');
    this.querySelector('.cf-submit').disabled = false;
    lucide.createIcons();
  }, 4000);
});

// ── WORK CARD EFFECTS ──

// 1. Stagger entry
function triggerWorkStagger() {
  document.querySelectorAll(".project-card").forEach((card, i) => {
    card.classList.remove("card-visible");
    void card.offsetWidth;
    card.style.animationDelay = `${i * 80}ms`;
    card.classList.add("card-visible");
  });
}

// 2. Wire accent colour + 3D tilt + mouse spotlight
document.querySelectorAll(".project-card").forEach(card => {
  // Set CSS --accent from data attribute
  const accent = card.dataset.accent;
  if (accent) card.style.setProperty('--accent', accent);

  // 3D magnetic tilt
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-4px) perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ── EXPERIENCE EFFECTS ──

// Mouse-follow glow on experience panel
const expPanel = document.getElementById('experience');
expPanel.addEventListener('mousemove', e => {
  const r = expPanel.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
  const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
  expPanel.style.setProperty('--mx', x + '%');
  expPanel.style.setProperty('--my', y + '%');
});

// Card 3D tilt + inner light follow
document.querySelectorAll('.exp-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    card.style.transform = `perspective(700px) rotateY(${(x-.5)*8}deg) rotateX(${-(y-.5)*8}deg) translateY(-3px)`;
    card.style.setProperty('--cx', (x*100).toFixed(1)+'%');
    card.style.setProperty('--cy', (y*100).toFixed(1)+'%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateY(0)';
  });
});

// Timeline line draw on section enter
function triggerExpTimeline() {
  document.querySelector('.exp-grid')?.classList.add('tl-active');
}

// ── SKILL BALLS ──

// Inline SVG data URIs for icons that have no reliable brand CDN
const LOCK_SVG   = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E";
const SHIELD_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E";
const BRAIN_SVG  = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z'/%3E%3Cpath d='M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z'/%3E%3C/svg%3E";

const skillMeta = {
  // ── Languages ──
  'JavaScript':       { bg:'#c9a800', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  'TypeScript':       { bg:'#2a6db5', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  'Python':           { bg:'#2b5b8a', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  // ── Frontend ──
  'React.js':         { bg:'#1a3a4f', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  'Next.js':          { bg:'#333333', icon:'https://cdn.simpleicons.org/nextdotjs/ffffff' },
  'React Native':     { bg:'#0f2d45', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  'HTML5':            { bg:'#b83000', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  'CSS3':             { bg:'#0e5fa0', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  'Tailwind CSS':     { bg:'#0b7eb5', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  'Redux Toolkit':    { bg:'#5b2d90', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg' },
  // ── Backend ──
  'Node.js':          { bg:'#1a4a28', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  'Express.js':       { bg:'#2a2a2a', icon:'https://cdn.simpleicons.org/express/ffffff' },
  'FastAPI':          { bg:'#006b5e', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  'Socket.io':        { bg:'#282828', icon:'https://cdn.simpleicons.org/socketdotio/ffffff' },
  'REST APIs':        { bg:'#b84500', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
  // ── Databases ──
  'MongoDB':          { bg:'#0e4a35', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  'Mongoose':         { bg:'#6b0000', icon:'https://cdn.simpleicons.org/mongoose/ffffff' },
  'PostgreSQL':       { bg:'#214d7a', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  // ── AI & LLM ──
  'Groq API':         { bg:'#101828', icon:'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/groq.svg', invert:true },
  'OpenAI':           { bg:'#0a3d2e', icon:'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg', invert:true },
  'Gemini':           { bg:'#1a237e', icon:'https://cdn.simpleicons.org/googlegemini/ffffff' },
  'LangGraph':        { bg:'#1a3a5c', icon:'https://cdn.simpleicons.org/langchain/ffffff' },
  'LLM Integrations': { bg:'#2a1a0e', icon:BRAIN_SVG },
  // ── Auth & Security ──
  'JWT':              { bg:'#7b3f00', icon:'https://cdn.simpleicons.org/jsonwebtokens/ffffff' },
  'bcrypt':           { bg:'#1a3a2a', icon:LOCK_SVG },
  'RBAC':             { bg:'#1a1a3a', icon:SHIELD_SVG },
  // ── Tools & Platforms ──
  'Git':              { bg:'#8b2500', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  'GitHub':           { bg:'#1a1a1a', icon:'https://cdn.simpleicons.org/github/ffffff' },
  'Postman':          { bg:'#b84500', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
  'Vercel':           { bg:'#1a1a1a', icon:'https://cdn.simpleicons.org/vercel/ffffff' },
  'Cloudinary':       { bg:'#003b6e', icon:'https://cdn.simpleicons.org/cloudinary/ffffff' },
};

// Track per-group tick starters so we can launch them when Skills panel opens
const skillTickers = [];

document.querySelectorAll(".skill-group").forEach(card => {
  const chips = card.querySelectorAll(".skill-tags span");
  if (!chips.length) return;

  const wrap = document.createElement("div");
  wrap.className = "skill-bubble-wrap";
  card.appendChild(wrap);

  // Collect state for all balls so we can do soft collision avoidance
  const balls = [];

  chips.forEach((chip, i) => {
    const label = chip.dataset.label;
    if (!label) return;
    const m = skillMeta[label] || { bg:'rgba(255,255,255,.12)', icon:'' };

    const ball = document.createElement("div");
    ball.className = "skill-bubble-ball";
    ball.style.background = m.bg;
    ball.style.boxShadow  = `0 2px 12px ${m.bg}99`;

    const imgFilter = m.invert
      ? 'filter:invert(1) brightness(1.1);'
      : 'filter:brightness(1.05);';
    ball.innerHTML = [
      `<img src="${m.icon}" style="${imgFilter}" alt="${label}" draggable="false">`,
      `<span style="color:#fff;">${label}</span>`
    ].join('');

    wrap.appendChild(ball);

    // Spread initial positions across a grid so balls don't pile up
    const cols  = Math.ceil(Math.sqrt(chips.length));
    const nRows = Math.ceil(chips.length / cols);
    const col   = i % cols;
    const row   = Math.floor(i / cols);

    const angle = (i / chips.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
    const speed = 0.4 + Math.random() * 0.35;

    balls.push({
      el: ball,
      nx: (col + 0.5 + (Math.random() - 0.5) * 0.35) / cols,
      ny: (row + 0.5 + (Math.random() - 0.5) * 0.35) / nRows,
      x: 0, y: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      initialised: false,
    });
  });

  function tick() {
    const W    = wrap.offsetWidth;
    const H    = wrap.offsetHeight;
    const SIZE = ball_size();

    if (W < 10 || H < 10) {
      rafIds.push(requestAnimationFrame(tick));
      return;
    }

    const maxX = Math.max(0, W - SIZE);
    const maxY = Math.max(0, H - SIZE);
    const r    = SIZE / 2;

    // Resolve normalised positions on first real frame
    balls.forEach(b => {
      if (!b.initialised) {
        b.x = b.nx * maxX;
        b.y = b.ny * maxY;
        b.initialised = true;
      }
    });

    // Move + wall bounce
    balls.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x <= 0)    { b.x = 0;    b.vx =  Math.abs(b.vx); }
      if (b.x >= maxX) { b.x = maxX; b.vx = -Math.abs(b.vx); }
      if (b.y <= 0)    { b.y = 0;    b.vy =  Math.abs(b.vy); }
      if (b.y >= maxY) { b.y = maxY; b.vy = -Math.abs(b.vy); }
    });

    // Soft collision avoidance
    for (let a = 0; a < balls.length; a++) {
      for (let b = a + 1; b < balls.length; b++) {
        const ba = balls[a], bb = balls[b];
        const dx   = (ba.x + r) - (bb.x + r);
        const dy   = (ba.y + r) - (bb.y + r);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minD = SIZE * 0.9;
        if (dist < minD && dist > 0.01) {
          const push = (minD - dist) / dist * 0.3;
          ba.x += dx * push; ba.y += dy * push;
          bb.x -= dx * push; bb.y -= dy * push;
          ba.x = Math.min(Math.max(ba.x, 0), maxX);
          ba.y = Math.min(Math.max(ba.y, 0), maxY);
          bb.x = Math.min(Math.max(bb.x, 0), maxX);
          bb.y = Math.min(Math.max(bb.y, 0), maxY);
        }
      }
    }

    balls.forEach(b => {
      b.el.style.transform = `translate(${b.x}px,${b.y}px)`;
    });

    rafIds.push(requestAnimationFrame(tick));
  }

  // Register — will be started by triggerSkillBalls() when panel becomes visible
  skillTickers.push(tick);
});

function triggerSkillBalls() {
  // Cancel any leftover loops from a previous visit
  rafIds.forEach(id => cancelAnimationFrame(id));
  rafIds.length = 0;
  // Start a fresh tick loop for every card
  skillTickers.forEach(tick => {
    rafIds.push(requestAnimationFrame(tick));
  });
}

// Read CSS-driven ball size at runtime so JS stays in sync with responsive CSS
function ball_size() {
  const el = document.querySelector('.skill-bubble-ball');
  return el ? el.offsetWidth : 56;
}

window.addEventListener("load", () => {
  lucide.createIcons();
  gsap.fromTo(".site-header",
    { y: -30, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
  );
  setActive(0);
  showInitialPage();
});
