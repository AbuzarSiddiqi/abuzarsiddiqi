# Abuzar Siddiqi -- Portfolio

A single-page developer portfolio built with vanilla HTML, CSS, and JavaScript. Features glassmorphism design, interactive canvas effects, dual theme support, and live project previews.

**Live:** [abuzarsiddiqi.github.io/abuzarsiddiqi](https://abuzarsiddiqi.github.io/abuzarsiddiqi)

---

## Preview

| Light Mode                                  | Dark Mode                       |
| ------------------------------------------- | ------------------------------- |
| Teal/coral glassmorphism with frosted cards | Cyan/amber with deep blue tones |

---

## Features

### Interactive Hero Portrait

- **3D tilt tracking** -- portrait rotates on mouse movement with dynamic shadow shifts
- **Brush stroke reveal** -- canvas-based painting effect reveals a second image underneath using organic brush strokes with bristle texture
- **Floating app icons** -- logos orbit the portrait in a semicircular arc with staggered pop-in and bobbing animations

### Animated Day/Night Theme

- Custom sun/moon toggle with clouds and stars SVG
- **View Transition API** circular reveal animation expanding from the toggle
- Persisted via `localStorage`; respects `prefers-reduced-motion`

### Dual Image Carousels

- Side-by-side KwikCut Expo and Carousel galleries
- Autoplay (4s interval), dot navigation, prev/next buttons, and pointer-drag swipe
- Square frames with `object-fit: contain` for portrait images and `cover` for landscape

### Live App Previews

- Clicking a KwikVerse app card opens a **draggable iPhone mockup** with the site loaded in an iframe
- PDF documents open in a **draggable desktop viewer** (960px+ screens)
- Both modals are viewport-constrained and keyboard-dismissible (Escape)

### Scroll Interactions

- Intersection Observer-driven **reveal animations** (fade + slide-up)
- Active nav link highlighting based on visible section
- Sticky header with shadow on scroll

### Project Filtering

- Tag-based filter buttons (All / iOS / Web / AI) to show/hide project cards

### Contact Form

- Client-side validation with `mailto:` link generation
- Copy-to-clipboard buttons for email and phone (Clipboard API with fallback)

---

## Tech Stack

| Layer         | Technologies                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Markup**    | Semantic HTML5, ARIA labels                                                                                                           |
| **Styling**   | Vanilla CSS with custom properties, glassmorphism, CSS Grid, Flexbox, `clamp()` fluid typography                                      |
| **Scripting** | Vanilla JavaScript (ES5-compatible IIFEs), Canvas 2D API, View Transition API, Intersection Observer, Pointer Events                  |
| **Fonts**     | [Outfit](https://fonts.google.com/specimen/Outfit) (body), [Syne](https://fonts.google.com/specimen/Syne) (headings) via Google Fonts |
| **Hosting**   | GitHub Pages                                                                                                                          |

No frameworks, build tools, or dependencies.

---

## Project Structure

```
.
├── index.html              # Single-page markup
├── styles.css              # All styles (~2200 lines)
├── script.js               # All interactions (~890 lines)
├── README.md
├── ABUZARSIDDIQI.pdf       # Downloadable resume
├── Files/
│   ├── LOGOS/              # App logos (KwikLyze, KwikCut, KwikPDF, etc.)
│   ├── blazer.png          # Portrait base image
│   └── hoodie.png          # Portrait reveal image
└── KwikCut Data/
    ├── Expo_1.png          # Expo carousel images
    ├── Expo_2.png
    ├── Expo3.png
    ├── Kwikcut carousel/   # Journey carousel images (IMG1-5)
    ├── app_ui.png          # App UI screenshots
    ├── app_ui2.png
    ├── app_ui3.png
    ├── startup_headOffice.jpeg
    ├── KwikCut Logo and tagline poster.png
    ├── Kwikcut_Business Model.pdf
    ├── ResearchKwickcut.pdf
    └── short ppt.pdf
```

---

## Sections

| Section        | Description                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| **Hero**       | Name, tagline, interactive portrait, professional metrics, CTA buttons                                    |
| **Summary**    | Brief professional overview                                                                               |
| **Experience** | KwikCut founder role, achievements, tech stack, case study, office photos, app UI gallery, expo carousels |
| **Projects**   | KwikLyze AI assistant spotlight, KwikVerse suite (KwikCut, KwikPDF, KwikWall, KwikFry, KwikMusic)         |
| **Skills**     | Languages, frameworks, AI/ML, databases, core CS, certifications                                          |
| **Contact**    | Form, email, phone, LinkedIn, GitHub                                                                      |

---

## Showcased Projects

### KwikCut

Salon booking platform (VIT-TBI pre-incubated startup). iOS app + web dashboard + Firebase backend. Led development and mentored a team of 4 interns.

### KwikLyze

Local-first AI voice assistant with ~200ms latency. Pipeline: Vosk wake word -> Whisper STT -> Qwen 2.5 LLM -> system automation. Built with Electron + Python + React.

### KwikVerse Suite

Five live web products -- KwikPDF, KwikWall, KwikFry, KwikMusic -- each accessible via interactive iPhone preview cards.

---

## Design System

**Colors**

| Token      | Light             | Dark              |
| ---------- | ----------------- | ----------------- |
| Primary    | `#0c7a92` (teal)  | `#62d3eb` (cyan)  |
| Accent     | `#ff8f5c` (coral) | `#ffb07b` (amber) |
| Background | `#eef3f5`         | `#0b151a`         |
| Text       | `#102129`         | `#ebf2f5`         |

**Responsive Breakpoints**

| Breakpoint     | Layout                                                    |
| -------------- | --------------------------------------------------------- |
| < 760px        | Single column, stacked carousels, compact portrait        |
| 760px -- 959px | 3-column hero, 2-column grids, inline nav wraps           |
| 960px+         | Full desktop layout, PDF preview modal, expanded portrait |

---

## Running Locally

```bash
git clone https://github.com/AbuzarSiddiqi/abuzarsiddiqi.git
cd abuzarsiddiqi
```

Open `index.html` in a browser. No build step required.

For a local server (optional, needed for iframe previews):

```bash
npx serve .
# or
python3 -m http.server 8000
```

---

## License

This project is personal portfolio work by [Abuzar Siddiqi](https://github.com/AbuzarSiddiqi).
