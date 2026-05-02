// Generic data file for the presentation template

// You can use these constants for default font styles, colors, etc.
export const FFS = { fontFamily: "'Inter', sans-serif" };
export const DFS = { fontFamily: "'Inter', sans-serif" };

export const SlideLayouts = {
  TITLE: "title",
  SECTION: "section",
  CONTENT: "content",
  FULL_IMAGE: "full_image",
} as const;

export const THEME = {
  primary: "#3b82f6",
  background: "#0a0a0a",
  surface: "#171717",
  text: {
    primary: "#ffffff",
    secondary: "rgba(255, 255, 255, 0.7)",
    muted: "rgba(255, 255, 255, 0.4)"
  }
};

export const slideTransition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export const slideVariants = {
  enter: (d: number) => ({
    opacity: 0,
    x: d > 0 ? 40 : d < 0 ? -40 : 0,
    scale: 0.97,
    filter: "blur(10px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (d: number) => ({
    opacity: 0,
    x: d > 0 ? -20 : d < 0 ? 20 : 0,
    scale: 1.02,
    filter: "blur(4px)",
    zIndex: 0,
  }),
};
