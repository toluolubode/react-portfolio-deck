import {
  FFS,
  THEME
} from '../data';
import { StaggerItem, CountUp } from '../components';
import { Lightning as Zap } from "@phosphor-icons/react/dist/ssr/Lightning";

/* ═══════════════════════════════════════════════
   Results Slide
   ═══════════════════════════════════════════════ */
export function ResultsSlideContent() {
  const color = THEME.primary;

  const heroCards = [
    { label: "Increase in conversion", value: "+42%" },
    { label: "Reduction in drop-off", value: "-15%" },
    { label: "User satisfaction", value: "98%" }
  ];

  return (
    <div
      className="flex flex-col mx-auto w-full max-w-[1200px] p-8 lg:p-12"
    >
      <StaggerItem delay={60}>
        <span
          className="tracking-[0.8px] uppercase block mb-6 text-sm"
          style={{ color }}
        >
          Results
        </span>
      </StaggerItem>
      <StaggerItem delay={150}>
        <h2
          className="font-['DM_Sans',sans-serif] text-white tracking-[-1.5px] leading-[1.1] max-w-[900px] text-4xl lg:text-6xl mb-8"
          style={{ ...FFS }}
        >
          The impact of the new design
        </h2>
      </StaggerItem>

      <div className="flex flex-col w-full gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {heroCards.map((card, ci) => (
            <StaggerItem key={card.label} delay={260 + ci * 70} className="w-full h-full">
              <div
                className="rounded-[14px] flex flex-col items-center justify-center text-center h-full w-full p-8"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <div className="w-full relative flex items-center justify-center min-h-[50px] mb-2 px-1">
                  <span
                    className="font-['DM_Sans',sans-serif] tracking-[-1.5px] leading-none block break-words text-4xl lg:text-5xl"
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      wordBreak: "break-word",
                      hyphens: "auto",
                      ...FFS,
                    }}
                  >
                    <CountUp value={card.value} delay={340 + ci * 70} duration={1000} />
                  </span>
                </div>
                <span
                  className="font-['DM_Sans',sans-serif] tracking-[-0.1px] leading-[1.3] text-balance px-2 text-sm"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    ...FFS,
                  }}
                >
                  {card.label}
                </span>
              </div>
            </StaggerItem>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col mt-8 gap-6"
      >
        <StaggerItem delay={500}>
          <div
            className="rounded-[14px] px-6 py-5 flex items-start gap-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "rgba(200, 230, 100, 0.08)" }}
            >
              <Zap size={14} style={{ color: "rgba(200, 230, 100, 0.6)" }} />
            </div>
            <div>
              <p
                className="font-['DM_Sans',sans-serif] text-white/90 tracking-[-0.2px] leading-[1.5] text-lg"
                style={{ ...FFS }}
              >
                Beyond metrics, we established a reusable pattern for the entire design system, speeding up future feature development.
              </p>
            </div>
          </div>
        </StaggerItem>
      </div >
    </div >
  );
}
