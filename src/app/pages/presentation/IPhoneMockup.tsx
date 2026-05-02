import React from "react";

/**
 * Minimal iPhone mockup — clean bezel frame sized to match the screenshot.
 * The screen area matches the image aspect ratio so there's zero gap.
 */

interface IPhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  width?: number;
  /** Screen aspect ratio (height / width). Default 812/375 for iPhone X-class screens. */
  screenRatio?: number;
  frameColor?: string;
}

export function IPhoneMockup({
  children,
  className = "",
  width = 260,
  screenRatio = 812 / 375,
  frameColor = "#1c1c1e",
}: IPhoneMockupProps) {
  const bezel = 6;
  const outerRadius = 36;
  const innerRadius = outerRadius - bezel;
  const screenWidth = width - bezel * 2;
  const screenHeight = Math.round(screenWidth * screenRatio);
  const height = screenHeight + bezel * 2;

  return (
    <div
      className={`relative inline-flex flex-shrink-0 ${className}`}
      style={{ width, height }}
    >
      {/* Outer shell */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: outerRadius,
          background: `linear-gradient(160deg, #2a2a2c 0%, ${frameColor} 40%, #111 100%)`,
          boxShadow: `
            0 0 0 0.5px rgba(255,255,255,0.1),
            inset 0 0 0 0.5px rgba(255,255,255,0.04),
            0 16px 48px rgba(0,0,0,0.55),
            0 4px 12px rgba(0,0,0,0.3)
          `,
        }}
      />

      {/* Screen */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: bezel,
          left: bezel,
          width: screenWidth,
          height: screenHeight,
          borderRadius: innerRadius,
          background: "#000",
        }}
      >
        {children}
      </div>
    </div>
  );
}
