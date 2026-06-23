"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: number;
  text?: string;
  className?: string;
  textClassName?: string;
}

export function LoadingSpinner({
  size = 24,
  text,
  className,
  textClassName,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={text || "Loading"}
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <Loader2
        size={size}
        className="animate-spin text-accent"
      />
      {text && (
        <p className={cn("text-sm text-text-light", textClassName)}>
          {text}
        </p>
      )}
      <span className="sr-only">{text || "Loading"}</span>
    </div>
  );
}
