"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "horizontal" | "vertical";
}

export default function AnimatedSection({
  children,
  delay = 0,
  className = "",
  variant = "vertical",
}: AnimatedSectionProps) {
  const initialTransform =
    variant === "horizontal" ? "translateX(-50px)" : "translateY(50px)";

  const finalTransform =
    variant === "horizontal" ? "translateX(0)" : "translateY(0)";

  return (
    <div className={className}>
      <motion.div
        layout
        initial={{ opacity: 0.8, transform: initialTransform }}
        whileInView={{ opacity: 1, transform: finalTransform }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.8,
          delay: delay * 0.2,
          ease: [0.21, 0.47, 0.32, 0.98],
          opacity: { duration: 1, ease: "easeInOut" },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
