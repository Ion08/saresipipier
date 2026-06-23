"use client";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-black/10 text-black",
  accent: "bg-rosso text-white",
  success: "bg-verde text-white",
  warning: "bg-yellow-600 text-white",
  error: "bg-rosso text-white",
  neutral: "bg-black/5 text-black/60",
  outline: "border-2 border-black text-black",
} as const;

const badgeSizes = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
  size?: keyof typeof badgeSizes;
  dot?: boolean;
}

export function Badge({ className, variant = "default", size = "md", dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-bold uppercase tracking-wider leading-none whitespace-nowrap", badgeVariants[variant], badgeSizes[size], className)} {...props}>
      {dot && <span aria-hidden className="h-1.5 w-1.5 bg-current" />}
      {children}
    </span>
  );
}
