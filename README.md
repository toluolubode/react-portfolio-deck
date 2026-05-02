# ✦ React Portfolio Deck Template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftoluolubode%2Freact-portfolio-deck-template)

A high-fidelity, animation-rich presentation engine built for product designers and design engineers. Create stunning, physics-driven portfolio presentations and case studies that run directly in the browser.

[View Demo](https://react-portfolio-deck-template.vercel.app) • [Report Bug](https://github.com/toluolubode/react-portfolio-deck-template/issues) • [Request Feature](https://github.com/toluolubode/react-portfolio-deck-template/issues)

---

## 💎 Premium Features

- **✨ App-Like Interactions**: Physics-based slide transitions and micro-animations powered by `motion/react`.
- **🎙️ Presenter Mode**: Pro-grade split-screen view with live timer, next slide preview, and scrollable notes.
- **🎨 Figma Native**: Integrated support for high-fidelity Figma prototype embeds.
- **📄 Export Ready**: Specialized print-only layouts for generating pixel-perfect PDFs for ATS tracking.
- **🧱 Type-Safe Data**: Fully decoupled architecture using TypeScript for rapid slide orchestration.
- **📱 Responsive Layouts**: Built-in support for touch-swiping and mobile viewing.

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/toluolubode/react-portfolio-deck-template.git
cd react-portfolio-deck-template
npm install
```

### 2. Development
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 🛠 Architecture

The engine is built to be a "Blank Canvas." You primarily manage your presentation through two files:

### 1. `deck-builder.ts`
Map your custom React components to unique slide IDs.
```typescript
{
  id: "case-study-hero",
  component: HeroSlide,
  transition: "default" // or "physics", "fade", etc.
}
```

### 2. `presenter-notes.ts`
Keep your "talk track" separate from your visual content.
```typescript
"case-study-hero": "Start with the 'Why'. Mention the problem statement clearly."
```

---

## ⌨️ Presentation Controls

| Key | Action |
| --- | --- |
| `Space` / `→` | Next Slide |
| `←` | Previous Slide |
| `P` | Toggle **Presenter Mode** |
| `E` | Open **Export Modal** |
| `T` | Toggle **Timer State** |
| `G` | Toggle **Guide Overlays** |

---

## 🌐 Deploying

This template is optimized for **Vercel** but works anywhere that hosts static files.

- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---

<p align="center">Built by <a href="https://github.com/toluolubode">Tolu Olubode</a></p>
