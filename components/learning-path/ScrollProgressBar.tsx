'use client';
import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
      style={{ scaleX }}
    />
  );
}
