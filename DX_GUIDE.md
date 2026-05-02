# ✦ Developer Experience Guide

Welcome to the **Portfolio Deck Engine**. This guide is designed to help you master the orchestration of your story with maximum efficiency and high-fidelity results.

---

## 🛠 Project Structure

The engine is architected to separate **Visual Content** from **Logic**.

- `src/app/pages/presentation/`
  - `deck-builder.ts` ⮕ **The Map**. Define your slide order and components here.
  - `presenter-notes.ts` ⮕ **The Script**. Map slide IDs to your talking points.
  - `slides/` ⮕ **The Canvas**. Place your custom React components here.
  - `components.tsx` ⮕ **The Toolkit**. Shared UI primitives like `StaggerItem`, `CountUp`, and `FigmaEmbedTrigger`.

---

## ✨ Premium Developer Workflow

### 1. Adding a New Slide
1. Create a new component in `slides/MyNewSlide.tsx`.
2. Wrap your content in `<StaggerItem>` for automatic entrance animations.
3. Import and add it to the `SLIDES` array in `deck-builder.ts`.

### 2. High-Fidelity Previews
Use the **Presenter Mode** (`P` key) during development to see your notes and the "Next Slide" preview simultaneously. This ensures your timing is perfect.

### 3. Grid & Guides
Press `G` to toggle the alignment grid. This helps ensure your content is perfectly centered and follows a consistent layout system.

---

## 🎨 Styling with Tailwind v4
This project uses the latest **Tailwind CSS v4**. 
- Custom styles are defined in `src/styles/index.css`.
- Shared tokens (colors, glassmorphism) are in `src/app/pages/presentation/DesignTokens.ts`.

---

## 📄 Exporting for PDF
When you're ready to share an offline version:
1. Press `E` to enter Export Mode.
2. The browser will automatically optimize the layout for 1920x1080.
3. Select **Save as PDF** in the print dialog.
4. Ensure **Background Graphics** is checked in the print settings.

---

<p align="center">✦ Craft your story with precision. ✦</p>
