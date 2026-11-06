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

    // Tighter, smaller cursor interaction radius (55px instead of 120px)
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 55,
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

      // Compute font size to make "SALESFORCE" stretch gracefully across width
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

      // Step grid for high performance and smooth dot density
      const step = width < 640 ? 4 : width < 1024 ? 5 : 6;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const brightness = data[index]; // red channel

          if (brightness > 128) {
            const rand = Math.random();
            let color = colors[0];
            if (rand < 0.45) color = colors[0]; // Cyan
            else if (rand < 0.75) color = colors[1]; // Salesforce Blue
            else if (rand < 0.90) color = colors[2]; // Sky Blue
            else if (rand < 0.97) color = colors[3]; // Purple
            else color = colors[4]; // White glint

            particles.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
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

    // Silky Smooth Physics Animation Loop
    const render = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = Math.min(260, Math.max(140, Math.floor(width * 0.18)));

      ctx.clearRect(0, 0, width, height);

      // Fine-tuned for gentle, fluid, slow organic motion
      const friction = 0.91;      // Gliding damping (was 0.86)
      const spring = 0.035;       // Gentle organic spring return (was 0.08)
      const repulsionPower = 4.2; // Soft, slow push (was 18 - 4x softer and smoother!)
      const maxSpeed = 6.0;       // Velocity limiter prevents harsh sudden jumps

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Mouse Repulsion Physics
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Gentle push away from cursor
          p.vx -= Math.cos(angle) * force * repulsionPower;
          p.vy -= Math.sin(angle) * force * repulsionPower;
        }

        // 2. Spring Force returning smoothly to origin
        const homeDx = p.originX - p.x;
        const homeDy = p.originY - p.y;
        p.vx += homeDx * spring;
        p.vy += homeDy * spring;

        // 3. Apply friction damping
        p.vx *= friction;
        p.vy *= friction;

        // 4. Velocity clamp for smooth floating motion
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // 5. Update coordinates
        p.x += p.vx;
        p.y += p.vy;

        // 6. Draw Particle dot
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Subtle interactive cursor aura (shows the small, focused touch zone)
      if (mouse.x > 0 && mouse.y > 0 && mouse.x < width && mouse.y < height) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
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
