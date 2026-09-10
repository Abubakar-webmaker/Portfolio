# M. Abubakar — Cinematic Portfolio

A full-screen, section-snapping cinematic portfolio built with vanilla HTML, CSS, and JavaScript. Features smooth page transitions, GSAP-powered animations, a typewriter-driven journey section, animated floating skill bubbles, 3D-tilt project cards, and a zero-backend contact form.

---

## Live Demo

Deploy instantly on **Vercel** — drag & drop the folder or connect the repo. No build step required for static hosting.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ (only needed for the dev server / build)
- A modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Run with Vite (recommended)

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Run without Node

Open `index.html` directly in a browser, or use the **Live Server** extension in VS Code for hot reload.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on `script.js` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 — custom properties, `clamp()`, Grid, fully responsive |
| Scripting | Vanilla JavaScript (ES6+ modules) |
| Animations | GSAP 3.13 + ScrollTrigger |
| Smooth Scroll | Lenis 1.3.8 |
| Icons | Lucide 0.469.0 |
| Fonts | Plus Jakarta Sans · Inter · JetBrains Mono |
| Build Tool | Vite 5 |
| Linter | ESLint 9 |

All runtime libraries are **self-hosted** under `assets/js/` — no CDN dependency at runtime.

---

## Project Structure

```
Portfolio/
├── index.html              — all sections and content
├── style.css               — design system, layout, animations
├── script.js               — navigation, GSAP, typewriter, skill balls
├── vite.config.js          — Vite build configuration
├── eslint.config.js        — ESLint flat config for script.js
├── package.json            — scripts and dev dependencies
├── .gitignore
├── assets/
│   ├── favicon.svg         — brand favicon
│   ├── images/
│   │   └── abubakar.png    — profile photo
│   └── js/                 — self-hosted libraries
│       ├── gsap.min.js
│       ├── ScrollTrigger.min.js
│       ├── lenis.min.js
│       └── lucide.min.js
└── README.md
```

---

## Sections

| # | ID | Title | Description |
|---|---|---|---|
| 01 | `home` | Hero | Name, intro tagline, CTA button |
| 02 | `about` | About | Bio, stats, years of experience |
| 03 | `skills` | Skills | Animated floating skill bubbles |
| 04 | `work` | Projects | 6 project cards with 3D tilt effect |
| 05 | `experience` | Experience & Certifications | Timeline of roles and certs |
| 06 | `contact` | Contact | Info cards + working mailto form |
| 07 | `safar` | The Journey | Typewriter lines + animated timeline |

---

## Navigation

| Method | Action |
|---|---|
| Mouse wheel | Scroll between sections |
| `↑` `↓` / `Page Up` / `Page Down` | Keyboard navigation |
| Touch swipe up/down | Mobile navigation |
| Header nav links | Jump to any section |
| Side nav dots | Numbered dots on the right edge |

---

## Contact Form

The form collects **Name**, **Email**, and **Message**, then opens the default mail client with a pre-filled `mailto:` — no backend or API key needed. The success message auto-dismisses after 4 seconds.

To change the recipient email, update `m.abubakar.codes@gmail.com` in `script.js` (contact form handler).

---

## Customisation

| What to change | Where |
|---|---|
| Profile photo | `assets/images/abubakar.png` |
| Name, bio, links | `index.html` |
| Colors / design tokens | `style.css` → `:root` CSS variables |
| Timeline milestones | `index.html` → `#safar` section |
| Typewriter lines | `script.js` → `safarLines` array |
| Recipient email | `script.js` → contact form handler |
| OG / social meta tags | `index.html` → `<head>` |
| Canonical URL | `index.html` → `og:url` meta tag |

---

## Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## License

This project is for personal portfolio use. Feel free to fork and adapt with attribution.
