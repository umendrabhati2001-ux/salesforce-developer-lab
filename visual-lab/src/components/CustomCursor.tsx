"use client";

import React, { useEffect, useRef, useState } from "react";

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailSvgRef = useRef<SVGSVGElement>(null);
  const trailPathRef = useRef<SVGPathElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only run on non-touch desktop devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId: number;

    // Trail history points for the smooth trailing line
    const trailPoints: { x: number; y: number }[] = [];
    const maxTrailPoints = 8;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        ringX = mouseX;
        ringY = mouseY;
      }

      // Check if hovering over clickable/interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.closest("a") !== null ||
          target.closest("button") !== null ||
          target.closest("[role='button']") !== null ||
          target.closest("input") !== null ||
          target.closest("textarea") !== null ||
          target.closest(".cursor-pointer") !== null ||
          target.classList.contains("clickable");

        setIsHovering(isClickable);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Smooth Lerp physics render loop
    const render = () => {
      // Direct instant dot positioning
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Fluid trailing follower with lerp interpolation
      const lerpSpeed = isHovering ? 0.22 : 0.15;
      ringX += (mouseX - ringX) * lerpSpeed;
      ringY += (mouseY - ringY) * lerpSpeed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      // Trailing Line Calculation
      trailPoints.push({ x: mouseX, y: mouseY });
      if (trailPoints.length > maxTrailPoints) {
        trailPoints.shift();
      }

      if (trailPathRef.current && trailPoints.length > 2) {
        let pathD = `M ${trailPoints[0].x} ${trailPoints[0].y}`;
        for (let i = 1; i < trailPoints.length; i++) {
          const xc = (trailPoints[i].x + trailPoints[i - 1].x) / 2;
          const yc = (trailPoints[i].y + trailPoints[i - 1].y) / 2;
          pathD += ` Q ${trailPoints[i - 1].x} ${trailPoints[i - 1].y}, ${xc} ${yc}`;
        }
        trailPathRef.current.setAttribute("d", pathD);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible, isHovering]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 1. Trailing Connecting Line (Fluid Organic Ribbon) */}
      <svg
        ref={trailSvgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <linearGradient id="cursorTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.0" />
            <stop offset="60%" stopColor="#0176D3" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path
          ref={trailPathRef}
          fill="none"
          stroke="url(#cursorTrailGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 2. Smooth Lagging Follower Ring */}
      <div
        ref={ringRef}
        style={{ willChange: "transform" }}
        className={`fixed top-0 left-0 rounded-full transition-all duration-200 ease-out pointer-events-none ${
          isHovering
            ? "w-11 h-11 border-2 border-[#00F0FF] bg-[#00F0FF]/15 shadow-[0_0_20px_rgba(0,240,255,0.45)] backdrop-invert-[0.1]"
            : isClicking
            ? "w-6 h-6 border border-emerald-400 bg-emerald-400/20 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            : "w-8 h-8 border border-cyan-400/60 bg-transparent shadow-[0_0_12px_rgba(0,240,255,0.25)]"
        }`}
      />

      {/* 3. Instant Center Neon Dot */}
      <div
        ref={dotRef}
        style={{ willChange: "transform" }}
        className={`fixed top-0 left-0 rounded-full transition-transform duration-75 ease-out pointer-events-none ${
          isHovering
            ? "w-2.5 h-2.5 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]"
            : isClicking
            ? "w-1.5 h-1.5 bg-emerald-400 shadow-[0_0_8px_#34D399]"
            : "w-2 h-2 bg-white shadow-[0_0_8px_#00F0FF]"
        }`}
      />
    </div>
  );
};
