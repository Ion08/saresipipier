"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "aside" | "span";
}

export function AnimatedSection({
  delay = 0,
  as: Tag = "div",
  className,
  children,
  ...props
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Tag ref={ref} className={cn(className)} {...props}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2, delay }}
      >
        {children}
      </motion.div>
    </Tag>
  );
}
