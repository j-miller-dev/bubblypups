import React, { useEffect, useState } from 'react';

interface BubbleProps {
  className?: string;
}

// Individual bubble component
const Bubble: React.FC<{ size: number; left: number; animationDuration: number; delay: number; color: string; drift: number }> = ({
  size,
  left,
  animationDuration,
  delay,
  color,
  drift,
}) => {
  // Generate unique animation name for this bubble
  const animationName = `float-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      <style>
        {`
          @keyframes ${animationName} {
            0% {
              transform: translate(0, 0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translate(${drift}px, -100vh);
              opacity: 0;
            }
          }
        `}
      </style>
      <div
        className="absolute rounded-full backdrop-blur-sm"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          bottom: '-100px',
          backgroundColor: color,
          animation: `${animationName} ${animationDuration}s ease-in-out infinite ${delay}s`,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05) inset',
        }}
      />
    </>
  );
};

export const Bubbles: React.FC<BubbleProps> = ({ className = '' }) => {
  const [bubbles, setBubbles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Generate random bubbles with varied properties
    const newBubbles = Array.from({ length: 36 }, (_, i) => {
      // More varied size range
      const size = Math.random() * 70 + 15; // 15px - 85px
      const left = Math.random() * 100; // 0% - 100%

      // More varied speed range
      const animationDuration = Math.random() * 12 + 8; // 8s - 20s

      // First 52% (19 bubbles) appear quickly like machine just started
      // Remaining bubbles appear at normal rate
      const isFirstBatch = i < 19;
      const delay = isFirstBatch
        ? Math.random() * 1.2  // 0s - 1.2s for intense burst
        : Math.random() * 8 + 1.2; // 1.2s - 9.2s for normal flow

      // Drift left or right (-80px to +80px)
      const drift = (Math.random() - 0.5) * 160; // Random drift between -80 and +80

      // Light pastel palette: pinks, purples, blues
      const palette = [
        'rgba(255, 182, 193, 0.55)', // LightPink
        'rgba(255, 192, 203, 0.55)', // Pink
        'rgba(221, 160, 221, 0.55)', // Plum
        'rgba(216, 191, 216, 0.55)', // Thistle
        'rgba(230, 230, 250, 0.55)', // Lavender
        'rgba(173, 216, 230, 0.55)', // LightBlue
        'rgba(176, 196, 222, 0.55)', // LightSteelBlue
        'rgba(224, 176, 255, 0.55)', // Mauve
        'rgba(188, 212, 230, 0.55)', // Pale Blue
        'rgba(243, 197, 220, 0.55)', // Pastel Pink
      ];
      const color = palette[Math.floor(Math.random() * palette.length)];

      return (
        <Bubble
          key={i}
          size={size}
          left={left}
          animationDuration={animationDuration}
          delay={delay}
          color={color}
          drift={drift}
        />
      );
    });

    setBubbles(newBubbles);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {bubbles}
    </div>
  );
};
