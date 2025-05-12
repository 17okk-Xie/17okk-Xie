"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  color?: string;
  varyOpacity?: boolean;
  varySize?: boolean;
  minSize?: number;
  maxSize?: number;
}

export const Particles = ({
  className,
  quantity = 50,
  staticity = 30,
  ease = 50,
  refresh = false,
  color = "#ffffff",
  varyOpacity = true,
  varySize = true,
  minSize = 1,
  maxSize = 3,
}: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState<{
    w: number;
    h: number;
  }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, []);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current = [];
      canvasRef.current.width =
        canvasContainerRef.current.offsetWidth * dpr;
      canvasRef.current.height =
        canvasContainerRef.current.offsetHeight * dpr;
      canvasRef.current.style.width = `${canvasContainerRef.current.offsetWidth}px`;
      canvasRef.current.style.height = `${canvasContainerRef.current.offsetHeight}px`;
      context.current.scale(dpr, dpr);
      setCanvasSize({
        w: canvasContainerRef.current.offsetWidth,
        h: canvasContainerRef.current.offsetHeight,
      });
    }
  };

  const circleParams = () => {
    const size = varySize 
      ? Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize 
      : 1;
    const opacity = varyOpacity ? Math.random() : 1;

    const x = Math.random() * canvasSize.w;
    const y = Math.random() * canvasSize.h;
    const vx = Math.random() - 0.5;
    const vy = Math.random() - 0.5;

    return {
      x,
      y,
      vx,
      vy,
      radius: size,
      opacity,
      color: color,
    };
  };

  const drawParticles = () => {
    circles.current = [];
    for (let i = 0; i < quantity; i++) {
      circles.current.push(circleParams());
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.w, canvasSize.h);
    }
  };

  const drawCircle = (circle: any) => {
    if (context.current) {
      context.current.beginPath();
      context.current.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      context.current.fillStyle = `${circle.color}${
        Math.floor(circle.opacity * 255).toString(16).padStart(2, "0")
      }`;
      context.current.fill();
    }
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle, i) => {
      // Handle movement
      circle.x += circle.vx * (staticity / 10);
      circle.y += circle.vy * (staticity / 10);

      // Handle boundary conditions
      if (circle.x - circle.radius > canvasSize.w) {
        circle.x = -circle.radius;
      }
      if (circle.x + circle.radius < 0) {
        circle.x = canvasSize.w + circle.radius;
      }
      if (circle.y - circle.radius > canvasSize.h) {
        circle.y = -circle.radius;
      }
      if (circle.y + circle.radius < 0) {
        circle.y = canvasSize.h + circle.radius;
      }

      // Handle mouse interaction
      const dx = mouse.current.x - circle.x;
      const dy = mouse.current.y - circle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 100;

      if (dist < maxDist) {
        const angle = Math.atan2(dy, dx);
        const tx = circle.x + Math.cos(angle) * 20;
        const ty = circle.y + Math.sin(angle) * 20;
        const ax = (tx - circle.x) / ease;
        const ay = (ty - circle.y) / ease;

        circle.vx -= ax;
        circle.vy -= ay;
      }

      drawCircle(circle);
    });

    window.requestAnimationFrame(animate);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mousePosition.current = { x, y };
      mouse.current = { x, y };
    }
  };

  return (
    <div
      ref={canvasContainerRef}
      className={cn("h-full w-full", className)}
      onMouseMove={onMouseMove}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}; 