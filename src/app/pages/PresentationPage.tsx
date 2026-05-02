import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { CaretLeft as ChevronLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { CaretRight as ChevronRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { PresentationChart as Presentation } from "@phosphor-icons/react/dist/ssr/PresentationChart";
import { SquaresFour as Grid3X3 } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import { Note as StickyNote } from "@phosphor-icons/react/dist/ssr/Note";
import { ArrowSquareOut as ExternalLink } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { Keyboard } from "@phosphor-icons/react/dist/ssr/Keyboard";
import { WarningCircle as AlertCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { SidebarSimple as PanelRightClose } from "@phosphor-icons/react/dist/ssr/SidebarSimple";
import { SidebarSimple as PanelLeft } from "@phosphor-icons/react/dist/ssr/SidebarSimple";

import { SLIDES, SlideConfig } from "./presentation/deck-builder";
import {
  FFS,
  slideTransition,
  slideVariants,
} from "./presentation/data";
import { getPresenterNotes } from "./presentation/presenter-notes";
import { ImageZoomContext, useSwipe } from "./presentation/components";
import { GridOverlay } from "./presentation/GridOverlay";
import { NotesPanel } from "./presentation/NotesPanel";
import { ExportModal } from "./presentation/ExportModal";
import { PrintLayout } from "./presentation/PrintLayout";

/* ═══════════════════════════════════════════════
   Presentation Context
   ═══════════════════════════════════════════════ */

interface PresentationContextType {
  goTo: (index: number) => void;
  getSectionStartIndex: (slideIdOrTypeStart: string) => number;
}

const PresentationNavigationContext = createContext<PresentationContextType>({
  goTo: () => { },
  getSectionStartIndex: () => -1,
});

export const usePresentationNavigation = () => useContext(PresentationNavigationContext);

function getSlideLabel(slide: SlideConfig): string {
    return slide.id.charAt(0).toUpperCase() + slide.id.slice(1).replace(/-/g, ' ');
}

/* ═══════════════════════════════════════════════
   Presentation Page (Shell)
   ═══════════════════════════════════════════════ */
export default function PresentationPage() {
  const [slides, setSlides] = useState<SlideConfig[]>(SLIDES);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const [showGrid, setShowGrid] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [printIncludeNotes, setPrintIncludeNotes] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [hiddenSlides, setHiddenSlides] = useState<Set<string>>(new Set());

  const [chromeVisible, setChromeVisible] = useState(true);
  const [toolbarHidden, setToolbarHidden] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Intro sequence timer
  useEffect(() => {
    const t = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStartedAt, setTimerStartedAt] = useState<number | null>(null);
  const [slideStartedAt, setSlideStartedAt] = useState<number | null>(null);
  const [accumulatedOverallMs, setAccumulatedOverallMs] = useState(0);
  const [accumulatedSlideMs, setAccumulatedSlideMs] = useState(0);
  const [totalMinutes] = useState(30);

  // Handle slide change resets
  useEffect(() => {
    setAccumulatedSlideMs(0);
    if (timerRunning) {
      setSlideStartedAt(Date.now());
    } else {
      setSlideStartedAt(null);
    }
  }, [current]); // ONLY on slide change

  const [zoomedImg, setZoomedImg] = useState<{
    src: string;
    alt: string;
    type?: 'image' | 'video';
  } | null>(null);
  const openZoom = useCallback((src: string, alt: string, type?: 'image' | 'video') => {
    setZoomedImg({ src, alt, type: type || 'image' });
  }, []);
  const closeZoom = useCallback(() => setZoomedImg(null), []);
  const chromeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [edgeBounce, setEdgeBounce] = useState<"start" | "end" | null>(null);
  const edgeBounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const notesWindowRef = useRef<Window | null>(null);
  const [notesPopped, setNotesPopped] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Detect if running inside an iframe
  const [isEmbedded] = useState(() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.title = "Presentation View";
    return () => {
      document.title = "React Portfolio Deck Template";
    };
  }, []);

  // Auto-hide chrome after 3s of mouse inactivity
  const resetChromeTimer = useCallback(() => {
    setChromeVisible(true);
    if (chromeTimer.current) clearTimeout(chromeTimer.current);
    chromeTimer.current = setTimeout(() => setChromeVisible(false), 3000);
  }, []);

  useEffect(() => {
    const onMove = () => resetChromeTimer();
    window.addEventListener("mousemove", onMove);
    resetChromeTimer();
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (chromeTimer.current) clearTimeout(chromeTimer.current);
    };
  }, [resetChromeTimer]);

  const chromeForced = showGrid || showNotes || showExport;
  const chromeShown = chromeForced || chromeVisible;
  const effectiveChromeShown = chromeShown && !toolbarHidden;

  // Edge-of-deck bounce
  const triggerEdgeBounce = useCallback((edge: "start" | "end") => {
    setEdgeBounce(edge);
    if (edgeBounceTimer.current) clearTimeout(edgeBounceTimer.current);
    edgeBounceTimer.current = setTimeout(() => setEdgeBounce(null), 500);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setHasInteracted(true);
      if (index < 0 || index >= slides.length) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
      resetChromeTimer();
    },
    [current, resetChromeTimer, slides.length]
  );

  const toggleHiddenSlide = useCallback((id: string) => {
    setHiddenSlides(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const next = useCallback(() => {
    let nextIndex = current + 1;
    // Skip any hidden slides
    while (nextIndex < slides.length && hiddenSlides.has(slides[nextIndex].id)) {
      nextIndex++;
    }

    if (nextIndex >= slides.length) {
      triggerEdgeBounce("end");
      resetChromeTimer();
      return;
    }
    goTo(nextIndex);
  }, [goTo, current, triggerEdgeBounce, resetChromeTimer, hiddenSlides, slides]);

  const prev = useCallback(() => {
    let prevIndex = current - 1;
    // Skip any hidden slides
    while (prevIndex >= 0 && hiddenSlides.has(slides[prevIndex].id)) {
      prevIndex--;
    }

    if (prevIndex < 0) {
      triggerEdgeBounce("start");
      resetChromeTimer();
      return;
    }
    goTo(prevIndex);
  }, [goTo, current, triggerEdgeBounce, resetChromeTimer, hiddenSlides, slides]);

  // Expose navigation to Global Window for Pop-out buttons
  useEffect(() => {
    (window as any).goToNextSlide = next;
    (window as any).goToPrevSlide = prev;
    return () => {
      delete (window as any).goToNextSlide;
      delete (window as any).goToPrevSlide;
    };
  }, [next, prev]);

  const getSectionStartIndex = useCallback(
    (slideIdOrTypeStart: string) => {
      return slides.findIndex(
        (s) => s.id === slideIdOrTypeStart || s.id.startsWith(slideIdOrTypeStart)
      );
    },
    [slides]
  );

  // ─── Pop-out notes window ───
  const buildNotesHTML = useCallback((slide: SlideConfig) => {
    const notes = getPresenterNotes(slide.id);
    const label = getSlideLabel(slide);

    const h: string[] = [];
    h.push("<!DOCTYPE html><html><head><title>Presenter Notes</title><style>");
    h.push("*{margin:0;padding:0;box-sizing:border-box}");
    h.push("body{background:#141416;color:rgba(255,255,255,0.45);font-family:'Satoshi',system-ui,sans-serif;padding:24px}");
    h.push(".header{display:flex;align-items:center;gap:8px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:16px}");
    h.push(".label{font-size:11px;text-transform:uppercase;letter-spacing:0.4px;color:rgba(255,255,255,0.25)}");
    h.push(".slide-title{font-size:14px;color:rgba(255,255,255,0.55);letter-spacing:-0.2px}");
    h.push("ol{list-style:none}");
    h.push("li{display:flex;gap:12px;margin-bottom:10px}");
    h.push("li .num{font-size:11px;color:rgba(255,255,255,0.15);font-variant-numeric:tabular-nums;margin-top:3px;flex-shrink:0;min-width:14px}");
    h.push("li .text{font-size:14px;line-height:1.6;letter-spacing:-0.2px}");
    h.push(".copy-btn{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:11px;letter-spacing:0.2px;transition:all 0.2s;display:flex;align-items:center;gap:6px;text-transform:uppercase;margin-left:auto;}");
    h.push(".copy-btn:hover{background:rgba(255,255,255,0.15)}");
    h.push(".copy-btn.copied{background:rgba(52,211,153,0.15);border-color:rgba(52,211,153,0.3);color:#6ee7b7}");
    h.push("</style></head><body>");
    h.push('<div class="header"><div>');
    h.push('<div class="label">Presenter Notes</div>');
    h.push('<div class="slide-title">' + label + "</div>");
    h.push("</div>");
    h.push('<button id="copy-btn" class="copy-btn" onclick="copyNotes()">Copy</button>');
    h.push("</div><ol>");
    notes.forEach((note, i) => {
      h.push('<li><span class="num">' + (i + 1) + '</span><span class="text">' + note + "</span></li>");
    });
    h.push("</ol>");

    // --- Timer State Injection ---
    h.push(`
<div style="position:fixed;bottom:0;left:0;right:0;background:#0A0A0C;border-top:1px solid rgba(255,255,255,0.1);z-index:100;backdrop-filter:blur(10px);">
  
  <!-- Navigation Controls -->
  <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
    <button onclick="navTo('prev')" style="background:rgba(255,255,255,0.1);border:none;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:13px;letter-spacing:-0.2px;">&larr; Prev</button>
    <button onclick="navTo('next')" style="background:rgba(255,255,255,0.1);border:none;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:13px;letter-spacing:-0.2px;">Next &rarr;</button>
  </div>

  <!-- Timer -->
  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 24px;">
    <div style="display:flex;flex-direction:column;gap:2px;">
      <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:rgba(255,255,255,0.3)">Total Time</span>
      <span id="timer-overall" style="font-family:monospace;font-size:16px;color:rgba(255,255,255,0.85)">00:00:00</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:2px;text-align:right;">
      <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:rgba(255,255,255,0.3)">Slide Time</span>
      <span id="timer-slide" style="font-family:monospace;font-size:16px;color:rgba(255,255,255,0.85)">00:00</span>
    </div>
  </div>
</div>
<script>
  (function() {
    var timerRunning = ${timerRunning ? "true" : "false"};
    var accumulatedOverall = ${accumulatedOverallMs};
    var accumulatedSlide = ${accumulatedSlideMs};
    var startOverall = ${timerStartedAt || "null"};
    var startSlide = ${slideStartedAt || "null"};
    
    function pad(n) { return (n < 10 ? "0" : "") + n; }

    function update() {
      var now = Date.now();
      var elapsedOverallMs = accumulatedOverall;
      if (timerRunning && startOverall) {
        elapsedOverallMs += (now - startOverall);
      }
      var elapsedSlideMs = accumulatedSlide;
      if (timerRunning && startSlide) {
        elapsedSlideMs += (now - startSlide);
      }

      var elOverall = document.getElementById("timer-overall");
      var elSlide = document.getElementById("timer-slide");
      if (!elOverall || !elSlide) return;

      var totalSecsOverall = Math.floor(elapsedOverallMs / 1000);
      var hours = Math.floor(totalSecsOverall / 3600);
      var mins = Math.floor((totalSecsOverall % 3600) / 60);
      var secs = totalSecsOverall % 60;
      elOverall.innerText = pad(hours) + ":" + pad(mins) + ":" + pad(secs);

      var totalSecsSlide = Math.floor(elapsedSlideMs / 1000);
      var sMins = Math.floor(totalSecsSlide / 60);
      var sSecs = totalSecsSlide % 60;
      elSlide.innerText = pad(sMins) + ":" + pad(sSecs);
      
      var targetSlideSecs = (${totalMinutes} / ${slides.length}) * 60;
      
      if (totalSecsSlide > targetSlideSecs) {
        elSlide.style.color = "#ef4444";
      } else if (totalSecsSlide > (targetSlideSecs * 0.8)) {
        elSlide.style.color = "#f59e0b";
      } else {
        elSlide.style.color = "rgba(255,255,255,0.85)";
      }
    }

    update();
    if (timerRunning) {
      setInterval(update, 1000);
    }

    window.navTo = function(dir) {
      var op = window.opener;
      if (!op) return;
      if (dir === 'next' && op.goToNextSlide) op.goToNextSlide();
      if (dir === 'prev' && op.goToPrevSlide) op.goToPrevSlide();
    };
 
    window.copyNotes = function() {
      var notes = Array.from(document.querySelectorAll('.text')).map(el => el.innerText).join('\\n\\n');
      navigator.clipboard.writeText(notes).then(function() {
        var btn = document.getElementById('copy-btn');
        if (!btn) return;
        var originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function() {
          btn.innerText = originalText;
          btn.classList.remove('copied');
        }, 2000);
      });
    };
  })();
</script>
      `);
    // Add padding to body so notes don't hide behind fixed footer
    h.push("<style>body{padding-bottom: 120px}</style>");

    h.push("</body></html>");
    return h.join("\n");
  }, [timerRunning, timerStartedAt, slideStartedAt, accumulatedOverallMs, accumulatedSlideMs, totalMinutes, slides.length]);


  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const popOutNotes = useCallback(() => {
    const w = window.open("", "presenter-notes", "width=420,height=600,left=100,top=100,scrollbars=yes,resizable=yes");
    if (!w || w.closed || typeof w.closed === "undefined") {
      showToast("Pop-up blocked. Please allow pop-ups for presenter notes or use the on-screen overlay.");
      return;
    }
    notesWindowRef.current = w;
    setNotesPopped(true);
    setShowNotes(false);
    w.document.open();
    w.document.write(buildNotesHTML(slides[current]));
    w.document.close();
    const checkClosed = setInterval(() => {
      if (w.closed) {
        clearInterval(checkClosed);
        notesWindowRef.current = null;
        setNotesPopped(false);
      }
    }, 500);
  }, [current, buildNotesHTML, slides]);

  // Sync pop-out window when slide changes
  useEffect(() => {
    const w = notesWindowRef.current;
    if (!w || w.closed) return;
    w.document.open();
    w.document.write(buildNotesHTML(slides[current]));
    w.document.close();
  }, [current, buildNotesHTML, slides]);

  // Cleanup pop-out window on unmount
  useEffect(() => {
    return () => {
      if (notesWindowRef.current && !notesWindowRef.current.closed) {
        notesWindowRef.current.close();
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (zoomedImg) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeZoom();
        }
        return;
      }

      if (showGrid) {
        if (e.key === "g" || e.key === "G" || e.key === "Escape") {
          e.preventDefault();
          setShowGrid(false);
        }
        return;
      }

      if (showExport) {
        if (e.key === "e" || e.key === "E" || e.key === "Escape") {
          e.preventDefault();
          setShowExport(false);
        }
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          next();
          break;
        case " ":
          if (!showNotes) {
            e.preventDefault();
            next();
          }
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prev();
          break;
        case "Escape":
          if (showNotes) {
            e.preventDefault();
            setShowNotes(false);
          } else {
            navigate("/");
          }
          break;
        case "g":
        case "G":
          e.preventDefault();
          setShowGrid(true);
          break;
        case "e":
        case "E":
          e.preventDefault();
          setShowExport(true);
          break;
        case "s":
        case "S":
        case "?":
          e.preventDefault();
          setShowShortcuts((v) => !v);
          break;
        case "n":
        case "N":
          e.preventDefault();
          if (notesPopped) {
            if (notesWindowRef.current && !notesWindowRef.current.closed) {
              notesWindowRef.current.close();
            }
            notesWindowRef.current = null;
            setNotesPopped(false);
          } else {
            setShowNotes((v) => !v);
          }
          break;
        case "p":
        case "P":
          e.preventDefault();
          if (notesPopped) {
            if (notesWindowRef.current && !notesWindowRef.current.closed) {
              notesWindowRef.current.close();
            }
            notesWindowRef.current = null;
            setNotesPopped(false);
          } else {
            popOutNotes();
          }
          break;
        case "r":
        case "R":
          e.preventDefault();
          setCurrent(0);
          setDirection(0);
          break;
        case "h":
        case "H":
          e.preventDefault();
          setToolbarHidden((v) => !v);
          if (!toolbarHidden) resetChromeTimer();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, navigate, showGrid, showNotes, notesPopped, popOutNotes, zoomedImg, closeZoom, toolbarHidden, resetChromeTimer]);

  // Touch/swipe support
  const { onTouchStart, onTouchEnd } = useSwipe(next, prev);

  const slide = slides[current];
  const progress = slides.length ? ((current + 1) / slides.length) * 100 : 0;
  const slideLabel = getSlideLabel(slide);

  const handleGridSelect = useCallback(
    (index: number) => {
      goTo(index);
      setShowGrid(false);
    },
    [goTo]
  );

  const handleExport = useCallback(async (includeNotes?: boolean) => {
    setIsPrinting(true);
    setPrintIncludeNotes(includeNotes ?? false);
  }, []);

  const Component = slide.component;

  return (
    <PresentationNavigationContext.Provider value={{ goTo, getSectionStartIndex }}>
      <ImageZoomContext.Provider value={openZoom}>
        {isPrinting && (
          <PrintLayout
            slides={slides}
            includeNotes={printIncludeNotes}
            onPrintComplete={() => {
              setIsPrinting(false);
              setPrintIncludeNotes(false);
            }}
            hiddenSlides={hiddenSlides}
          />
        )}
        <div
          ref={containerRef}
          className="no-print fixed inset-0 bg-[#0A0A0A] overflow-hidden select-none"
          data-presentation
          {...(!isEmbedded ? { "data-presentation-live": "" } : {})}
          style={FFS}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* ── Premium Intro Sequence ── */}
          <AnimatePresence>
            {isInitializing && (
              <motion.div
                className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center"
                exit={{ 
                  opacity: 0,
                  scale: 1.05,
                  filter: "blur(20px)",
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-white/40 animate-spin" />
                  <span className="text-white/20 text-xs tracking-widest uppercase">Initializing Deck</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle ambient glow */}
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(52,211,153,0.03) 0%, transparent 70%)",
              transform: "translate(30%, -40%)",
            }}
          />

          {/* Click zones for navigation */}
          {!showGrid && !showNotes && (
            <>
              <div
                role="button"
                tabIndex={0}
                className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize z-10 outline-none"
                onClick={prev}
                onKeyDown={(e) => { if (e.key === 'Enter') prev(); }}
                aria-label="Previous slide"
              />
              <div
                role="button"
                tabIndex={0}
                className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize z-10 outline-none"
                onClick={next}
                onKeyDown={(e) => { if (e.key === 'Enter') next(); }}
                aria-label="Next slide"
              />
            </>
          )}

          {/* Initial discovery hint */}
          <AnimatePresence>
            {current === 0 && !hasInteracted && (
              <motion.div
                className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div
                  className="px-4 py-2 rounded-full flex items-center gap-2"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-['DM_Sans',sans-serif] text-[13px] tracking-[0.2px] text-white/50" style={FFS}>
                    Press Space to advance
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slide content */}
          <AnimatePresence custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="absolute inset-0 flex items-center justify-center z-[15] pointer-events-none"
            >
              <Component />
            </motion.div>
          </AnimatePresence>

          {/* ARIA Live Region for screen readers to announce slide changes */}
          <div aria-live="polite" className="sr-only">
            {`Slide ${current + 1} of ${slides.length}: ${slideLabel}`}
          </div>

          {/* ── Top bar: slide label + controls ── */}
          <div
            className="export-ignore absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
            style={{
              opacity: (effectiveChromeShown || timerRunning || notesPopped) ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: (effectiveChromeShown || timerRunning || notesPopped) ? "auto" : "none",
            }}
          >
            <div className="flex items-center gap-3">
              <Presentation
                className="w-[14px] h-[14px] text-white/20"
                strokeWidth={2}
              />
              <span
                className="font-['DM_Sans',sans-serif] text-[13px] text-white/25 tracking-[-0.1px]"
                style={FFS}
              >
                {slideLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Grid toggle */}
              <button
                onClick={() => setShowGrid(true)}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161618]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                }}
                title="Slide overview (G)"
                aria-label="Slide overview"
              >
                <Grid3X3 className="w-[14px] h-[14px]" strokeWidth={2} />
              </button>
              {/* Notes toggle */}
              <button
                onClick={() => {
                  if (notesPopped) {
                    if (notesWindowRef.current && !notesWindowRef.current.closed) {
                      notesWindowRef.current.close();
                    }
                    notesWindowRef.current = null;
                    setNotesPopped(false);
                  } else {
                    setShowNotes((v) => !v);
                  }
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer relative outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161618]"
                style={{
                  background: (showNotes || notesPopped)
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.06)",
                  border: (showNotes || notesPopped)
                    ? "1px solid rgba(255,255,255,0.15)"
                    : "1px solid rgba(255,255,255,0.08)",
                  color: (showNotes || notesPopped)
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(255,255,255,0.4)",
                }}
                title={notesPopped ? "Notes popped out — click to close (N)" : "Presenter notes (N)"}
                aria-label={notesPopped ? "Close presenter notes" : "Open presenter notes"}
              >
                {notesPopped ? (
                  <ExternalLink className="w-[14px] h-[14px]" strokeWidth={2} />
                ) : (
                  <StickyNote className="w-[14px] h-[14px]" strokeWidth={2} />
                )}
                {notesPopped && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-[6px] h-[6px] rounded-full"
                    style={{ background: "rgba(52,211,153,0.8)" }}
                  />
                )}
              </button>

              {/* Timer Controls */}
              <div
                className="flex items-center gap-1 rounded-full px-1 py-1"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {!timerRunning ? (
                  <button
                    onClick={() => {
                      const now = Date.now();
                      setTimerRunning(true);
                      setTimerStartedAt(now);
                      setSlideStartedAt(now);
                    }}
                    className="h-6 px-3 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer text-[12px] font-['DM_Sans',sans-serif] outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161618]"
                    style={{
                      background: "rgba(52,211,153,0.15)",
                      color: "rgb(110, 231, 183)",
                      ...FFS
                    }}
                    title={timerStartedAt === null && accumulatedOverallMs === 0 ? "Start Timer" : "Resume Timer"}
                  >
                    {timerStartedAt === null && accumulatedOverallMs === 0 ? "Start Timer" : "Resume"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        const now = Date.now();
                        if (timerStartedAt && slideStartedAt) {
                          setAccumulatedOverallMs(prev => prev + (now - timerStartedAt));
                          setAccumulatedSlideMs(prev => prev + (now - slideStartedAt));
                        }
                        setTimerRunning(false);
                        setTimerStartedAt(null);
                        setSlideStartedAt(null);
                      }}
                      className="h-6 px-3 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer text-[12px] font-['DM_Sans',sans-serif] outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161618]"
                      style={{
                        background: "rgba(251,191,36,0.15)",
                        color: "rgb(252, 211, 77)",
                        ...FFS
                      }}
                      title="Pause Timer"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerStartedAt(null);
                        setSlideStartedAt(null);
                        setAccumulatedOverallMs(0);
                        setAccumulatedSlideMs(0);
                      }}
                      className="h-6 px-3 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer text-[12px] font-['DM_Sans',sans-serif]"
                      style={{
                        background: "rgba(239,68,68,0.15)",
                        color: "rgb(252, 165, 165)",
                        ...FFS
                      }}
                      title="Reset Timer"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>

              {/* Hide toolbar */}
              <button
                onClick={() => setToolbarHidden(true)}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161618]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                }}
                title="Hide toolbar (H)"
                aria-label="Hide toolbar"
              >
                <PanelRightClose className="w-[14px] h-[14px]" style={{ transform: "scaleX(-1)" }} />
              </button>
              {/* Close */}
              <button
                onClick={() => navigate("/")}

                className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161618]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                }}
                title="Exit (Esc)"
                aria-label="Exit presentation"
              >
                <X className="w-[14px] h-[14px]" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* ── Show toolbar floater (when toolbar is hidden) ── */}
          <AnimatePresence>
            {toolbarHidden && (
              <motion.button
                type="button"
                onClick={() => {
                  setToolbarHidden(false);
                  resetChromeTimer();
                }}
                className="fixed bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                title="Show toolbar (H)"
              >
                <PanelLeft className="w-[14px] h-[14px]" strokeWidth={2} />
                <span className="font-['DM_Sans',sans-serif] text-[13px] tracking-[-0.1px]" style={FFS}>
                  Show toolbar
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* ── Toast Error ── */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                className="absolute top-16 left-1/2 z-50 pointer-events-none"
                style={{ transform: "translateX(-50%)" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
                  style={{
                    background: "rgba(220, 38, 38, 0.15)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(248, 113, 113, 0.3)",
                  }}
                >
                  <AlertCircle className="w-5 h-5 text-red-400" strokeWidth={2} />
                  <span
                    className="font-['DM_Sans',sans-serif] text-[13px] tracking-[-0.1px] text-red-100"
                    style={FFS}
                  >
                    {toastMessage}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Presenter notes panel ── */}
          <AnimatePresence>
            {showNotes && !showGrid && (
              <NotesPanel
                slide={slide}
                onClose={() => setShowNotes(false)}
                onPopOut={popOutNotes}
                timer={{
                  isRunning: timerRunning,
                  totalMinutes,
                  timerStartedAt,
                  slideStartedAt,
                  accumulatedOverallMs,
                  accumulatedSlideMs,
                  totalSlides: slides.length
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Grid overlay ── */}
          <AnimatePresence>
            {showGrid && (
              <GridOverlay
                slides={slides}
                current={current}
                onSelect={handleGridSelect}
                onClose={() => setShowGrid(false)}
                hiddenSlides={hiddenSlides}
                onToggleHidden={toggleHiddenSlide}
                onReorderSlides={(nextSlides) => {
                  const currentSlideId = slides[current]?.id;
                  setSlides(nextSlides);
                  if (currentSlideId) {
                    const newIndex = nextSlides.findIndex((s) => s.id === currentSlideId);
                    if (newIndex !== -1) setCurrent(newIndex);
                  }
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Bottom bar: navigation + progress ── */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20"
            style={{
              opacity: effectiveChromeShown ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: effectiveChromeShown ? "auto" : "none",
            }}
          >
            {/* Progress bar */}
            <div className="relative w-full h-[2px] bg-white/[0.06]">
              <motion.div
                className="h-full"
                style={{
                  background: edgeBounce
                    ? "rgba(255,120,120,0.5)"
                    : "rgba(255,255,255,0.2)",
                  transition: "background 0.15s ease",
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
              <AnimatePresence>
                {edgeBounce && (
                  <motion.div
                    className="absolute top-0 h-[2px]"
                    style={{
                      left: edgeBounce === "start" ? 0 : undefined,
                      right: edgeBounce === "end" ? 0 : undefined,
                      width: "120px",
                      background: edgeBounce === "start"
                        ? "linear-gradient(to right, rgba(255,120,120,0.6), transparent)"
                        : "linear-gradient(to left, rgba(255,120,120,0.6), transparent)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Nav controls */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  disabled={current === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-350 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                  title="Previous (Left arrow)"
                >
                  <ChevronLeft className="w-[14px] h-[14px]" strokeWidth={2} />
                </button>
                <button
                  onClick={next}
                  disabled={current === slides.length - 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-350 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                  title="Next (Right arrow)"
                >
                  <ChevronRight className="w-[14px] h-[14px]" strokeWidth={2} />
                </button>
              </div>

              <span
                className="font-['DM_Sans',sans-serif] text-[13px] text-white/20 tracking-[-0.1px] tabular-nums"
                style={{ fontFeatureSettings: "'salt', 'ss04', 'tnum'" }}
              >
                {current + 1} / {slides.length}
              </span>

              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setShowShortcuts((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200"
                  style={{
                    background: showShortcuts ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    border: showShortcuts ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.08)",
                    color: showShortcuts ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                  }}
                >
                  <Keyboard className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="text-[12px] font-medium tracking-[-0.1px]">Shortcuts</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Shortcuts Modal ── */}
          <AnimatePresence>
            {showShortcuts && (
              <motion.div
                className="absolute bottom-16 right-6 z-50 p-5 rounded-2xl shadow-2xl"
                style={{
                  background: "rgba(20, 20, 22, 0.85)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="flex flex-col gap-3">
                  <div className="text-[11px] font-medium text-white/40 uppercase tracking-widest mb-1.5">Keyboard Shortcuts</div>
                  {[
                    { key: "Space", label: "Next slide" },
                    { key: "← / →", label: "Navigate" },
                    { key: "G", label: "Grid overview" },
                    { key: "E", label: "Export PDF" },
                    { key: "N", label: "Toggle notes" },
                    { key: "P", label: "Pop-out notes" },
                    { key: "S", label: "Toggle shortcuts" },
                    { key: "H", label: "Hide / Show toolbar" },
                    { key: "R", label: "Restart presentation" },
                    { key: "Esc", label: "Exit / Close overlays" },
                  ].map((hint, i) => (
                    <div key={i} className="flex items-center justify-between gap-8">
                      <span className="text-[13px] text-white/60 tracking-[-0.1px]">{hint.label}</span>
                      <kbd
                        className="px-2 py-1 rounded text-[11px] text-white/80 font-medium"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {hint.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Image Lightbox Overlay ── */}
          <AnimatePresence>
            {zoomedImg && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center cursor-zoom-out"
                style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeZoom}
              >
                {zoomedImg.type === 'video' ? (
                  <motion.video
                    src={zoomedImg.src}
                    className="max-w-[90vw] max-h-[90vh] object-contain rounded-[8px]"
                    style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <motion.img
                    src={zoomedImg.src}
                    alt={zoomedImg.alt}
                    className="max-w-[90vw] max-h-[90vh] object-contain rounded-[8px]"
                    style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <button
                  onClick={closeZoom}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  <X className="w-[16px] h-[16px]" strokeWidth={1.5} />
                </button>
                <div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 font-['DM_Sans',sans-serif] text-[12px] text-white/30 tracking-[0.3px]"
                  style={FFS}
                >
                  Click anywhere or press Esc to close
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showExport && (
              <ExportModal
                slides={slides}
                onClose={() => setShowExport(false)}
                onExport={handleExport}
                hiddenSlides={hiddenSlides}
              />
            )}
          </AnimatePresence>

        </div>
      </ImageZoomContext.Provider>
    </PresentationNavigationContext.Provider>
  );
}