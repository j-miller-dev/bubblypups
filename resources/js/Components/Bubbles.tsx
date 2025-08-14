import React, { useEffect, useState } from 'react';

interface BubbleProps {
  className?: string;
}

// Individual bubble component
const Bubble: React.FC<{ size: number; left: number; animationDuration: number; delay: number; color: string }> = ({
  size,
  left,
  animationDuration,
  delay,
  color,
}) => {
  return (
    <div
      className="absolute rounded-full backdrop-blur-sm"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        bottom: '-100px',
        backgroundColor: color,
        animation: `float ${animationDuration}s ease-in infinite ${delay}s`,
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05) inset',
      }}
    />
  );
};

export const Bubbles: React.FC<BubbleProps> = ({ className = '' }) => {
  const [bubbles, setBubbles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Create CSS animation once on component mount
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% {
          transform: translateY(0);
          opacity: 0;
        }
        10% {
          opacity: 0.8;
        }
        100% {
          transform: translateY(-100vh);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Generate random bubbles
    const newBubbles = Array.from({ length: 18 }, (_, i) => {
      const size = Math.random() * 60 + 20; // 20px - 80px
      const left = Math.random() * 100; // 0% - 100%
      const animationDuration = Math.random() * 10 + 10; // 10s - 20s
      const delay = Math.random() * 15; // 0s - 15s

      // Light pastel palette: pinks, purples, blues
      const palette = [
        'rgba(255, 182, 193, 0.35)', // LightPink
        'rgba(255, 192, 203, 0.35)', // Pink
        'rgba(221, 160, 221, 0.35)', // Plum
        'rgba(216, 191, 216, 0.35)', // Thistle
        'rgba(230, 230, 250, 0.35)', // Lavender
        'rgba(173, 216, 230, 0.35)', // LightBlue
        'rgba(176, 196, 222, 0.35)', // LightSteelBlue
        'rgba(224, 176, 255, 0.35)', // Mauve
        'rgba(188, 212, 230, 0.35)', // Pale Blue
        'rgba(243, 197, 220, 0.35)', // Pastel Pink
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
        />
      );
    });

    setBubbles(newBubbles);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {bubbles}
    </div>
  );
};
