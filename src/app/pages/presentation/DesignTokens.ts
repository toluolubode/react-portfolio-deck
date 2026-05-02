/**
 * Design Tokens
 * 
 * Unified source of truth for the premium aesthetic.
 * Use these for consistent shadows, blurs, and colors.
 */

export const TOKENS = {
  colors: {
    bg: "#0A0A0A",
    surface: "#121214",
    surfaceElevated: "#18181B",
    primary: "#3b82f6", // Electric Blue
    accent: "#10b981",  // Emerald
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.65)",
      tertiary: "rgba(255, 255, 255, 0.4)",
      muted: "rgba(255, 255, 255, 0.2)",
    },
    border: "rgba(255, 255, 255, 0.08)",
  },
  effects: {
    glass: {
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
    },
    glassElevated: {
      background: "rgba(255, 255, 255, 0.06)",
      backdropFilter: "blur(24px)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
    },
    glow: "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
  },
  shadows: {
    sm: "0 2px 4px rgba(0,0,0,0.1)",
    md: "0 8px 32px rgba(0,0,0,0.3)",
    lg: "0 32px 64px rgba(0,0,0,0.6)",
  },
  transitions: {
    base: [0.25, 0.1, 0.25, 1],
    spring: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};
