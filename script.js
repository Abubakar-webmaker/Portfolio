/* global gsap, ScrollTrigger, lucide, emailjs, performance, getComputedStyle */
gsap.registerPlugin(ScrollTrigger);

const panels = gsap.utils.toArray(".panel");
const navButtons = gsap.utils.toArray(".side-nav button");
const sweep1 = document.querySelector(".sweep-1");
const sweep2 = document.querySelector(".sweep-2");
const progressBar = document.querySelector(".scroll-progress-bar");

let current = 0;
let isTransitioning = false;
let touchStartY = 0;
let touchStartX = 0;

// Track skill ball RAF ids so we can cancel when panel is hidden
const rafIds = [];

document.body.classList.add("page-mode");

gsap.set(panels, { position: "absolute", inset: 0, autoAlpha: 0, y: 0 });
gsap.set(panels[0], { autoAlpha: 1 });

// ── SCROLL PROGRESS BAR ─────────────────────────────────────────────────
// Update progress bar on scroll
ScrollTrigger.create({
  onUpdate: (self) => {
    if (progressBar) {
      gsap.to(progressBar, {
        width: self.getVelocity() === 0 ? self.progress * 100 + "%" : self.progress * 100 + "%",
        duration: 0.3,
        ease: "power2.out",
        overwrite: true
      });
    }
  }
});

// ── HERO SECTION PARALLAX ───────────────────────────────────────────────
// Initialize parallax effect for hero section background and foreground layers
function initHeroParallax() {
  // Check if prefers-reduced-motion is set
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroPanel = document.getElementById('home');
  if (!heroPanel) return;

  // Background shapes: slow parallax (0.4 scrub multiplier)
  // Creates depth illusion as background lags behind scroll
  ScrollTrigger.create({
    trigger: heroPanel,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.4,
    onUpdate: (self) => {
      const dist = self.progress * 60; // 60px total parallax travel
      heroPanel.style.setProperty('--parallax-y', `-${dist}px`);
    },
    markers: false
  });

  // Foreground text & image: faster parallax (0.8 scrub multiplier)
  // Moves more responsively to create layered depth effect
  const foregroundLayers = heroPanel.querySelectorAll('[data-parallax-layer="foreground"]');
  if (foregroundLayers.length > 0) {
    ScrollTrigger.create({
      trigger: heroPanel,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
      onUpdate: (self) => {
        const dist = self.progress * 35; // 35px total parallax travel
        foregroundLayers.forEach(layer => {
          gsap.set(layer, { y: dist, overwrite: 'auto' });
        });
      },
      markers: false
    });
  }
}

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
    if (incoming.id === 'work') {
      setTimeout(() => {
        if (window._cwEntrance) window._cwEntrance();
        if (window._initWorkPin) window._initWorkPin(); // Initialize pin when entering
        window.addEventListener('keydown', window._handleWorkKey);
      }, 200);
    }
    if (outgoing.id === 'work') {
      if (window._killPinTrigger) window._killPinTrigger(); // Kill pin when leaving
      window.removeEventListener('keydown', window._handleWorkKey);
    }
    if (incoming.id === 'experience') setTimeout(triggerExpTimeline, 400);
    if (incoming.id === 'skills') setTimeout(triggerSkillBalls, 100);
    isTransitioning = false;
  }, 650);
}

function nextPage() { if (!isTransitioning) goToPage(current + 1, 1); }
function previousPage() { if (!isTransitioning) goToPage(current - 1, -1); }

// ── UNIFIED WHEEL HANDLER ─────────────────────────────────────────────────
// One listener handles both page navigation AND work-card scrolling.
// Priority: work cards get all scroll while mid-strip; page nav only at edges.
let _wheelLock = false;

window.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (_wheelLock) return;
  if (Math.abs(event.deltaY) < 14) return;

  const onWork = panels[current]?.id === 'work';

  if (onWork && window._cwHandleWheel) {
    // Delegate to card carousel — it returns true if it consumed the scroll,
    // false if we're at an edge and should switch page instead
    const consumed = window._cwHandleWheel(event.deltaY > 0 ? 1 : -1);
    if (consumed) return;
  }

  // Either not on work panel, or at an edge — do page navigation
  if (isTransitioning) return;
  _wheelLock = true;
  setTimeout(() => { _wheelLock = false; }, 700);
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

  // Must be a predominantly vertical swipe to trigger page nav
  if (Math.abs(dy) < 45 || Math.abs(dy) < Math.abs(dx) * 1.3) return;

  // On the work panel, only page-navigate when at an edge
  if (panels[current]?.id === 'work') {
    const atEdge = !window._cwHandleWheel || window._cwHandleWheel(dy > 0 ? 1 : -1) === false;
    if (!atEdge) return;
  }

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
// ── EMAILJS CONFIG ────────────────────────────────────────────────────────
(function () {
  var _ejPublicKey  = 'iDvNtOOM-W2L7qaXr';
  var _ejServiceId  = 'service_889w2h9';
  var _ejTemplateId = 'template_tvbslyc';

  // ── Helpers ───────────────────────────────────────────────────────────
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function setFieldError(inputEl, show) {
    if (show) {
      inputEl.style.borderColor = 'rgba(255,75,66,.55)';
      inputEl.style.boxShadow   = '0 0 0 3px rgba(255,75,66,.08)';
    } else {
      inputEl.style.borderColor = '';
      inputEl.style.boxShadow   = '';
    }
  }

  function showFeedback(successEl, errorEl, errorTextEl, type, msg) {
    successEl.classList.remove('show');
    errorEl.classList.remove('show');
    if (type === 'success') {
      successEl.classList.add('show');
    } else {
      if (msg) errorTextEl.textContent = msg;
      errorEl.classList.add('show');
    }
    lucide.createIcons();
  }

  function hideFeedback(successEl, errorEl) {
    successEl.classList.remove('show');
    errorEl.classList.remove('show');
  }

  function setSending(submitBtn, sending) {
    var textEl  = submitBtn.querySelector('.cf-submit-text');
    var arrowEl = submitBtn.querySelector('.cf-submit-arrow');
    submitBtn.disabled = sending;
    if (sending) {
      textEl.textContent    = 'Sending…';
      arrowEl.style.opacity = '0';
    } else {
      textEl.textContent    = 'Send Message';
      arrowEl.style.opacity = '';
    }
  }

  function initEmailJS() {
    if (typeof emailjs === 'undefined') return false;
    emailjs.init({ publicKey: _ejPublicKey });
    return true;
  }

  // ── Form handler ──────────────────────────────────────────────────────
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameEl    = document.getElementById('cfName');
    var emailEl   = document.getElementById('cfEmail');
    var subjectEl = document.getElementById('cfSubject');
    var messageEl = document.getElementById('cfMessage');
    var submitBtn = form.querySelector('.cf-submit');
    var successEl = document.getElementById('cfSuccess');
    var errorEl   = document.getElementById('cfError');
    var errorText = document.getElementById('cfErrorText');

    var name    = nameEl.value.trim();
    var email   = emailEl.value.trim();
    var subject = subjectEl.value.trim();
    var message = messageEl.value.trim();

    // ── Validation ──────────────────────────────────────────────────────
    setFieldError(nameEl,    !name);
    setFieldError(emailEl,   !email || !isValidEmail(email));
    setFieldError(subjectEl, !subject);
    setFieldError(messageEl, !message);

    if (!name || !email || !subject || !message) {
      showFeedback(successEl, errorEl, errorText, 'error', 'Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      showFeedback(successEl, errorEl, errorText, 'error', 'Please enter a valid email address.');
      return;
    }

    // ── Guard: EmailJS must be loaded ─────────────────────────────────
    if (!initEmailJS()) {
      showFeedback(successEl, errorEl, errorText, 'error',
        'Email service unavailable. Please try again later.');
      return;
    }

    // ── Send ──────────────────────────────────────────────────────────
    hideFeedback(successEl, errorEl);
    setSending(submitBtn, true);

    emailjs.send(_ejServiceId, _ejTemplateId, {
      from_name:  name,
      from_email: email,
      subject:    subject,
      title:      subject,
      message:    message,
      reply_to:   email
    })
    .then(function () {
      setSending(submitBtn, false);
      showFeedback(successEl, errorEl, errorText, 'success');
      form.reset();
      [nameEl, emailEl, subjectEl, messageEl].forEach(function (el) {
        setFieldError(el, false);
      });
      setTimeout(function () {
        hideFeedback(successEl, errorEl);
        lucide.createIcons();
      }, 5000);
    })
    .catch(function (err) {
      setSending(submitBtn, false);
      // Log full error for debugging — no credentials are exposed here
      console.error('[EmailJS error]', err);
      var code   = err && err.status  ? ' (code ' + err.status + ')' : '';
      var detail = err && err.text    ? ': ' + err.text : '';
      showFeedback(successEl, errorEl, errorText, 'error',
        'Failed to send' + code + detail + '. Please email me directly.');
    });
  });

  // ── Clear field error on input ────────────────────────────────────────
  ['cfName', 'cfEmail', 'cfSubject', 'cfMessage'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { setFieldError(el, false); });
  });
})();

// ── CINEMATIC WORK CARDS ──────────────────────────────────────────────────

(function initCinematicWork() {
  const track    = document.getElementById('cwTrack');
  const dotsWrap = document.getElementById('cwDots');
  if (!track || !dotsWrap) return;

  const cards = Array.from(track.querySelectorAll('.cw-card'));
  const CARD_COUNT = cards.length;

  // ── Wire per-card CSS --accent variable ──────────────────────────────
  cards.forEach(card => {
    const accent = card.dataset.accent;
    if (accent) card.style.setProperty('--accent', accent);
  });

  // ── Build dot pagination ──────────────────────────────────────────────
  const dots = cards.map((card, i) => {
    const dot = document.createElement('button');
    dot.className = 'cw-dot';
    dot.setAttribute('aria-label', `Go to project ${i + 1}`);
    dotsWrap.appendChild(dot);
    dot.addEventListener('click', () => goToCard(i, true));
    return dot;
  });

  // ── State ─────────────────────────────────────────────────────────────
  let activeIndex   = 0;
  let currentOffset = 0;   // px offset applied to track

  // ── Measure helpers ───────────────────────────────────────────────────
  function cardWidth()  { return cards[0] ? cards[0].offsetWidth  : 300; }
  function gapWidth()   {
    // read computed gap from the flex track
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    return gap;
  }
  function trackWidth() { return track.parentElement ? track.parentElement.offsetWidth : window.innerWidth; }

  // Centre-offset so the active card sits in the middle of the viewport
  function targetOffset(index) {
    const cw = cardWidth() + gapWidth();
    const containerCentre = trackWidth() / 2;
    const cardCentre      = index * cw + cardWidth() / 2;
    return containerCentre - cardCentre;
  }

  // ── 3D transforms for each card based on distance from active ─────────
  function applyCardTransforms(offset, animate) {
    const cw = cardWidth() + gapWidth();

    cards.forEach((card, i) => {
      const cardCentreX  = i * cw + cardWidth() / 2 + offset;
      const viewCentreX  = trackWidth() / 2;
      const dist         = cardCentreX - viewCentreX;          // px from centre
      const normDist     = dist / (trackWidth() * 0.55);       // –1 … 1 roughly

      // Clamp
      const nd = Math.max(-1.4, Math.min(1.4, normDist));

      const rotY   =  nd * 18;        // ±18° rotation around Y
      const rotX   = -Math.abs(nd) * 3; // subtle tilt inward
      const scale  =  1 - Math.abs(nd) * 0.12;
      const tz     = -Math.abs(nd) * 60; // push far cards back
      const op     =  1 - Math.abs(nd) * 0.45;

      const isActive = i === activeIndex;
      if (isActive) card.classList.add('cw-active');
      else          card.classList.remove('cw-active');

      const transform = `perspective(1400px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${tz}px) scale(${scale})`;

      if (animate) {
        gsap.to(card, {
          transform,
          opacity: Math.max(0.25, op),
          duration: 0.65,
          ease: 'power3.out',
          overwrite: true,
        });
      } else {
        gsap.set(card, { transform, opacity: Math.max(0.25, op) });
      }
    });
  }

  // ── Move track + update dots ──────────────────────────────────────────
  let goToCard = function(index, animated = true) {
    activeIndex = Math.max(0, Math.min(CARD_COUNT - 1, index));
    currentOffset = targetOffset(activeIndex);

    if (animated) {
      gsap.to(track, {
        x: currentOffset,
        duration: 0.72,
        ease: 'power3.inOut',
        onUpdate: () => applyCardTransforms(gsap.getProperty(track, 'x'), false),
      });
    } else {
      gsap.set(track, { x: currentOffset });
      applyCardTransforms(currentOffset, false);
    }

    // update dots
    const accent = cards[activeIndex]?.dataset.accent || '#fff';
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
      if (i === activeIndex) dot.style.setProperty('--cw-dot-accent', accent);
    });
    dotsWrap.style.setProperty('--cw-dot-accent', accent);
  }

  // ── Entrance animation (called when work panel becomes visible) ────────
  function cwEntrance() {
    // Reset to card 0 without animation first
    activeIndex   = 0;
    currentOffset = targetOffset(0);

    // Set all cards to initial state
    cards.forEach((card, i) => {
      gsap.set(card, {
        x: 0,
        opacity: 0,
        transform: `perspective(1400px) rotateY(${i === 0 ? 0 : 22}deg) rotateX(-4deg) scale(.88) translateZ(-80px)`,
      });
    });
    gsap.set(track, { x: currentOffset });

    // Stagger reveal each card
    cards.forEach((card, i) => {
      gsap.to(card, {
        opacity: i === 0 ? 1 : 0.45,
        duration: 0.6,
        delay: i * 0.09 + 0.15,
        ease: 'power3.out',
        onComplete: () => {
          if (i === CARD_COUNT - 1) {
            // Once all cards are in, apply proper 3D layout
            applyCardTransforms(currentOffset, true);
            goToCard(0, true);
          }
        }
      });
    });
  }

  // ── Wheel handler — returns true if consumed, false if at edge ──────────
  let wheelCooldown = false;
  function cwHandleWheel(dir) {
    // dir: +1 = scroll down/forward, -1 = scroll up/backward
    const atStart = activeIndex === 0;
    const atEnd   = activeIndex === CARD_COUNT - 1;

    if (dir > 0 && !atEnd) {
      // Still have cards ahead — consume and advance
      if (!wheelCooldown) {
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 520);
        goToCard(activeIndex + 1);
      }
      return true; // consumed
    }
    if (dir < 0 && !atStart) {
      // Still have cards behind — consume and go back
      if (!wheelCooldown) {
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 520);
        goToCard(activeIndex - 1);
      }
      return true; // consumed
    }
    // At an edge — tell the page handler to navigate
    return false;
  }

  function handleWorkKey(e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); goToCard(activeIndex + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goToCard(activeIndex - 1); }
  }

  // ── Drag to scroll ────────────────────────────────────────────────────
  let dragStart      = null;
  let dragBaseOffset = 0;
  let isDragging     = false;

  track.addEventListener('mousedown', e => {
    // Don't steal clicks on links
    if (e.target.closest('a')) return;
    dragStart      = e.clientX;
    dragBaseOffset = currentOffset;
    isDragging     = false;
    track.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', e => {
    if (dragStart === null) return;
    const delta = e.clientX - dragStart;
    if (Math.abs(delta) > 6) isDragging = true;
    if (!isDragging) return;
    currentOffset = dragBaseOffset + delta;
    gsap.set(track, { x: currentOffset });
    applyCardTransforms(currentOffset, false);
  });

  window.addEventListener('mouseup', () => {
    if (dragStart === null) return;
    track.classList.remove('is-dragging');
    dragStart = null;

    if (!isDragging) return; // was a click, not a drag

    // Snap to nearest card
    const cw = cardWidth() + gapWidth();
    const viewCentre = trackWidth() / 2;
    // Find card whose centre is closest to viewport centre
    let best = 0, bestDist = Infinity;
    cards.forEach((_, i) => {
      const cx   = i * cw + cardWidth() / 2 + currentOffset;
      const dist = Math.abs(cx - viewCentre);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    goToCard(best, true);
  });

  // ── Touch support ──────────────────────────────────────────────────────
  let touchStartX   = 0;
  let touchBaseOff  = 0;
  let isTouchDrag   = false;

  track.addEventListener('touchstart', e => {
    touchStartX  = e.touches[0].clientX;
    touchBaseOff = currentOffset;
    isTouchDrag  = false;
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    const delta = e.touches[0].clientX - touchStartX;
    if (Math.abs(delta) > 8) isTouchDrag = true;
    if (!isTouchDrag) return;
    currentOffset = touchBaseOff + delta;
    gsap.set(track, { x: currentOffset });
    applyCardTransforms(currentOffset, false);
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isTouchDrag) return;
    const cw = cardWidth() + gapWidth();
    const viewCentre = trackWidth() / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((_, i) => {
      const cx   = i * cw + cardWidth() / 2 + currentOffset;
      const dist = Math.abs(cx - viewCentre);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    goToCard(best, true);
  }, { passive: true });

  // ── Keyboard arrows when work panel is active ─────────────────────────
  function handleWorkKey(e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); goToCard(activeIndex + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goToCard(activeIndex - 1); }
  }

  // ── Mouse tilt on hover — clean absolute override, no additive drift ──
  // Store the base transform string per card so we can layer tilt on top cleanly
  const cardBaseTransform = new WeakMap();

  function setCardBaseTransform(card, transformStr) {
    cardBaseTransform.set(card, transformStr);
  }

  // Patch applyCardTransforms to also cache the base transform
  const _origApply = applyCardTransforms;
  // We need to intercept after gsap sets the transform — use a thin wrapper
  function applyCardTransformsAndCache(offset, animate) {
    const cw = cardWidth() + gapWidth();
    cards.forEach((card, i) => {
      const cardCentreX = i * cw + cardWidth() / 2 + offset;
      const viewCentreX = trackWidth() / 2;
      const dist        = cardCentreX - viewCentreX;
      const nd          = Math.max(-1.4, Math.min(1.4, dist / (trackWidth() * 0.55)));
      const rotY  =  nd * 18;
      const rotX  = -Math.abs(nd) * 3;
      const scale =  1 - Math.abs(nd) * 0.12;
      const tz    = -Math.abs(nd) * 60;
      const tfStr = `perspective(1400px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${tz}px) scale(${scale})`;
      setCardBaseTransform(card, tfStr);
    });
    _origApply(offset, animate);
  }

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      if (isDragging) return;
      const r  = card.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width  - 0.5; // –0.5 … 0.5
      const my = (e.clientY - r.top)  / r.height - 0.5;
      card.style.setProperty('--mx', (mx * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (my * 100).toFixed(1) + '%');

      // Parse base rotY/rotX from stored string, add micro-tilt
      const base = cardBaseTransform.get(card) || '';
      const rY = parseFloat((base.match(/rotateY\(([-\d.]+)deg\)/) || [0,0])[1]);
      const rX = parseFloat((base.match(/rotateX\(([-\d.]+)deg\)/) || [0,0])[1]);
      const sc = parseFloat((base.match(/scale\(([-\d.]+)\)/)       || [0,1])[1]);
      const tz = parseFloat((base.match(/translateZ\(([-\d.]+)px\)/)|| [0,0])[1]);

      const tiltedTransform = `perspective(1400px) rotateY(${(rY + mx * 6).toFixed(2)}deg) rotateX(${(rX + -my * 6).toFixed(2)}deg) translateZ(${tz}px) scale(${sc})`;
      gsap.to(card, {
        transform: tiltedTransform,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true,
      });
    });

    card.addEventListener('mouseleave', () => {
      // Return exactly to base 3D position — no drift
      applyCardTransformsAndCache(currentOffset, true);
    });
  });

  // Replace bare reference with the caching version going forward
  // (goToCard and cwEntrance still call applyCardTransforms directly,
  //  so wrap those calls too by monkey-patching the closure reference)
  // Simplest: just call applyCardTransformsAndCache where needed below
  // We already call applyCardTransforms in goToCard onUpdate — patch it:
  function goToCardPatched(index, animated = true) {
    activeIndex = Math.max(0, Math.min(CARD_COUNT - 1, index));
    currentOffset = targetOffset(activeIndex);
    // Update edge flag for the page wheel handler
    window._workAtEdge = (activeIndex === 0 || activeIndex === CARD_COUNT - 1);

    if (animated) {
      gsap.to(track, {
        x: currentOffset,
        duration: 0.72,
        ease: 'power3.inOut',
        onUpdate: () => applyCardTransformsAndCache(gsap.getProperty(track, 'x'), false),
        onComplete: () => applyCardTransformsAndCache(currentOffset, false),
      });
    } else {
      gsap.set(track, { x: currentOffset });
      applyCardTransformsAndCache(currentOffset, false);
    }

    const accent = cards[activeIndex]?.dataset.accent || '#fff';
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
      if (i === activeIndex) dot.style.setProperty('--cw-dot-accent', accent);
    });
    dotsWrap.style.setProperty('--cw-dot-accent', accent);
  }

  // Override the original goToCard with the patched version
  goToCard = goToCardPatched;

  // ── Recalculate on resize ──────────────────────────────────────────────
  let resizeTimer;
  let pinTrigger = null;

  function killPinTrigger() {
    if (pinTrigger) {
      pinTrigger.kill();
      pinTrigger = null;
    }
  }

  function initWorkPin() {
    // Kill any existing pin trigger
    killPinTrigger();

    // Only pin on desktop (viewport >= 768px)
    if (window.innerWidth < 768) {
      return; // mobile: skip pinning
    }

    // Check if prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // skip pinning if user prefers reduced motion
    }

    const cards = Array.from(cwTrack.querySelectorAll('.cw-card'));
    if (cards.length === 0) return;

    const cardW = cardWidth();
    const gapW = gapWidth();
    const totalCards = cards.length;

    // Calculate total scroll distance needed
    // Total track width: cards + gaps
    const totalTrackWidth = totalCards * cardW + (totalCards - 1) * gapW;
    const viewportW = trackWidth();

    // Maximum offset we can scroll: from showing card 0 centered to showing last card centered
    const maxOffset = totalTrackWidth - viewportW;

    // Create pin trigger
    // The trigger element is the work panel
    // We pin it and create a long scroll distance to animate through all cards
    pinTrigger = ScrollTrigger.create({
      trigger: '#work',
      pin: true,
      start: 'top top',
      end: `+=${maxOffset + 600}px`,
      scrub: 0.8, // REDUCED from 1 for better responsiveness
      fastScrollEnd: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const offset = -progress * maxOffset;
        gsap.set(track, { x: offset, overwrite: false }); // false for batch updates
        applyCardTransformsAndCache(offset, false);
      },
      markers: false,
      onEnter: () => {
        activeIndex = 0;
        currentOffset = targetOffset(0);
      }
    });
  }

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Reinitialize pin on resize
      initWorkPin();
      
      // Also reset card position
      currentOffset = targetOffset(activeIndex);
      gsap.set(track, { x: currentOffset });
      applyCardTransforms(currentOffset, false);
    }, 200);
  });

  // ── Expose to page-level handlers ───────────────────────────────────────
  window._cwEntrance      = cwEntrance;
  window._cwHandleWheel   = cwHandleWheel;
  window._handleWorkKey   = handleWorkKey;
  window._initWorkPin     = initWorkPin;
  window._killPinTrigger  = killPinTrigger;
})();

// ── Initialize work pin after cinematic work setup ────────────────────────
// Also refresh ScrollTrigger after page load to ensure all measurements are correct
setTimeout(() => {
  if (window._initWorkPin) window._initWorkPin();
  ScrollTrigger.refresh(); // Refresh all triggers after initial setup
}, 50);

// ── HERO CURSOR GLOW (SPOTLIGHT EFFECT) ─────────────────────────────────
function initHeroCursorGlow() {
  const heroPanel = document.getElementById('home');
  if (!heroPanel) return;

  // Check if prefers-reduced-motion or mobile
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) return;

  // Create glow overlay if doesn't exist
  let glowOverlay = heroPanel.querySelector('.hero-glow-overlay');
  if (!glowOverlay) {
    glowOverlay = document.createElement('div');
    glowOverlay.className = 'hero-glow-overlay';
    heroPanel.insertBefore(glowOverlay, heroPanel.firstChild);
  }

  // Use requestIdleCallback for glow updates (not blocking interactions)
  let pendingGlow = null;
  let lastX = null, lastY = null;

  heroPanel.addEventListener('mousemove', (e) => {
    const rect = heroPanel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Skip if barely moved (reduce thrashing)
    if (lastX !== null && Math.abs(x - lastX) < 5 && Math.abs(y - lastY) < 5) return;

    lastX = x;
    lastY = y;

    // Cancel previous idle callback if pending
    if (pendingGlow) cancelIdleCallback(pendingGlow);

    // Defer glow update using requestIdleCallback (lower priority)
    pendingGlow = requestIdleCallback(() => {
      heroPanel.style.setProperty('--glow-x', x + 'px');
      heroPanel.style.setProperty('--glow-y', y + 'px');
      pendingGlow = null;
    }, { timeout: 100 }); // fallback to 100ms if no idle time
  }, { passive: true });

  heroPanel.addEventListener('mouseleave', () => {
    glowOverlay.style.opacity = '0';
    if (pendingGlow) cancelIdleCallback(pendingGlow);
  }, { passive: true });

  heroPanel.addEventListener('mouseenter', () => {
    glowOverlay.style.opacity = '1';
  }, { passive: true });
}

// ── SKILLS SECTION BENTO GRID ENTRANCE ──────────────────────────────────
function initSkillCardEntrance() {
  const skillCards = document.querySelectorAll('.skill-group');
  if (skillCards.length === 0) return;

  // Check if prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    skillCards.forEach(card => gsap.set(card, { opacity: 1, y: 0, scale: 1 }));
    return;
  }

  // Stagger entrance animation
  skillCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: i * 0.06, ease: 'power3.out' }
    );
  });
}

// ── ANIMATED NOISE CANVAS BACKGROUND ────────────────────────────────────
class NoiseBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.imageData = null;
    this.data = null;
    this.time = 0;
    this.speed = 0.008; // REDUCED from 0.02 for better performance
    this.scale = 100; // INCREASED from 80 (less detail = faster)
    this.animationFrameId = null;
    this.updateCount = 0;

    // Check if should disable on mobile/low-end
    const isMobile = window.innerWidth < 768;
    const isLowEnd = window.devicePixelRatio > 2;
    
    if (!isMobile && !isLowEnd) {
      this.init();
    }
  }

  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'noise-bg-canvas';
    document.body.insertBefore(this.canvas, document.body.firstChild);

    this.ctx = this.canvas.getContext('2d', { alpha: false, willReadFrequently: false });
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    this.data = this.imageData.data;

    window.addEventListener('resize', () => this.resize());

    // Check if prefers-reduced-motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.animate();
    }
  }

  perlinNoise(x, y, z) {
    // Simplified hash-based noise (faster version)
    const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
    return n - Math.floor(n);
  }

  generateNoise(time) {
    if (!this.canvas || !this.data) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const scale = this.scale;

    // OPTIMIZED: Skip every other pixel on slower devices
    const step = window.devicePixelRatio > 1.5 ? 2 : 1;

    for (let i = 0; i < w * h; i += step) {
      const x = (i % w) / scale;
      const y = Math.floor(i / w) / scale;

      // Simplified: use only 2 octaves instead of 3
      let noise = 0;
      noise += this.perlinNoise(x, y, time) * 0.6;
      noise += this.perlinNoise(x * 2, y * 2, time * 0.7) * 0.4;

      // Dark gray with subtle tint
      const val = Math.floor(noise * 255);
      const baseColor = Math.floor(15 + val * 0.08);

      const idx = i * 4;
      this.data[idx] = baseColor;
      this.data[idx + 1] = baseColor;
      this.data[idx + 2] = baseColor;
      this.data[idx + 3] = 255;
    }

    this.ctx.putImageData(this.imageData, 0, 0);
  }

  animate = () => {
    // Skip frames on low-end devices
    this.updateCount++;
    if (this.updateCount % 2 === 0) { // Every other frame on low-end
      this.time += this.speed;
      this.generateNoise(this.time);
    }
    
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    this.data = this.imageData.data;
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

// Initialize noise background
const noiseBg = new NoiseBackground();

// ── SCROLLTRIGGER MANAGEMENT & ACCESSIBILITY ────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobileViewport = window.innerWidth < 768;

// Debounce resize to avoid rapid refresh spam
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Only refresh on major breakpoint changes (not every pixel)
    const currentMobile = window.innerWidth < 768;
    if (currentMobile !== isMobileViewport) {
      // Refresh only if breakpoint changed
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger !== '#home') { 
          trigger.kill();
        }
      });
      
      if (window._initWorkPin) window._initWorkPin();
      ScrollTrigger.refresh();
    }
  }, 500); // Wait 500ms after resize stops
});

// Listen for orientation change
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 300);
}, { passive: true });

// Initialize all features at page load
window.addEventListener('load', () => {
  // Defer non-critical initialization to next frame
  requestAnimationFrame(() => {
    initHeroCursorGlow();
    initSkillCardEntrance();
    
    // Disable heavy animations on mobile
    if (isMobileViewport) {
      if (noiseBg) noiseBg.speed = 0.004;
    }
  });
}, { passive: true });

// ── EXPERIENCE EFFECTS ──

// Mouse-follow glow on experience panel
const expPanel = document.getElementById('experience');
if (expPanel) {
  expPanel.addEventListener('mousemove', e => {
    const r = expPanel.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    expPanel.style.setProperty('--mx', x + '%');
    expPanel.style.setProperty('--my', y + '%');
  });
}

// 3D tilt on new exp-item-cards
document.querySelectorAll('.exp-item-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    card.style.transform = `perspective(800px) rotateY(${(x-.5)*6}deg) rotateX(${-(y-.5)*6}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Animated stat counter
function animateStats() {
  document.querySelectorAll('.exp-stat-num[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      // ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      const val = target * ease;
      el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// Timeline entry animation (called when Experience panel becomes visible)
function triggerExpTimeline() {
  animateStats();
  // Stagger exp-items with a slight scale + fade entrance
  document.querySelectorAll('.exp-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 30, scale: .96 },
      { opacity: 1, y: 0, scale: 1, duration: .7, delay: i * .12 + .1, ease: 'power3.out' }
    );
  });
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
  
  // Add skill card entrance animation (bento grid enhancement)
  initSkillCardEntrance();
  
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

// ── MOBILE NAV (#3 fix) ───────────────────────────────────────────────────
(function initMobileNav() {
  const menuBtn  = document.querySelector('.menu-btn');
  const nav      = document.getElementById('mobile-nav');
  if (!menuBtn || !nav) return;

  // Create scrim overlay
  const scrim = document.createElement('div');
  scrim.className = 'mobile-nav-scrim';
  document.body.appendChild(scrim);

  function openNav() {
    nav.removeAttribute('hidden');
    nav.classList.add('is-open');
    scrim.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close navigation');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    nav.classList.remove('is-open');
    scrim.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflow = '';
    // Wait for transition before hiding
    setTimeout(() => {
      if (!nav.classList.contains('is-open')) nav.setAttribute('hidden', '');
    }, 420);
  }

  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  document.querySelector('.mobile-nav-close')?.addEventListener('click', closeNav);
  scrim.addEventListener('click', closeNav);

  // Wire mobile nav links
  nav.querySelectorAll('.mobile-nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = panels.findIndex(p => p.id === btn.dataset.target);
      closeNav();
      if (index !== -1) setTimeout(() => goToPage(index, index > current ? 1 : -1), 160);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
  });
})();

window.addEventListener("load", () => {
  lucide.createIcons();
  gsap.fromTo(".site-header",
    { y: -30, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
  );
  setActive(0);
  showInitialPage();
  initHeroParallax();
});
