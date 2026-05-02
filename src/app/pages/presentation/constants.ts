import type { SlideLayout } from "./types";

export const PRESENTATION_CONFIG = {
  TITLE: "Project Presentation",
  AUTHOR: "Designer Name",
  DATE: new Date().toLocaleDateString(),
  DEFAULT_ACCENT_COLOR: "#3b82f6",
};

export const SLIDE_THEMES = {
  dark: {
    background: "#0a0a0a",
    text: "#ffffff",
  },
  light: {
    background: "#ffffff",
    text: "#0a0a0a",
  }
};
