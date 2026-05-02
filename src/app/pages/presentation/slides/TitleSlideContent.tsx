import { motion } from 'motion/react';
import { TOKENS } from '../DesignTokens';
import { StaggerItem } from '../components';

/* ═══════════════════════════════════════════════
   Premium Title Slide
   ═══════════════════════════════════════════════ */
export function TitleSlideContent() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full text-center p-8 lg:p-12 overflow-hidden">
      
      {/* Animated Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${TOKENS.colors.primary}33 0%, transparent 70%)` }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${TOKENS.colors.accent}22 0%, transparent 70%)` }}
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
        />
      </div>

      <StaggerItem delay={100} y={20}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8" style={TOKENS.effects.glass}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-white/40">
            Portfolio Deck v1.0
          </span>
        </div>
      </StaggerItem>

      <StaggerItem delay={200}>
        <h1 className="font-['DM_Sans',sans-serif] text-white tracking-[-4px] leading-[0.95] text-7xl lg:text-9xl mb-6 font-bold">
          Your <span className="text-white/40 italic font-light">Name.</span>
        </h1>
      </StaggerItem>

      <StaggerItem delay={350}>
        <p className="font-['DM_Sans',sans-serif] text-white/60 tracking-[-0.5px] leading-[1.5] text-xl lg:text-2xl max-w-[600px] mx-auto mb-12">
          Crafting digital experiences through <span className="text-white">intentional design</span> and <span className="text-white">precise engineering.</span>
        </p>
      </StaggerItem>

      <StaggerItem delay={500}>
        <div className="flex items-center justify-center gap-8 lg:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           {/* Placeholders for famous logos or just text */}
          {["Linear", "Stripe", "Apple"].map((c) => (
            <span key={c} className="font-['DM_Sans',sans-serif] font-bold text-lg lg:text-xl tracking-tighter text-white">
              {c}
            </span>
          ))}
        </div>
      </StaggerItem>
    </div>
  );
}
