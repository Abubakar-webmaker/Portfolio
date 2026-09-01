gsap.registerPlugin(ScrollTrigger);

/*
  PAGE-TO-PAGE EXPERIENCE
  -----------------------
  The mouse wheel does NOT continuously scroll the document.
  One wheel gesture = one full-screen page transition.
  A black 2-second transition plays between pages.
*/

const panels = gsap.utils.toArray(".panel");
const navButtons = gsap.utils.toArray(".side-nav button");
const sweep1 = document.querySelector(".sweep-1");
const sweep2 = document.querySelector(".sweep-2");

let current = 0;
let isTransitioning = false;
let touchStartY = 0;
let touchStartX = 0;

document.body.classList.add("page-mode");

gsap.set(panels, { position: "absolute", inset: 0, autoAlpha: 0, y: 0 });
gsap.set(panels[0], { autoAlpha: 1 });

function setActive(index) {
  navButtons.forEach((button, i) => {
    button.classList.toggle("active", i === index);
  });
  // sync header nav
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
    if (img) {
      gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.35, delay: .05, ease: "power3.out" });
    }
  });
}

function goToPage(target, direction = target > current ? 1 : -1) {
  target = Math.max(0, Math.min(panels.length - 1, target));
  if (target === current || isTransitioning) return;

  isTransitioning = true;

  const outgoing = panels[current];
  const incoming = panels[target];

  // reset then trigger both sweeps
  sweep1.classList.remove("run");
  sweep2.classList.remove("run");
  void sweep1.offsetWidth;
  sweep1.classList.add("run");
  sweep2.classList.add("run");

  // swap pages at midpoint of sweep1 (0.2s)
  setTimeout(() => {
    gsap.set(outgoing, { autoAlpha: 0 });
    gsap.set(incoming, { autoAlpha: 1, y: 0 });
    current = target;
    setActive(current);
  }, 200);

  // done when sweep2 finishes (0.2 delay + 0.45s = 0.65s)
  setTimeout(() => {
    sweep1.classList.remove("run");
    sweep2.classList.remove("run");
    animatePageContent(incoming, direction);
    isTransitioning = false;
  }, 650);
}

function nextPage() {
  if (!isTransitioning) goToPage(current + 1, 1);
}

function previousPage() {
  if (!isTransitioning) goToPage(current - 1, -1);
}

// Mouse wheel: one gesture = one page.
window.addEventListener("wheel", (event) => {
  event.preventDefault();

  if (isTransitioning) return;

  if (Math.abs(event.deltaY) < 12) return;

  if (event.deltaY > 0) nextPage();
  else previousPage();
}, { passive: false });

// Keyboard navigation.
window.addEventListener("keydown", (event) => {
  if (["ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    nextPage();
  }

  if (["ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    previousPage();
  }

  if (event.key === "Home") {
    event.preventDefault();
    goToPage(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    goToPage(panels.length - 1);
  }
});

// Touch/swipe navigation.
window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0].clientY;
  touchStartX = event.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchend", (event) => {
  if (isTransitioning) return;

  const endY = event.changedTouches[0].clientY;
  const endX = event.changedTouches[0].clientX;
  const dy = touchStartY - endY;
  const dx = touchStartX - endX;

  if (Math.abs(dy) < 45 || Math.abs(dy) < Math.abs(dx)) return;

  if (dy > 0) nextPage();
  else previousPage();
}, { passive: true });

// Side + header navigation.
const allNavButtons = gsap.utils.toArray(".side-nav button, .header-nav button");
allNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    const index = panels.findIndex(p => p.id === target);
    if (index !== -1 && index !== current) goToPage(index, index > current ? 1 : -1);
  });
});

// Back to top.
document.querySelector(".back-top")?.addEventListener("click", () => {
  goToPage(0, -1);
});

window.addEventListener("load", () => {
  gsap.fromTo(".site-header",
    { y: -30, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
  );

  gsap.fromTo(".award",
    { x: 80 },
    { x: 0, duration: 1, delay: .2, ease: "power3.out" }
  );

  setActive(0);
  showInitialPage();
});
