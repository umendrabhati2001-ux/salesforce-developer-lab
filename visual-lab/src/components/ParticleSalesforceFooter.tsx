"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

export const ParticleSalesforceFooter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const mouse = {
      x: -9999,
      y: -9999,
      radius: 120, // repulsion radius in pixels
    };

    const colors = [
      "#00F0FF", // Electric Cyan
      "#0176D3", // Salesforce Blue
      "#00A1E0", // Sky Blue
      "#A855F7", // Purple Accent
      "#FFFFFF", // Bright Glint
    ];

    const initParticles = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      // Height proportional to screen width
      const height = Math.min(260, Math.max(140, Math.floor(width * 0.18)));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Create an offscreen canvas to render text and extract pixel coordinates
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.fillStyle = "#000000";
      offCtx.fillRect(0, 0, width, height);

      // Compute font size to make "SALESFORCE" stretch across width
      // Base font ratio: width / 7.2 roughly fills 90% of screen width
      const fontSize = Math.floor(width / 7.6);
      offCtx.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#FFFFFF";

      // Draw wordmark in the vertical and horizontal center
      offCtx.fillText("SALESFORCE", width / 2, height / 2);

      // Extract pixel data
      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;

      particles = [];

      // Density step: adapt step based on width to keep particle count ~1200-2500 for high 60fps performance
      const step = width < 640 ? 4 : width < 1024 ? 5 : 6;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const brightness = data[index]; // red channel

          if (brightness > 128) {
            // Pick a color biased toward cyan and salesforce blue
            const rand = Math.random();
            let color = colors[0];
            if (rand < 0.45) color = colors[0]; // Cyan
            else if (rand < 0.75) color = colors[1]; // Salesforce Blue
            else if (rand < 0.90) color = colors[2]; // Sky Blue
            else if (rand < 0.97) color = colors[3]; // Purple
            else color = colors[4]; // White glint

            particles.push({
              x: x + (Math.random() - 0.5) * 12, // Slight organic dispersal on load
              y: y + (Math.random() - 0.5) * 12,
              originX: x,
              originY: y,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              color: color,
              size: width < 640 ? 2 : 2.5,
            });
          }
        }
      }
    };

    initParticles();

    // Resize listener with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initParticles();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    // Mouse & Touch interaction handlers
    const updateMousePos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      setIsInteracting(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePos(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      setIsInteracting(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      setIsInteracting(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    // Physics Animation Loop
    const render = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = Math.min(260, Math.max(140, Math.floor(width * 0.18)));

      ctx.clearRect(0, 0, width, height);

      const friction = 0.86; // Drag
      const spring = 0.08;   // Snap back attraction
      const repulsionPower = 18; // Push force away from cursor

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Mouse Repulsion Physics
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Push away from cursor
          p.vx -= Math.cos(angle) * force * repulsionPower;
          p.vy -= Math.sin(angle) * force * repulsionPower;
        }

        // 2. Spring Force returning to origin
        const homeDx = p.originX - p.x;
        const homeDy = p.originY - p.y;
        p.vx += homeDx * spring;
        p.vy += homeDy * spring;

        // 3. Apply friction damping
        p.vx *= friction;
        p.vy *= friction;

        // 4. Update coordinates
        p.x += p.vx;
        p.y += p.vy;

        // 5. Draw Particle
        ctx.fillStyle = p.color;
        // Draw round dots
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-center overflow-hidden cursor-crosshair select-none my-4 py-2"
    >
      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="block mx-auto max-w-full pointer-events-none transition-opacity duration-300"
      />

      {/* Floating Interactive Badge Pill */}
      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 pointer-events-none backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isInteracting ? "bg-pink-400 animate-ping" : "bg-cyan-400 animate-pulse"
          }`}
        />
        <span>
          {isInteracting
            ? "✦ DISPERSING PARTICLES (MOUSE ACTIVE)"
            : "HOVER CURSOR OVER LOGO TO SCATTER PARTICLES"}
        </span>
      </div>
    </div>
  );
};
