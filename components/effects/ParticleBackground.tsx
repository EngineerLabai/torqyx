"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

const createParticle = (width: number, height: number): Particle => ({
  x: Math.random() * width,
  y: Math.random() * height,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.3,
  size: Math.random() * 2 + 1,
});

const updateParticle = (particle: Particle, width: number, height: number) => {
  particle.x += particle.vx;
  particle.y += particle.vy;

  if (particle.x < 0 || particle.x > width) particle.vx *= -1;
  if (particle.y < 0 || particle.y > height) particle.vy *= -1;
};

const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
  ctx.fillStyle = "rgba(34, 211, 238, 0.5)";
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();
};

const getSettings = (width: number) => {
  const isMobile = width < 640;
  return {
    particleCount: isMobile ? 24 : 42,
    connectionDistance: isMobile ? 100 : 135,
  };
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];
    let settings = getSettings(width);

    const init = () => {
      canvas.width = width;
      canvas.height = height;
      particles = Array.from({ length: settings.particleCount }, () => createParticle(width, height));
    };

    const animate = () => {
      if (document.visibilityState === "hidden") {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        updateParticle(particle, width, height);
        drawParticle(ctx, particle);

        for (let j = i + 1; j < particles.length; j += 1) {
          const next = particles[j];
          const dx = particle.x - next.x;
          const dy = particle.y - next.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= settings.connectionDistance) continue;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(34, 211, 238, ${1 - dist / settings.connectionDistance})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
      }

      frameId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      settings = getSettings(width);
      init();
    };

    window.addEventListener("resize", handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed left-0 top-0 -z-10 h-full w-full bg-neutral-950 pointer-events-none" />;
}
