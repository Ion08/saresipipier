"use client";

import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  id?: string;
  containerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function Section({
  title,
  subtitle,
  id,
  className,
  containerClassName,
  titleClassName,
  subtitleClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24", className)}
      {...props}
    >
      <div className={cn("container", containerClassName)}>
        {(title || subtitle) && (
          <div className="mb-12 max-w-2xl">
            {subtitle && (
              <p
                className={cn(
                  "mb-3 font-display text-sm font-medium uppercase tracking-widest text-accent",
                  subtitleClassName
                )}
              >
                {subtitle}
              </p>
            )}
            {title && (
              <h2
                className={cn(
                  "font-display text-3xl font-semibold text-text md:text-4xl lg:text-5xl",
                  titleClassName
                )}
              >
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
