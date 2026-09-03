# M. Abubakar — Cinematic Portfolio

A full-screen cinematic portfolio built with vanilla HTML, CSS, and JavaScript. Features smooth page transitions, GSAP animations, a typewriter-driven journey section, animated skill bubbles, and a working contact form.

## Live

> Deploy on Vercel — drag & drop the folder. No build step needed.

## Run Locally

No build system required.

1. Clone or extract the folder.
2. Open `index.html` in a browser.

For hot reload in VS Code, use **Live Server**.

## Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 — custom properties, clamp(), grid, responsive |
| Scripting | Vanilla JavaScript (ES6+) |
| Animations | GSAP 3.13 + ScrollTrigger |
| Smooth scroll | Lenis 1.3.8 |
| Icons | Lucide 0.469.0 |
| Fonts | Plus Jakarta Sans · Inter · JetBrains Mono |

All libraries are **self-hosted** under `assets/js/` — no CDN dependency at runtime.

## Project Structure

```
Portfolio/
├── index.html          — all panels and content
├── style.css           — design system, layout, animations
├── script.js           — navigation, GSAP, typewriter, skill balls
├── assets/
│   ├── favicon.svg     — brand favicon
│   ├── images/
│   │   └── abubakar.png
│   └── js/             — self-hosted libraries
│       ├── gsap.min.js
│       ├── ScrollTrigger.min.js
│       ├── lenis.min.js
│       └── lucide.min.js
└── README.md
```

## Sections

| # | ID | Title |
|---|---|---|
| 01 | `home` | Hero — name, intro, CTA |
| 02 | `about` | About — bio, stats, experience |
| 03 | `skills` | Skills — animated floating skill balls |
| 04 | `work` | Projects — 6 project cards with 3D tilt |
| 05 | `experience` | Experience & Certifications |
| 06 | `contact` | Contact — info cards + working form |
| 07 | `safar` | The Journey — typewriter + animated timeline |

## Navigation

- **Mouse wheel** — scroll between sections
- **Arrow keys / Page Up / Page Down** — keyboard navigation
- **Touch swipe** — mobile swipe up/down
- **Header nav** — click any section name
- **Side nav** — numbered dots on the right edge

## Contact Form

The form collects Name, Email, and Message then opens the default mail client with a pre-filled `mailto:` — no backend or API key needed. Success message auto-dismisses after 4 seconds.

To change the recipient email, update `m.abubakar.codes@gmail.com` in `script.js` (contact form handler).

## Customisation

| What | Where |
|---|---|
| Your photo | `assets/images/abubakar.png` |
| Name / bio / links | `index.html` |
| Colors | `style.css` — `:root` CSS variables |
| Timeline milestones | `index.html` — `#safar` section |
| Typewriter lines | `script.js` — `safarLines` array |
| OG / social meta | `index.html` — `<head>` meta tags |
| Canonical URL | `index.html` — `og:url` meta tag |

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.
