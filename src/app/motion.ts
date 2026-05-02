/**
 * ─── Unified Motion System ───
 *
 * 3 durations x 3 easings — the complete vocabulary.
 * Every animation on the site draws from this palette.
 *
 *   micro  0.15s   Instant feedback: icon swaps, hover states, badge pops
 *   move   0.35s   Workhorse: crossfades, card lifts, collapses, reveals
 *   intro  0.7s    Grand entrances: hero reveals, section fade-ins, page loads
 *
 *   base   [0.25, 0.1, 0.25, 1]     Smooth, balanced — default for most things
 *   expo   [0.16, 1, 0.3, 1]        Quick snap, gentle land — modals, carousels
 *   enter  [0.23, 1, 0.32, 1]       Strong ease-out for entrances (Emil Kowalski's recommendation)
 */

export const duration = {
  micro: 0.15,
  move: 0.35,
  intro: 0.7,
} as const;

export const ease = {
  base: [0.25, 0.1, 0.25, 1],
  expo: [0.16, 1, 0.3, 1],
  /** Strong ease-out — starts fast, feels responsive. Use for element entrances. */
  enter: [0.23, 1, 0.32, 1],
} as const;

/** Pre-composed transition objects for motion/react */
export const t = {
  micro: { duration: duration.micro, ease: ease.base },
  move: { duration: duration.move, ease: ease.base },
  moveSnap: { duration: duration.move, ease: ease.expo },
  intro: { duration: duration.intro, ease: ease.enter },
  /** Asymmetric exit — faster than enter (Emil: "slow where deciding, fast where responding") */
  exit: { duration: duration.micro, ease: ease.expo },
} as const;

/** ─── Spring transitions ─── */
export const spring = {
  /** Smooth, balanced — default for reveals and mode toggles */
  default: { type: "spring" as const, stiffness: 300, damping: 24 },
  /** Playful bounce — drag release, sticker toss */
  bouncy: { type: "spring" as const, stiffness: 500, damping: 15 },
  /** Tight snap — tab indicators, micro interactions */
  stiff: { type: "spring" as const, stiffness: 700, damping: 30 },
} as const;

/** ─── Stagger variant factories ─── */
export function stagger(staggerMs = 0.06, delayMs = 0) {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: staggerMs, delayChildren: delayMs },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.intro, ease: ease.enter },
      },
    },
  };
}

/**
 * Tailwind duration classes (for quick reference / consistency):
 *   micro  →  duration-150
 *   move   →  duration-350
 *   intro  →  duration-700
 */
