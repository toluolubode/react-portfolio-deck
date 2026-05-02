# React Portfolio Deck Template

A high-fidelity, open-source presentation engine built for product designers and design engineers. Create stunning, physics-driven portfolio presentations and case studies that run directly in the browser.

Built with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

## Features
- **App-Like Interactions**: Smooth, hardware-accelerated slide transitions.
- **Presenter Mode**: A robust split-screen presenter view with live notes.
- **Figma Native**: Beautifully embedded Figma prototypes out of the box.
- **Export Ready**: Seamless PDF export for ATS tracking or offline viewing.
- **Type-Safe Data**: A fully decoupled, type-safe data model for mapping custom slide content.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Architecture

The presentation engine is completely decoupled from any personal data. You interact with it primarily through two files:

### 1. `deck-builder.ts`
This is the core registry where you define your presentation. It exports a `SLIDES` array that maps to `SlideConfig` objects.
To add a new slide:
1. Build a generic component (e.g., `MyCustomSlide.tsx`).
2. Add an entry to the `SLIDES` array:
   ```typescript
   {
     id: "my-custom-slide",
     component: MyCustomSlide,
     // Optional: override default transition variants
   }
   ```

### 2. `presenter-notes.ts`
This file contains the `getPresenterNotes` function. It acts as a simple lookup mapping slide IDs to a string of notes, which will be visible only to you on the presenter screen.
```typescript
export function getPresenterNotes(slideId: string): string {
  const notes: Record<string, string> = {
    "my-custom-slide": "Remember to mention the new user flow and metric growth here.",
  };
  return notes[slideId] || "";
}
```

## Presentation Controls
- **Arrow Keys (Left/Right)**: Navigate between slides.
- **Spacebar**: Next slide.
- **'P' Key**: Toggle Presenter Mode (displays next slide preview and notes).
- **'E' Key**: Open Export/Print modal.
- **'G' Key**: Toggle Grid overlay.

## Deploying
Since this is a Vite app, it can be deployed to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages) using standard build settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Credit
Based on the design engineering and interaction principles of [Tolu Olubode](https://github.com/toluolubode).
