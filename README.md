<div align="center">

# M. Abubakar — Cinematic Portfolio

**A full-screen, section-snapping cinematic portfolio built with vanilla HTML, CSS and JavaScript.**

Smooth page transitions · GSAP-powered animations · Typewriter journey · Floating skill bubbles · 3D-tilt project cards · Zero-backend contact form

[![Live Demo](https://img.shields.io/badge/Live-Demo-6C5CE7?style=for-the-badge&logo=vercel&logoColor=white)](https://your-portfolio.vercel.app)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-3.13-88CE02?style=flat-square&logo=greensock&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![License](https://img.shields.io/badge/License-Personal%20Use-blue?style=flat-square)

[Live Demo](https://your-portfolio.vercel.app) · [Report a Bug](https://github.com/YOUR_USERNAME/Portfolio/issues) · [Request a Feature](https://github.com/YOUR_USERNAME/Portfolio/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Sections](#sections)
- [Navigation](#navigation)
- [Contact Form](#contact-form)
- [Customisation](#customisation)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

This is the personal portfolio of **M. Abubakar**, a Full Stack Developer (MERN) based in Karachi, Pakistan. Instead of a conventional scrolling page, it is designed as a **cinematic, full-screen experience**: each section snaps into view with smooth transitions, and every interaction is animated with GSAP.

The project has **no runtime CDN dependencies** and **no backend**. All libraries are self-hosted, so it loads fast, works offline-friendly, and can be deployed to any static host in seconds.

---

## Screenshots

> Add your screenshots to `assets/images/screenshots/` and update the paths below.

| Hero | Skills |
|---|---|
| ![Hero](assets/images/screenshots/hero.png) | ![Skills](assets/images/screenshots/skills.png) |

| Projects | The Journey |
|---|---|
| ![Projects](assets/images/screenshots/projects.png) | ![Journey](assets/images/screenshots/journey.png) |

---

## Features

- **Section-snapping layout**: full-screen sections with cinematic transitions between them
- **GSAP + ScrollTrigger animations**: smooth, performant motion throughout
- **Lenis smooth scrolling**: buttery inertia-based scroll feel
- **Animated skill bubbles**: floating, interactive skill visualisation
- **3D-tilt project cards**: depth effect that responds to pointer movement
- **Typewriter-driven journey**: storytelling section with an animated timeline
- **Zero-backend contact form**: opens a pre-filled `mailto:` link, with no API keys or server
- **Multiple navigation methods**: wheel, keyboard, touch swipe, header links and side dots
- **Fully responsive**: fluid typography with `clamp()` and CSS Grid
- **Self-hosted libraries**: no CDN dependency at runtime
- **Linted codebase**: ESLint 9 flat config for consistent code quality

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3: custom properties, `clamp()`, Grid, fully responsive |
| Scripting | Vanilla JavaScript (ES6+ modules) |
| Animations | [GSAP](https://gsap.com/) 3.13 + ScrollTrigger |
| Smooth Scroll | [Lenis](https://lenis.darkroom.engineering/) 1.3.8 |
| Icons | [Lucide](https://lucide.dev/) 0.469.0 |
| Fonts | Plus Jakarta Sans · Inter · JetBrains Mono |
| Build Tool | [Vite](https://vitejs.dev/) 5 |
| Linter | [ESLint](https://eslint.org/) 9 |

> All runtime libraries are **self-hosted** under `assets/js/`, so there is no CDN dependency at runtime.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+** (only required for the dev server and build)
- A modern browser (see [Browser Support](#browser-support))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/Portfolio.git

# 2. Move into the project directory
cd Portfolio

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Run without Node

No tooling needed. Either open `index.html` directly in a browser, or use the **Live Server** extension in VS Code for hot reload.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on `script.js` |

---

## Project Structure

```
Portfolio/
├── index.html              # All sections and content
├── style.css               # Design system, layout, animations
├── script.js               # Navigation, GSAP, typewriter, skill balls
├── vite.config.js          # Vite build configuration
├── eslint.config.js        # ESLint flat config for script.js
├── package.json            # Scripts and dev dependencies
├── .gitignore
├── assets/
│   ├── favicon.svg         # Brand favicon
│   ├── images/
│   │   └── abubakar.png    # Profile photo
│   └── js/                 # Self-hosted libraries
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
| 01 | `home` | Hero | Name, intro tagline and call-to-action button |
| 02 | `about` | About | Bio, stats and years of experience |
| 03 | `skills` | Skills | Animated floating skill bubbles |
| 04 | `work` | Projects | Six project cards with a 3D tilt effect |
| 05 | `experience` | Experience & Certifications | Timeline of roles and certifications |
| 06 | `contact` | Contact | Info cards and a working `mailto:` form |
| 07 | `safar` | The Journey | Typewriter lines and an animated timeline |

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

The form collects **Name**, **Email** and **Message**, then opens the visitor's default mail client with a pre-filled `mailto:` link. No backend or API key is needed. The success message auto-dismisses after 4 seconds.

**Change the recipient:** replace `m.abubakar.codes@gmail.com` in `script.js` (contact form handler).

---

## Customisation

| What to change | Where |
|---|---|
| Profile photo | `assets/images/abubakar.png` |
| Name, bio, links | `index.html` |
| Colours / design tokens | `style.css` → `:root` CSS variables |
| Timeline milestones | `index.html` → `#safar` section |
| Typewriter lines | `script.js` → `safarLines` array |
| Recipient email | `script.js` → contact form handler |
| OG / social meta tags | `index.html` → `<head>` |
| Canonical URL | `index.html` → `og:url` meta tag |

---

## Deployment

The site is fully static, so it can be hosted anywhere.

### Vercel (recommended)

1. Push the repository to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Use these settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Alternatively, drag and drop the project folder into Vercel for a no-build static deploy.

### Netlify / GitHub Pages / Cloudflare Pages

Run `npm run build` and publish the generated `dist/` folder.

> After deploying, update the `og:url` and canonical URL in `index.html` to your live domain.

---

## Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## Troubleshooting

<details>
<summary><strong>Blank page when opening <code>index.html</code> directly</strong></summary>

If the project uses ES modules, some browsers block them over the `file://` protocol. Use `npm run dev` or the VS Code Live Server extension instead.
</details>

<details>
<summary><strong>Port 5173 is already in use</strong></summary>

Vite will automatically pick the next free port, or you can run `npm run dev -- --port 3000`.
</details>

<details>
<summary><strong>Contact form does not open my mail app</strong></summary>

The form relies on the `mailto:` protocol, so it needs a default mail client configured on the device. If none is set, the browser will do nothing.
</details>

<details>
<summary><strong>Animations feel laggy</strong></summary>

Check that hardware acceleration is enabled in your browser and that no heavy extensions are running. Using a production build (`npm run build && npm run preview`) is also noticeably smoother than the dev server.
</details>

---

## Roadmap

- [ ] Add a `prefers-reduced-motion` fallback for animations
- [ ] Add a dark/light theme toggle
- [ ] Add a downloadable résumé button
- [ ] Add a Lighthouse performance report badge
- [ ] Optional backend-powered contact form (e.g. serverless function)

---

## Contributing

This is a personal portfolio, but suggestions and bug reports are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please run `npm run lint` before submitting.

---

## License

This project is for **personal portfolio use**. Feel free to fork and adapt it with attribution.

---

## Author

**M. Abubakar** — Full Stack Developer (MERN)
📍 Karachi, Pakistan

[![Email](https://img.shields.io/badge/Email-m.abubakar.codes@gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:m.abubakar.codes@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-YOUR__USERNAME-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/YOUR_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_USERNAME)

<div align="center">

⭐ If you like this project, consider giving it a star!

</div>