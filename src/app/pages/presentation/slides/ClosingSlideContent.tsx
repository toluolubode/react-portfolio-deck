import {
  FFS,
} from '../data';
import { StaggerItem } from '../components';

/* ═══════════════════════════════════════════════
   Closing Slide
   ═══════════════════════════════════════════════ */
export function ClosingSlideContent() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center p-8 lg:p-12"
    >
      <StaggerItem delay={60}>
        <h2
          className="font-['DM_Sans',sans-serif] text-white tracking-[-2px] leading-[1.1] text-5xl lg:text-7xl mb-8"
          style={{ ...FFS }}
        >
          Thank you!
        </h2>
      </StaggerItem>
      <StaggerItem delay={160}>
        <p
          className="font-['DM_Sans',sans-serif] text-white/55 tracking-[-0.5px] leading-[1.5] text-xl lg:text-2xl"
          style={{ ...FFS }}
        >
          Questions?
        </p>
      </StaggerItem>
    </div>
  );
}
