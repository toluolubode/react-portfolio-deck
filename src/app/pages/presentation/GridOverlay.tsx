import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SquaresFour as Grid3X3 } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import { X } from "@phosphor-icons/react/dist/ssr/X";

import type { SlideConfig } from "./deck-builder";
import { FFS } from "./data";

export function GridOverlay({
  slides,
  current,
  onSelect,
  onClose,
  hiddenSlides,
  onToggleHidden,
  onReorderSlides,
}: {
  slides: SlideConfig[];
  current: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  hiddenSlides: Set<string>;
  onToggleHidden: (id: string, e: React.MouseEvent) => void;
  onReorderSlides: (slides: SlideConfig[]) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [orderedSlides, setOrderedSlides] = useState<SlideConfig[]>(slides);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const orderedSlidesRef = useRef<SlideConfig[]>(slides);

  useEffect(() => {
    setOrderedSlides(slides);
  }, [slides]);

  useEffect(() => {
    orderedSlidesRef.current = orderedSlides;
  }, [orderedSlides, orderedSlidesRef]);

  useEffect(() => {
    const el = gridRef.current?.querySelector(`[data-slide-index="${current}"]`);
    el?.scrollIntoView({ block: "center", behavior: "instant" });
  }, [current]);

  const handleDragStart = (id: string) => {
    if (slides.length < 2) return;
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;

    setOrderedSlides((prev) => {
      const currentIndex = prev.findIndex((s) => s.id === draggingId);
      const targetIndex = prev.findIndex((s) => s.id === targetId);
      if (currentIndex === -1 || targetIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(currentIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const finalizeReorder = () => {
    if (!draggingId) return;
    setDraggingId(null);
    const next = orderedSlidesRef.current || orderedSlides;
    if (next && next.length) {
      onReorderSlides(next);
    }
  };

  const handleDrop = () => finalizeReorder();
  const handleDragEnd = () => finalizeReorder();

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(20px)" }}
        onClick={onClose}
      />

      <div className="relative z-10 flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <Grid3X3 className="w-[14px] h-[14px] text-white/30" strokeWidth={1.5} />
          <span className="font-['DM_Sans',sans-serif] text-[13px] text-white/30 tracking-[-0.1px]" style={FFS}>
            Slide Overview
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close Slide Overview"
          className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 relative outline-none focus-visible:ring-2 focus-visible:ring-white/50 before:absolute before:-inset-2 before:content-['']"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
        >
          <X className="w-[14px] h-[14px]" strokeWidth={1.5} />
        </button>
      </div>

      <div ref={gridRef} className="relative z-10 flex-1 overflow-y-auto px-6 pb-8" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 content-start">
          {orderedSlides.map((slide, index) => {
            const isActive = slide.id === slides[current]?.id;
            const isHidden = hiddenSlides.has(slide.id);
            const isDragging = draggingId === slide.id;
            
            // Format slide id as label
            const label = slide.id.charAt(0).toUpperCase() + slide.id.slice(1).replace(/-/g, ' ');

            return (
              <div key={slide.id} className="contents">
                <motion.div
                  className="relative group"
                  layout
                  layoutId={slide.id}
                  initial={false}
                  animate={{ opacity: isDragging ? 0 : 1, scale: isDragging ? 0.9 : 1, zIndex: isDragging ? 50 : 1 }}
                  transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.2 }, scale: { duration: 0.2 } }}
                  whileHover={!isDragging ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isDragging ? { scale: 0.98 } : {}}
                  draggable={slides.length > 1}
                  onDragStart={(e) => {
                    const dragEvent = e as unknown as React.DragEvent;
                    handleDragStart(slide.id);
                    if (dragEvent.dataTransfer) dragEvent.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent<HTMLDivElement>, slide.id)}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  style={{ touchAction: "none" }}
                >
                  <button
                    data-slide-index={index}
                    onClick={() => onSelect(index)}
                    aria-label={`Go to slide ${index + 1}: ${label}`}
                    className={`w-full h-full flex flex-col rounded-[10px] overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161618] ${isHidden ? "opacity-40 grayscale" : ""}`}
                    style={{
                      background: isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                      border: isActive ? "1.5px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: isActive ? "0 0 0 2px rgba(52,211,153,0.15), 0 8px 16px -4px rgba(0,0,0,0.4)" : "0 4px 12px -2px rgba(0,0,0,0.2)",
                      minHeight: "100px"
                    }}
                  >
                    <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span className="font-['DM_Sans',sans-serif] text-[11px] tabular-nums" style={{ color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)", ...FFS }}>{index + 1}</span>
                      {isActive && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-[5px] h-[5px] rounded-full bg-emerald-400" style={{ boxShadow: "0 0 8px rgba(52,211,153,0.4)" }} />
                          <span className="text-[9px] uppercase tracking-wider text-emerald-400/60 font-medium">Active</span>
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-3 pr-8 relative">
                      <span className="font-['DM_Sans',sans-serif] text-[12px] tracking-[-0.1px] leading-[1.35] line-clamp-2" style={{ color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)", ...FFS }}>{label}</span>
                      {isHidden && <div className="absolute top-0 right-0 p-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500/50" /></div>}
                    </div>
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleHidden(slide.id, e); }}
                    aria-label={isHidden ? "Unhide slide" : "Hide slide"}
                    className={`absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center rounded-md transition-all z-10 outline-none focus-visible:ring-2 focus-visible:ring-red-400 before:absolute before:-inset-3 before:content-[''] ${isHidden ? "opacity-100 bg-red-500/20 text-red-400" : "opacity-0 group-hover:opacity-100 bg-black/40 text-white/40 hover:text-white/80 hover:bg-black/80"}`}
                  >
                    {isHidden ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center px-6 py-3 shrink-0">
        <span className="text-[11px] text-white/15 tracking-[-0.1px]">
          Click a slide to jump &middot; Press <kbd className="px-1.5 py-0.5 rounded mx-0.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>G</kbd> or <kbd className="px-1.5 py-0.5 rounded mx-0.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>Esc</kbd> to close
        </span>
      </div>
    </motion.div>
  );
}
