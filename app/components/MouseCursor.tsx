'use client';

import { useEffect, useState } from 'react';

export function MouseCursor() {
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    // Detect touch device and exit early if touch is supported
    const isTouchDevice = () => {
      return (
        typeof window !== 'undefined' &&
        ('ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0)
      );
    };

    if (isTouchDevice()) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Create trail star
      if (Math.random() > 0.7) {
        const id = Math.random();
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;

        setTrails((prev) => [...prev, { id, x: e.clientX + offsetX, y: e.clientY + offsetY }]);

        // Remove trail after animation
        setTimeout(() => {
          setTrails((prev) => prev.filter((trail) => trail.id !== id));
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes starTrail {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) rotate(360deg);
          }
        }

        .star-trail {
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          animation: starTrail 1s ease-out forwards;
        }
      `}</style>

      {/* Trail Stars */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="star-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 1L20.59 11.41H31.36L22.76 17.39L27.35 27.8L16 21.82L4.65 27.8L9.24 17.39L0.64 11.41H11.41L16 1Z"
              fill="#ff9e68"
            />
          </svg>
        </div>
      ))}
    </>
  );
}
