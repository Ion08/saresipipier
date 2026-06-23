"use client";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  imageZoom?: boolean;
}

export function Card({ className, hover = false, imageZoom = false, children, ...props }: CardProps) {
  return (
    <div className={cn("border-3 border-black bg-white overflow-hidden", hover && "hover:bg-black hover:text-white", imageZoom && "image-zoom", className)} {...props}>
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("p-5 md:p-6 pb-0", className)} {...props} />;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("p-5 md:p-6", className)} {...props} />;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn("flex items-center gap-3 p-5 md:p-6 pt-0", className)} {...props} />;
}
