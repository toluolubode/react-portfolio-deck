import {
  FFS,
  THEME
} from '../data';
import { StaggerItem } from '../components';

/* ═══════════════════════════════════════════════
   Title Slide
   ═══════════════════════════════════════════════ */
export function TitleSlideContent() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center p-8 lg:p-12"
    >
      <StaggerItem delay={60}>
        <div
          className="relative mb-8"
        >
          <div
            className="absolute inset-[-12px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(52,211,153,0.08) 40%, transparent 100%)",
            }}
          />
          <div
            className="relative rounded-full flex items-center justify-center font-bold text-4xl"
            style={{
              width: "clamp(80px, 15vw, 120px)",
              height: "clamp(80px, 15vw, 120px)",
              background: THEME.primary,
              color: "#fff",
              boxShadow:
                "0 0 0 2px rgba(255,255,255,0.28), 0 24px 48px rgba(0,0,0,0.4)",
            }}
          >
            A
          </div>
        </div>
      </StaggerItem>
      <StaggerItem delay={160}>
        <h1
          className="font-['DM_Sans',sans-serif] text-white tracking-[-2px] leading-[1.1] text-5xl lg:text-7xl mb-6"
          style={{ ...FFS }}
        >
          Your Name
        </h1>
      </StaggerItem>
      <StaggerItem delay={260}>
        <p
          className="font-['DM_Sans',sans-serif] text-white/55 tracking-[-0.5px] leading-[1.5] text-xl lg:text-2xl mb-8"
          style={{ ...FFS }}
        >
          Product Designer &middot; UI Engineer
        </p>
      </StaggerItem>
      <StaggerItem delay={360}>
        <div
          className="flex items-center gap-6"
        >
          {["Company A", "Company B", "Company C"].map((c, i) => (
            <span key={c} className="flex items-center gap-6">
              <span
                className="tracking-[0.8px] uppercase text-white/40 text-xs lg:text-sm"
              >
                {c}
              </span>
              {i < 2 && (
                <span className="block w-[3px] h-[3px] rounded-full bg-white/15" />
              )}
            </span>
          ))}
        </div>
      </StaggerItem>
    </div>
  );
}
