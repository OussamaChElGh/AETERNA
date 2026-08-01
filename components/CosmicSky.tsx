'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const CosmicSky = ({ className = "" }: { className?: string }) => {
  // Generate random stars
  const stars1 = Array.from({ length: 50 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: 0.5 + Math.random() * 0.5,
  }));
  
  const stars2 = Array.from({ length: 30 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: 0.3 + Math.random() * 0.7,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#05050A] pointer-events-none ${className}`}>
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#13112c] via-[#05050A] to-[#05050A] opacity-80" />
      
      {/* Nebulas */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-cosmic/10 blur-[120px] mix-blend-screen" />
      <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-[#1e1b4b]/30 blur-[100px] mix-blend-screen" />
      
      {/* Small Stars */}
      <div className="absolute inset-0">
        {stars1.map((star, i) => (
          <div
            key={`star1-${i}`}
            className="absolute rounded-full bg-white w-[1px] h-[1px]"
            style={{
              top: star.top,
              left: star.left,
              opacity: star.opacity,
              boxShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
              animation: `twinkle 3s infinite alternate`,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>
      
      {/* Medium Stars */}
      <div className="absolute inset-0">
        {stars2.map((star, i) => (
          <div
            key={`star2-${i}`}
            className="absolute rounded-full bg-[#D4AF37] w-[2px] h-[2px]"
            style={{
              top: star.top,
              left: star.left,
              opacity: star.opacity,
              boxShadow: "0 0 4px rgba(212, 175, 55, 0.8)",
              animation: `twinkle 4s infinite alternate`,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};
