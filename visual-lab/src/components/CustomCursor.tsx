"use client";

import React, { useEffect, useRef, useState } from "react";

export const CustomCursor: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if on touch device
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -100;
    let mouseY = -100;
    let animId: number;

    // Smooth trailing physics points for modern laser line
    const points: { x: number; y: number; age: number }[] = [];
    const maxPoints = 20;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant hardware-accelerated movement for dot & spotlight
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Check if hovering clickable
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.closest("a") !== null ||
          target.closest("button") !== null ||
          target.closest("[role='button']") !== null ||
          target.closest("input") !== null ||
          target.closest(".clickable") !== null;
        setIsHovered(isInteractive);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      points.length = 0;
    };

    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Modern 60fps Laser Ribbon Render Loop (Zero Bouncing, Pure Fluidity)
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isVisible && mouseX > 0 && mouseY > 0) {
        points.unshift({ x: mouseX, y: mouseY, age: 0 });
        if (points.length > maxPoints) {
          points.pop();
        }

        // Draw fluid glowing cyber laser trail
        if (points.length > 2) {
          for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            p1.age += 1;

            const progress = 1 - i / points.length;
            const alpha = Math.max(0, progress * 0.75);
            const lineWidth = Math.max(0.5, progress * 3.5);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Gradient from Electric Cyan to Salesforce Blue
            ctx.strokeStyle = i < 6 
              ? `rgba(0, 240, 255, ${alpha})` 
              : `rgba(1, 118, 211, ${alpha * 0.7})`;
            ctx.lineWidth = isHovered ? lineWidth * 1.5 : lineWidth;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible, isHovered]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 1. Trending 2026 Cyber Spotlight: Ambient illumination following cursor */}
      <div
        ref={spotlightRef}
        style={{ willChange: "transform" }}
        className="fixed top-0 left-0 w-[550px] h-[550px] rounded-full bg-radial-spotlight pointer-events-none opacity-40 transition-opacity duration-500"
      />

      {/* 2. Fullscreen GPU Canvas for Smooth Cyber Laser Trail (No Rubber-Banding) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
      />

      {/* 3. Ultra-Crisp High-Precision Laser Core Dot */}
      <div
        ref={dotRef}
        style={{ willChange: "transform" }}
        className={`fixed top-0 left-0 rounded-full pointer-events-none transition-all duration-150 ${
          isHovered
            ? "w-3 h-3 bg-[#00F0FF] shadow-[0_0_15px_#00F0FF,0_0_30px_#0176D3] ring-4 ring-[#00F0FF]/25"
            : "w-2 h-2 bg-white shadow-[0_0_10px_#00F0FF,0_0_20px_#00F0FF]"
        }`}
      />
    </div>
  );
};
