'use client';
import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
      }
    };
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input, [role="button"]')) setIsHovering(true);
    };
    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, input, [role="button"]')) setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 w-8 h-8 border-2 border-white rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-200 ease-out ${
        isHovering ? 'scale-[2.5] bg-white' : 'scale-100 bg-transparent'
      }`}
    />
  );
};

export default CustomCursor;
