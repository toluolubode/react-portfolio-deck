import { useState } from 'react';
import {
  FFS,
  THEME
} from '../data';
import { StaggerItem, CountUp, FigmaEmbedTrigger, FigmaEmbedModal } from '../components';

/* ═══════════════════════════════════════════════
   Project Intro Slide
   ═══════════════════════════════════════════════ */
export function ProjectIntroSlideContent() {
  const [showFigma, setShowFigma] = useState(false);
  const color = THEME.primary;

  return (
    <div
      className="flex flex-col lg:flex-row items-center justify-center h-full mx-auto w-full max-w-[1400px] p-8 lg:p-12 gap-12"
    >
      <div className="flex-1 max-w-[560px] flex flex-col justify-center">
        <StaggerItem delay={60}>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="tracking-[0.8px] uppercase px-3 py-1 rounded-full font-medium"
              style={{
                background: `linear-gradient(to bottom, ${color}28, ${color}18)`,
                color: color,
                border: `1px solid ${color}30`,
                fontSize: "12px",
              }}
            >
              COMPANY NAME
            </span>
            <span
              className="tracking-[0.5px] uppercase px-3 py-1 rounded-full font-medium"
              style={{
                background: "linear-gradient(to bottom, rgba(200, 230, 100, 0.12), rgba(200, 230, 100, 0.06))",
                color: "rgba(200, 230, 100, 0.6)",
                border: "1px solid rgba(200, 230, 100, 0.15)",
                fontSize: "12px",
              }}
            >
              Project Tag
            </span>
          </div>
        </StaggerItem>
        <StaggerItem delay={160}>
          <h2
            className="font-['DM_Sans',sans-serif] text-white tracking-[-1.5px] leading-[1.1] text-4xl lg:text-6xl mb-8"
            style={{ ...FFS }}
          >
            A high-impact project title goes here
          </h2>
        </StaggerItem>
        <StaggerItem delay={260}>
          <div
            className="flex flex-wrap gap-x-6 gap-y-2 text-white/50 tracking-[-0.2px] text-sm"
          >
            <span>
              <span className="text-white/45">Role</span>{" "}
              <span className="text-white/70">Lead Product Designer</span>
            </span>
            <span>
              <span className="text-white/45">Timeline</span>{" "}
              <span className="text-white/70">6 Months</span>
            </span>
          </div>
        </StaggerItem>
        
        <StaggerItem delay={320}>
          <FigmaEmbedTrigger 
            onClick={() => setShowFigma(true)} 
            label="View Figma Prototype" 
            className="mt-8"
          />
        </StaggerItem>
      </div>

      <StaggerItem delay={300} y={16} duration={0.6}>
        <div className="flex flex-col items-center gap-6">
          <div
            className="rounded-[20px] px-12 py-10 flex flex-col items-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span
              className="font-['DM_Sans',sans-serif] text-white tracking-[-2px] leading-[1]"
              style={{ ...FFS, fontSize: "clamp(3.5rem, 8vw, 6rem)" }}
            >
              <CountUp value="+42%" delay={380} duration={1200} />
            </span>
            <span
              className="font-['DM_Sans',sans-serif] text-white/55 tracking-[-0.2px] mt-2 text-lg"
              style={{ ...FFS }}
            >
              Conversion Increase
            </span>
          </div>
        </div>
      </StaggerItem>
      
      <FigmaEmbedModal 
        isOpen={showFigma} 
        onClose={() => setShowFigma(false)} 
        figmaUrl="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fcommunity%2Ffile%2F1126154674720961845"
        title="Generic Prototype" 
        accentColor={color} 
      />
    </div>
  );
}
