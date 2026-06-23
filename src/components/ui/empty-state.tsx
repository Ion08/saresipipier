"use client";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void } & Partial<ButtonProps>;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      {icon && <div className="mb-4 flex h-16 w-16 items-center justify-center border-3 border-black/20 text-black/50">{icon}</div>}
      <h3 className="font-display text-xl text-black">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-black/60">{description}</p>}
      {action && <Button variant="primary" size="md" className="mt-6" onClick={action.onClick} {...(action as ButtonProps)}>{action.label}</Button>}
    </div>
  );
}
