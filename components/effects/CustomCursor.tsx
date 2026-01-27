'use client';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) return;
    Promise.resolve().then(() => setEnabled(true));

    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') !== null ||
          target.closest('button') !== null,
      );
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[50]"
      style={{
        transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-green-500/50 transition-all duration-300 ease-out ${
          isHovering ? 'scale-150 border-2 border-green-400 bg-green-500/10' : 'scale-100'
        }`}
      >
        <div className="h-1 w-1 rounded-full bg-green-500 opacity-50" />
      </div>
    </div>
  );
}
