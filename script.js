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
  if (outgoing.id === 'skills') rafIds.forEach(id => cancelAnimationFrame(id));
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
    card.style.animationDelay = `${i * 90}ms`;
    card.classList.add("card-visible");
  });
}

// 2. Magnetic 3D tilt
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-2px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(600px) rotateY(0) rotateX(0) translateY(0)";
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

// ── SKILL BALLS (flex grid) ──
const skillMeta = {
  'React.js':     { bg:'#20232a', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  'React Native': { bg:'#1a3a5c', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  'Next.js':      { bg:'#444444', icon:'https://cdn.simpleicons.org/nextdotjs/ffffff' },
  'TypeScript':   { bg:'#3178C6', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  'JavaScript':   { bg:'#F7DF1E', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  'Tailwind CSS': { bg:'#0ea5e9', icon:'https://cdn.simpleicons.org/tailwindcss/ffffff' },
  'Bootstrap':    { bg:'#7952B3', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
  'Framer Motion':{ bg:'#6644ff', icon:'https://cdn.simpleicons.org/framer/ffffff' },
  'MUI':          { bg:'#007FFF', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg' },
  'HTML':         { bg:'#E34F26', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  'CSS':          { bg:'#1572B6', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  'Node.js':      { bg:'#215732', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  'Express.js':   { bg:'#ffffff', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  'MongoDB':      { bg:'#116149', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  'Mongoose':     { bg:'#880000', icon:'https://cdn.simpleicons.org/mongoose/ffffff' },
  'PostgreSQL':   { bg:'#336791', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  'Socket.io':    { bg:'#444444', icon:'https://cdn.simpleicons.org/socketdotio/ffffff' },
  'FastAPI':      { bg:'#009688', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  'REST APIs':    { bg:'#FF6C37', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
  'Python':       { bg:'#3776AB', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  'Groq API':     { bg:'#1a1a2e', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  'LangGraph':    { bg:'#1C3C5A', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  'Git':          { bg:'#F05032', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  'GitHub':       { bg:'#444444', icon:'https://cdn.simpleicons.org/github/ffffff' },
  'Vercel':       { bg:'#444444', icon:'https://cdn.simpleicons.org/vercel/ffffff' },
  'AWS':          { bg:'#FF9900', icon:'https://cdn.simpleicons.org/amazonaws/ffffff' },
  'Docker':       { bg:'#2496ED', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  'Postman':      { bg:'#FF6C37', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
  'Claude':       { bg:'#c96442', icon:'https://cdn.simpleicons.org/anthropic/ffffff' },
  'Codex':        { bg:'#10a37f', icon:'https://cdn.simpleicons.org/openai/ffffff' },
};

document.querySelectorAll(".skill-group").forEach(card => {
  const chips = card.querySelectorAll(".skill-tags span");

  const wrap = document.createElement("div");
  wrap.className = "skill-bubble-wrap";
  card.appendChild(wrap);

  chips.forEach((chip, i) => {
    const label = chip.dataset.label;
    if (!label) return;
    const m = skillMeta[label] || { bg:'rgba(255,255,255,.15)', icon:'' };

    const ball = document.createElement("div");
    ball.className = "skill-bubble-ball";
    ball.style.cssText = `background:${m.bg};box-shadow:0 0 14px ${m.bg}88;`;
    const textColor = m.bg === '#ffffff' ? '#111' : '#fff';
    ball.innerHTML = `<img src="${m.icon}" style="width:36px;height:36px;object-fit:contain;" alt="${label}"><span style="font-family:var(--font-mono);font-size:7px;letter-spacing:.03em;color:${textColor};opacity:.9;text-align:center;line-height:1.2;padding:0 4px;word-break:break-word">${label}</span>`;
    wrap.appendChild(ball);

    const size = 72;
    const angle = (i / chips.length) * Math.PI * 2 + Math.random() * 0.5;
    const speed = 0.6 + Math.random() * 0.6;
    let x = 20 + (i % 4) * 80;
    let y = 20 + Math.floor(i / 4) * 80;
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    let rafId;
    (function animate() {
      const cw = wrap.offsetWidth  - size;
      const ch = wrap.offsetHeight - size;
      if (cw <= 0 || ch <= 0) { rafId = requestAnimationFrame(animate); rafIds.push(rafId); return; }
      x += vx; y += vy;
      if (x <= 0)  { x = 0;  vx =  Math.abs(vx); }
      if (x >= cw) { x = cw; vx = -Math.abs(vx); }
      if (y <= 0)  { y = 0;  vy =  Math.abs(vy); }
      if (y >= ch) { y = ch; vy = -Math.abs(vy); }
      ball.style.transform = `translate(${x}px,${y}px)`;
      rafId = requestAnimationFrame(animate);
    })();
    rafIds.push(rafId);
  });
});

window.addEventListener("load", () => {
  lucide.createIcons();
  gsap.fromTo(".site-header",
    { y: -30, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
  );
  setActive(0);
  showInitialPage();
});
