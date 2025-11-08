import React, { useEffect, useRef, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface MobileNavBubblesProps {
  navRefs: React.RefObject<HTMLElement>[];
}

export const MobileNavBubbles: React.FC<MobileNavBubblesProps> = ({ navRefs }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const animationFrameRef = useRef<number>();
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize bubbles
    const initialBubbles: Bubble[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 1, // Slight upward bias
      size: Math.random() * 40 + 20, // 20px - 60px
    }));

    setBubbles(initialBubbles);

    const animate = () => {
      setBubbles((prevBubbles) => {
        return prevBubbles.map((bubble) => {
          let { x, y, vx, vy, size } = bubble;

          // Update position
          x += vx;
          y += vy;

          // Wrap around screen edges
          if (x < -size) x = window.innerWidth + size;
          if (x > window.innerWidth + size) x = -size;
          if (y < -size) y = window.innerHeight + size;
          if (y > window.innerHeight + size) y = -size;

          // Check collision with nav items
          let collided = false;
          navRefs.forEach((ref) => {
            if (ref.current) {
              const rect = ref.current.getBoundingClientRect();
              const bubbleRadius = size / 2;

              // Check if bubble intersects with nav text
              if (
                x + bubbleRadius > rect.left &&
                x - bubbleRadius < rect.right &&
                y + bubbleRadius > rect.top &&
                y - bubbleRadius < rect.bottom
              ) {
                collided = true;

                // Calculate direction away from text center
                const textCenterX = rect.left + rect.width / 2;
                const textCenterY = rect.top + rect.height / 2;

                const dx = x - textCenterX;
                const dy = y - textCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0) {
                  // Normalize and apply bounce
                  vx = (dx / distance) * 3;
                  vy = (dy / distance) * 3;
                }
              }
            }
          });

          // If no collision, apply gentle floating behavior
          if (!collided) {
            // Add slight randomness to movement
            vx += (Math.random() - 0.5) * 0.1;
            vy += (Math.random() - 0.5) * 0.1 - 0.05; // Slight upward drift

            // Limit speed
            const speed = Math.sqrt(vx * vx + vy * vy);
            if (speed > 2) {
              vx = (vx / speed) * 2;
              vy = (vy / speed) * 2;
            }
          }

          return { ...bubble, x, y, vx, vy };
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [navRefs]);

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full border-2 border-white"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.6,
            transition: 'opacity 0.3s ease',
          }}
        />
      ))}
    </div>
  );
};