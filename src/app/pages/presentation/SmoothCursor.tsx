import { useEffect, useState, useCallback } from "react";
import { motion, useSpring } from "motion/react";

/**
 * SmoothCursor — spring-animated black filled arrow cursor for presentation mode.
 * Small rounded triangle pointer with white outline, black fill.
 *
 * Automatically disabled inside iframes (e.g. Figma Make preview) so the
 * element picker can reach slide content instead of selecting this SVG.
 */
export function SmoothCursor() {
  const [visible, setVisible] = useState(false);
  const [isEmbedded] = useState(() => {
    try {
      return window.self !== window.top;
    } catch {
      return true; // cross-origin iframe → treat as embedded
    }
  });

  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    },
    [x, y, visible]
  );

  const handleMouseLeave = useCallback(() => setVisible(false), []);
  const handleMouseEnter = useCallback(
    (e: MouseEvent) => {
      x.jump(e.clientX);
      y.jump(e.clientY);
      setVisible(true);
    },
    [x, y]
  );

  useEffect(() => {
    if (isEmbedded) return;
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter, isEmbedded]);

  if (isEmbedded || !visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-4px",
      }}
    >
      <svg
        width="18"
        height="22"
        viewBox="0 0 28 34"
        fill="none"
        style={{
          filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.4))",
        }}
      >
        <path
          d="M14 3L4 27C3.2 28.8 4.6 30.5 6.4 30.5H21.6C23.4 30.5 24.8 28.8 24 27L14 3Z"
          fill="#000"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}