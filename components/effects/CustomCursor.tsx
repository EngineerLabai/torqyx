'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);

  useEffect(() => {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) return;
    Promise.resolve().then(() => setEnabled(true));

    const updateCursor = () => {
      if (!cursorRef.current) return;
      const { x, y } = positionRef.current;
      cursorRef.current.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
      rafRef.current = null;
    };

    const handleMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      const target = e.target as HTMLElement;
      const hovering =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null;
      if (hoverRef.current !== hovering) {
        hoverRef.current = hovering;
        setIsHovering(hovering);
      }
      if (rafRef.current == null) {
        rafRef.current = window.requestAnimationFrame(updateCursor);
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[50]"
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
