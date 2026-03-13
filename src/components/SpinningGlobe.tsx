"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3-geo";
import { motion } from "framer-motion";

interface SpinningGlobeProps {
  isSpinning: boolean;
  onLanded?: () => void;
  targetCountryCode?: string | null;
}

export function SpinningGlobe({ isSpinning, onLanded, targetCountryCode }: SpinningGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<[number, number, number]>([0, 0, 0]);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Setup D3 Orthographic Projection
    const width = 260;
    const height = 260;
    const projection = d3.geoOrthographic()
      .scale(120)
      .translate([width / 2, height / 2])
      .clipAngle(90);
      
    const path = d3.geoPath().projection(projection).context(ctx);
    const graticule = d3.geoGraticule10();
    const sphere = { type: "Sphere" } as d3.GeoSphere;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      projection.rotate(rotationRef.current);

      // Draw ocean
      ctx.beginPath();
      path(sphere);
      ctx.fillStyle = "#87CEEB"; // Light blue ocean
      ctx.fill();
      ctx.strokeStyle = "#4da6ff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw graticule
      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // We could add actual country shapes here if we loaded TopoJSON,
      // but drawing a stylized globe is good enough, maybe some placeholder landmasses.
    };

    const animate = () => {
      if (isSpinning) {
        // Spin fast!
        rotationRef.current[0] += 10;
        rotationRef.current[1] -= 2;
      } else {
        // Spin slow
        rotationRef.current[0] += 0.5;
      }
      
      render();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isSpinning]);

  return (
    <motion.div 
      className="relative w-[240px] h-[240px] md:w-[260px] md:h-[260px] mx-auto filter drop-shadow-2xl"
      animate={isSpinning ? { y: [0, -10, 0] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
    >
      <canvas 
        ref={canvasRef} 
        width={260} 
        height={260} 
        className="w-full h-full rounded-full bg-transparent"
      />
      {isSpinning && (
        <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-ping" />
      )}
    </motion.div>
  );
}
