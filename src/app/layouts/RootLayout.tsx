import { useOutlet, useLocation } from "react-router";
import { AnimatePresence, motion, LayoutGroup } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { duration, ease } from "../motion";

/**
 * Freezes the outlet content at mount time so AnimatePresence
 * can hold onto the exiting page during the exit animation.
 */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return <>{frozen}</>;
}

export function RootLayout() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  /* ─── Scroll to top on route change ─── */
  useEffect(() => {
    // Skip the initial mount — don't fight browser scroll restoration
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: duration.micro * 1.5, ease: ease.base }}
        >
          <main>
            <FrozenOutlet />
          </main>
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}
