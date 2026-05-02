import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { MagnifyingGlassPlus as ZoomIn } from "@phosphor-icons/react/dist/ssr/MagnifyingGlassPlus";
import { CornersOut as Maximize2 } from "@phosphor-icons/react/dist/ssr/CornersOut";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { motion } from 'motion/react';
import { FFS } from "./data";

/* ─── Image zoom context ─── */
export const ImageZoomContext = createContext<(src: string, alt: string, type?: 'image' | 'video') => void>(
  () => { }
);
export function useImageZoom() {
  return useContext(ImageZoomContext);
}

/** Wraps an image to make it tappable for a zoomed lightbox view */
export function ZoomableImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const zoom = useImageZoom();
  return (
    <div
      className="relative group cursor-zoom-in pointer-events-auto"
      onClick={(e) => {
        e.stopPropagation();
        zoom(src, alt);
      }}
    >
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-[inherit] flex items-center justify-center">
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
          }}
        >
          <ZoomIn
            className="w-[18px] h-[18px] text-white/80"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </div>
  );
}

/** Wraps a video to make it tappable for a zoomed lightbox view */
export function ZoomableVideo({
  src,
  className,
  style,
  autoPlay = true,
  loop = true,
  muted = true,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}) {
  const zoom = useImageZoom();
  return (
    <div
      className="relative group cursor-zoom-in pointer-events-auto"
      onClick={(e) => {
        e.stopPropagation();
        zoom(src, "Video", "video");
      }}
    >
      <video
        src={src}
        className={className}
        style={style}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-[inherit] flex items-center justify-center">
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
          }}
        >
          <ZoomIn
            className="w-[18px] h-[18px] text-white/80"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Stagger entrance utility ─── */
export function StaggerItem({
  delay = 0,
  duration = 0.5,
  y = 12,
  children,
  className = "",
  style: extraStyle,
}: {
  delay?: number;
  duration?: number;
  y?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity ${duration}s cubic-bezier(0.25,0.1,0.25,1), transform ${duration}s cubic-bezier(0.25,0.1,0.25,1)`,
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Count-up animation for metrics ─── */
export function CountUp({
  value,
  duration = 1200,
  delay = 0,
}: {
  value: string;
  duration?: number;
  delay?: number;
}) {
  const match = value.match(/^([+\-]?)([\d.]+)(.*)$/);
  if (!match) return <>{value}</>;

  const [prefix, numStr, suffix] = [match[1], match[2], match[3]];
  const target = parseFloat(numStr);
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    let raf: number;
    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(target * eased);
      if (progress < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  const isInt = !numStr.includes(".");
  const display = isInt
    ? Math.round(current)
    : current.toFixed(numStr.split(".")[1]?.length || 0);

  return (
    <>
      {prefix}
      {started ? display : 0}
      {suffix}
    </>
  );
}

/* ─── Touch swipe hook ─── */
const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(
    null
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.t;
      const velocity = Math.abs(dx) / dt;

      if (
        Math.abs(dx) > SWIPE_THRESHOLD &&
        Math.abs(dx) > Math.abs(dy) * 1.5 &&
        velocity > SWIPE_VELOCITY_THRESHOLD
      ) {
        if (dx < 0) onSwipeLeft();
        else onSwipeRight();
      }
      touchStartRef.current = null;
    },
    [onSwipeLeft, onSwipeRight]
  );

  return { onTouchStart, onTouchEnd };
}

/* ─── Premium Figma Embed Modal ─── */
interface FigmaEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  figmaUrl: string;
  title?: string;
  accentColor?: string;
  /** Constrain iframe to mobile viewport width (for responsive Figma Sites URLs) */
  mobileFirst?: boolean;
}

export function FigmaEmbedModal({
  isOpen,
  onClose,
  figmaUrl,
  title = "Figma Prototype",
  accentColor = "#9382DC",
  mobileFirst = false,
}: FigmaEmbedModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Convert raw figma.com/design/... links to proper embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("figma.com/embed")) return url;
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
  };
  const finalFigmaUrl = getEmbedUrl(figmaUrl);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 lg:p-12"
      initial={false}
      animate={isOpen ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, transitionEnd: { pointerEvents: "none" } }}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      />

      {/* Modal Container */}
      <motion.div
        className={`relative flex flex-col bg-[#0A0A0A] rounded-[20px] overflow-hidden ${mobileFirst ? "w-[420px] h-full max-h-[90vh]" : "w-full h-full max-w-[1400px]"
          }`}
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.5)',
        }}
        initial={false}
        animate={{ scale: isOpen ? 1 : 0.95, y: isOpen ? 0 : 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: `${accentColor.replace(/[\d.]+\)$/, "0.15)") || `${accentColor}26`}` }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: accentColor }} />
            </div>
            <span className="font-['DM_Sans',sans-serif] font-medium text-[17px] text-white/80 tracking-[-0.2px]">
              {title}
            </span>
          </div>
          <motion.button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4 text-white/60" />
          </motion.button>
        </div>

        <div className="flex-1 relative bg-[#0f0f0f] flex items-center justify-center">
          {finalFigmaUrl ? (
            <iframe
              src={finalFigmaUrl}
              className="w-full h-full border-0 absolute inset-0"
              title={`Figma prototype — ${title}`}
              allowFullScreen
            />
          ) : (
            <div className="text-white/30 text-[17px]" style={FFS}>
              Figma URL not provided yet.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Reusable Desktop Figma Embed Trigger ─── */
interface FigmaEmbedTriggerProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function FigmaEmbedTrigger({ onClick, label = "Explore Prototype", className = "mt-5 lg:mt-8" }: FigmaEmbedTriggerProps) {
  return (
    <div className={`${className} pointer-events-auto shrink-0 shimmer-border-wrap w-full max-w-[420px]`}>
      <motion.button
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onClick();
        }}
        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 group"
        style={{ background: "rgba(255,255,255,0.05)" }}
        whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.12)" } as any}
        whileTap={{ scale: 0.98 }}
      >
        <Maximize2 className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
        <span className="text-[16px] font-medium text-white/60 group-hover:text-white/80 tracking-[-0.1px]" style={FFS}>
          {label}
        </span>
      </motion.button>
    </div>
  );
}