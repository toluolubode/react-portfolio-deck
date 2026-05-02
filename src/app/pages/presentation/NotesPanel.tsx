import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Note as StickyNote } from "@phosphor-icons/react/dist/ssr/Note";
import { ArrowSquareOut as ExternalLink } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { Copy } from "@phosphor-icons/react/dist/ssr/Copy";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";

import type { SlideConfig } from "./deck-builder";
import { FFS } from "./data";
import { getPresenterNotes } from "./presenter-notes";

export function NotesPanel({
  slide,
  onClose,
  onPopOut,
  timer,
}: {
  slide: SlideConfig;
  onClose: () => void;
  onPopOut: () => void;
  timer?: {
    isRunning: boolean;
    totalMinutes: number;
    timerStartedAt: number | null;
    slideStartedAt: number | null;
    accumulatedOverallMs: number;
    accumulatedSlideMs: number;
    totalSlides: number;
  };
}) {
  const notes = useMemo(() => getPresenterNotes(slide.id), [slide.id]);
  const [copied, setCopied] = useState(false);

  // Timer logic for the inline panel
  const [overallTimeString, setOverallTimeString] = useState("00:00:00");
  const [slideTimeString, setSlideTimeString] = useState("00:00");
  const [isSlideOvertime, setIsSlideOvertime] = useState(false);
  const [isSlideWarning, setIsSlideWarning] = useState(false);

  useEffect(() => {
    if (!timer) return;

    const pad = (n: number) => (n < 10 ? "0" + n : n.toString());
    const targetSlideSecs = (timer.totalMinutes / timer.totalSlides) * 60;

    let rafId: number | null = null;
    let timeoutId: number | null = null;

    const tick = () => {
      const now = Date.now();

      // Overall Time
      let elapsedOverallMs = timer.accumulatedOverallMs || 0;
      if (timer.isRunning && timer.timerStartedAt) {
        elapsedOverallMs += now - timer.timerStartedAt;
      }

      const totalSecsOverall = Math.floor(elapsedOverallMs / 1000);
      const hours = Math.floor(totalSecsOverall / 3600);
      const mins = Math.floor((totalSecsOverall % 3600) / 60);
      const secs = totalSecsOverall % 60;
      setOverallTimeString(`${pad(hours)}:${pad(mins)}:${pad(secs)}`);

      // Slide Time
      let elapsedSlideMs = timer.accumulatedSlideMs || 0;
      if (timer.isRunning && timer.slideStartedAt) {
        elapsedSlideMs += now - timer.slideStartedAt;
      }

      const totalSecsSlide = Math.floor(elapsedSlideMs / 1000);
      const sMins = Math.floor(totalSecsSlide / 60);
      const sSecs = totalSecsSlide % 60;
      setSlideTimeString(`${pad(sMins)}:${pad(sSecs)}`);

      setIsSlideOvertime(totalSecsSlide > targetSlideSecs);
      setIsSlideWarning(
        totalSecsSlide > targetSlideSecs * 0.8 && totalSecsSlide <= targetSlideSecs
      );

      // Check roughly every half-second rather than full 60fps for performance
      rafId = requestAnimationFrame(() => {
        timeoutId = window.setTimeout(tick, 500);
      });
    };

    tick();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [timer]);

  const handleCopy = () => {
    const text = notes.join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      className="absolute bottom-[54px] left-0 right-0 z-30 pointer-events-none"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className="mx-4 md:mx-8 rounded-[16px] pointer-events-auto"
        style={{
          background: "rgba(20,20,22,0.92)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <StickyNote className="w-[13px] h-[13px] text-white/20" strokeWidth={1.5} />
            <span
              className="font-['DM_Sans',sans-serif] text-[12px] text-white/25 tracking-[0.4px] uppercase"
              style={FFS}
            >
              Presenter Notes
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              title="Copy notes to clipboard"
              className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
              style={{
                background: copied ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.06)",
                border: copied ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(255,255,255,0.06)",
                color: copied ? "rgb(110, 231, 183)" : "rgba(255,255,255,0.3)",
              }}
            >
              {copied ? <Check className="w-[10px] h-[10px]" strokeWidth={2} /> : <Copy className="w-[10px] h-[10px]" strokeWidth={1.5} />}
            </button>

            {/* Pop-out button */}
            <button
              onClick={onPopOut}
              title="Pop out notes (P) — share screen without showing notes"
              className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <ExternalLink className="w-[10px] h-[10px]" strokeWidth={1.5} />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <X className="w-[10px] h-[10px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Timer Banner (Inline) */}
        {timer && timer.isRunning && (
          <div
            className="flex items-center justify-between px-5 py-2"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(0,0,0,0.2)"
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-['DM_Sans',sans-serif] text-[10px] uppercase text-white/30 tracking-[0.5px]">Overall</span>
              <span className="font-mono text-[13px] text-white/80 tabular-nums">{overallTimeString}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-['DM_Sans',sans-serif] text-[10px] uppercase text-white/30 tracking-[0.5px]">Slide Time</span>
              <span
                className="font-mono text-[13px] tabular-nums transition-colors duration-300"
                style={{
                  color: isSlideOvertime ? "rgb(239, 68, 68)" : isSlideWarning ? "rgb(245, 158, 11)" : "rgba(255,255,255,0.8)"
                }}
              >
                {slideTimeString}
              </span>
            </div>
          </div>
        )}

        {/* Notes body */}
        <div
          className="px-5 py-4 max-h-[280px] overflow-y-auto rounded-b-[16px] pointer-events-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.08) transparent",
            background: [
              "linear-gradient(to bottom, rgba(20,20,22,0.92) 30%, transparent) center top",
              "linear-gradient(to top, rgba(20,20,22,0.92) 30%, transparent) center bottom",
              "radial-gradient(farthest-side at 50% 0, rgba(255,255,255,0.04), transparent) center top",
              "radial-gradient(farthest-side at 50% 100%, rgba(255,255,255,0.04), transparent) center bottom",
            ].join(", "),
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 40px, 100% 40px, 100% 10px, 100% 10px",
            backgroundAttachment: "local, local, scroll, scroll",
          }}
        >
          <ul className="space-y-2.5">
            {notes.map((note, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="font-['DM_Sans',sans-serif] text-[11px] tabular-nums mt-[3px] shrink-0"
                  style={{ ...FFS, color: "rgba(255,255,255,0.15)" }}
                >
                  {i + 1}
                </span>
                <p
                  className="font-['DM_Sans',sans-serif] text-[14px] tracking-[-0.2px] leading-[1.6]"
                  style={{ ...FFS, color: "rgba(255,255,255,0.45)" }}
                >
                  {note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}