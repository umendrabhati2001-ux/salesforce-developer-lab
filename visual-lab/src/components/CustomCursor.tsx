"use client";

import React, { useEffect, useRef, useState } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const CustomCursor: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Check if on touch device
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let animId: number;

    // Laser trail ribbon points
    const points: { x: number; y: number }[] = [];
    const maxPoints = 24;

    // Laser sparks & ripples
    const sparks: Spark[] = [];
    const ripples: Ripple[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const onMouseMove = (e: MouseEvent) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const speed = Math.hypot(dx, dy);

      // Hardware accelerated transform on core dot & reticle
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Spawn laser micro-sparks on fast movements
      if (speed > 7 && sparks.length < 35) {
        const count = Math.min(3, Math.floor(speed / 8));
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const sparkSpeed = Math.random() * 2 + 0.8;
          sparks.push({
            x: mouseX + (Math.random() - 0.5) * 6,
            y: mouseY + (Math.random() - 0.5) * 6,
            vx: Math.cos(angle) * sparkSpeed - dx * 0.1,
            vy: Math.sin(angle) * sparkSpeed - dy * 0.1,
            size: Math.random() * 2 + 1,
            alpha: 1,
            color: Math.random() > 0.4 ? "#00F0FF" : "#FFFFFF",
          });
        }
      }

      // Check if hovering clickable element
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

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Spawn expanding laser shockwave ring
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius: 55,
        alpha: 1,
      });

      // Burst of laser sparks
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.3;
        const sparkSpeed = Math.random() * 3.5 + 1.5;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * sparkSpeed,
          vy: Math.sin(angle) * sparkSpeed,
          size: Math.random() * 2.5 + 1.2,
          alpha: 1,
          color: i % 2 === 0 ? "#00F0FF" : "#38BDF8",
        });
      }
    };

    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => {
      setIsVisible(false);
      points.length = 0;
    };
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // High-Octane 60fps Multi-Pass Cyber Laser Engine
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouseX > 0 && mouseY > 0) {
        points.unshift({ x: mouseX, y: mouseY });
        if (points.length > maxPoints) {
          points.pop();
        }

        // ==========================================
        // 1. DUAL-PASS HIGH VOLTAGE LASER RIBBON
        // ==========================================
        if (points.length > 2) {
          // PASS A: Broad Neon Photonic Glow
          ctx.save();
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const progress = 1 - i / points.length;
            const alpha = Math.max(0, progress * 0.85);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.shadowColor = "#00F0FF";
            ctx.shadowBlur = 14;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.6})`;
            ctx.lineWidth = Math.max(1, progress * 7);
            ctx.stroke();
          }

          // PASS B: White-Hot Concentrated Laser Core
          for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const progress = 1 - i / points.length;
            const alpha = Math.max(0, progress * 0.95);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = i < 4
              ? `rgba(255, 255, 255, ${alpha})`
              : `rgba(186, 247, 255, ${alpha * 0.8})`;
            ctx.lineWidth = Math.max(0.75, progress * 2.5);
            ctx.stroke();
          }
          ctx.restore();
        }

        // ==========================================
        // 2. LASER SHOCKWAVE EXPANDING RIPPLES
        // ==========================================
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += 2.8;
          r.alpha *= 0.88;

          ctx.save();
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 240, 255, ${r.alpha})`;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = "#00F0FF";
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.restore();

          if (r.alpha < 0.02 || r.radius >= r.maxRadius) {
            ripples.splice(i, 1);
          }
        }

        // ==========================================
        // 3. ELECTRIC PLASMA MICRO-SPARKS
        // ==========================================
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.alpha *= 0.91;
          s.size *= 0.97;

          ctx.save();
          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.shadowColor = "#00F0FF";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(s.x, s.y, Math.max(0.5, s.size), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (s.alpha < 0.05) {
            sparks.splice(i, 1);
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
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 1. Volumetric Cyber Spotlight (Ambient flashlight following cursor) */}
      <div
        ref={spotlightRef}
        style={{ willChange: "transform" }}
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none transition-opacity duration-300"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.12)_0%,rgba(1,118,211,0.06)_40%,transparent_70%)] blur-2xl" />
      </div>

      {/* 2. Fullscreen GPU Canvas for Laser Trail, Sparks & Click Shockwaves */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
      />

      {/* 3. Sci-Fi Laser Reticle / Target Bracket (Locks onto Links & Buttons) */}
      <div
        ref={reticleRef}
        style={{ willChange: "transform" }}
        className={`fixed top-0 left-0 pointer-events-none transition-all duration-200 flex items-center justify-center ${
          isHovered
            ? "w-8 h-8 opacity-100 scale-100"
            : isClicking
            ? "w-6 h-6 opacity-80 scale-90"
            : "w-5 h-5 opacity-40 scale-75"
        }`}
      >
        {/* Outer Circular Targeting HUD */}
        <div
          className={`w-full h-full rounded-full border transition-all duration-300 ${
            isHovered
              ? "border-[#00F0FF] shadow-[0_0_15px_#00F0FF] animate-spin"
              : "border-cyan-400/30"
          }`}
          style={{ animationDuration: isHovered ? "4s" : "10s" }}
        />
        {/* Crosshair Tick Marks */}
        {isHovered && (
          <>
            <span className="absolute top-0 w-0.5 h-1.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
            <span className="absolute bottom-0 w-0.5 h-1.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
            <span className="absolute left-0 h-0.5 w-1.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
            <span className="absolute right-0 h-0.5 w-1.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
          </>
        )}
      </div>

      {/* 4. Hyper-Focused Laser Core Dot */}
      <div
        ref={dotRef}
        style={{ willChange: "transform" }}
        className={`fixed top-0 left-0 rounded-full pointer-events-none transition-all duration-150 ${
          isClicking
            ? "w-3 h-3 bg-white shadow-[0_0_20px_#FFFFFF,0_0_40px_#00F0FF,0_0_60px_#0176D3]"
            : isHovered
            ? "w-2.5 h-2.5 bg-[#00F0FF] shadow-[0_0_16px_#00F0FF,0_0_32px_#00F0FF,0_0_48px_#0176D3]"
            : "w-2 h-2 bg-white shadow-[0_0_8px_#FFFFFF,0_0_16px_#00F0FF,0_0_28px_#00F0FF]"
        }`}
      />
    </div>
  );
};
