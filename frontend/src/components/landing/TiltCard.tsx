'use client';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** how strong the tilt is, in degrees */
  strength?: number;
  glare?: boolean;
}

export default function TiltCard({
  children,
  className = '',
  strength = 10,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [strength, -strength]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-strength, strength]), springConfig);
  const glareX = useTransform(x, [0, 1], ['0%', '100%']);
  const glareY = useTransform(y, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const [hovered, setHovered] = useState(false);

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setHovered(false);
  };

  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.35), transparent 60%)`,
  );

  return (
    <div className="perspective-container">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`tilt-card relative ${className}`}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{ background: glareBackground, opacity: hovered ? 1 : 0 }}
          />
        )}
      </motion.div>
    </div>
  );
}
