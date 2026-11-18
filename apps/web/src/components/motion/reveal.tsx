"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating, for simple staggering. */
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  as?: "div" | "li" | "section";
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and slides content in once when it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 24, as = "div" }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Component>
  );
}
