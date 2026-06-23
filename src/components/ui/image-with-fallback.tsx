"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface ImageWithFallbackProps
  extends Omit<ImageProps, "onError" | "alt"> {
  alt: string;
  fallback?: string;
  imageZoom?: boolean;
  containerClassName?: string;
}

const defaultFallback = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80";

export function ImageWithFallback({
  src,
  alt,
  fallback = defaultFallback,
  imageZoom = false,
  containerClassName,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src?.toString() || fallback);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-neutral-light",
        imageZoom && "image-zoom",
        containerClassName
      )}
    >
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-neutral-light" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onError={() => setImgSrc(fallback)}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
