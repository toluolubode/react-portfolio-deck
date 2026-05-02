import {
  FFS,
  THEME
} from '../data';
import { StaggerItem } from '../components';

/* ═══════════════════════════════════════════════
   Transition Slide
   ═══════════════════════════════════════════════ */
export function TransitionSlideContent() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center p-8 lg:p-12 w-full max-w-[900px] mx-auto"
    >
      <StaggerItem delay={60}>
        <span
          className="tracking-[0.8px] uppercase block mb-6 text-sm"
          style={{ color: THEME.primary }}
        >
          The Problem
        </span>
      </StaggerItem>
      <StaggerItem delay={160}>
        <h2
          className="font-['DM_Sans',sans-serif] text-white tracking-[-1.5px] leading-[1.1] text-4xl lg:text-6xl text-balance"
          style={{ ...FFS }}
        >
          Users were getting stuck during the onboarding flow.
        </h2>
      </StaggerItem>
      <StaggerItem delay={260}>
        <p className="mt-8 text-white/50 text-xl lg:text-2xl font-['DM_Sans',sans-serif] tracking-[-0.5px] text-balance" style={FFS}>
          We needed to rethink the core interaction model to reduce cognitive load.
        </p>
      </StaggerItem>
    </div>
  );
}
