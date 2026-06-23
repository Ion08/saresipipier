"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

interface LightboxClientProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function LightboxClient({ items, currentIndex, onClose, onNext, onPrev }: LightboxClientProps) {
  const currentItem = items[currentIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "Escape": onClose(); break;
      case "ArrowRight": onNext(); break;
      case "ArrowLeft": onPrev(); break;
    }
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKeyDown); document.body.style.overflow = ""; };
  }, [handleKeyDown]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = currentItem?.image || "";
    link.download = currentItem?.title || "gallery-image";
    link.click();
  }, [currentItem]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        onClick={onClose}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-12 h-12 border-3 border-white/30 text-white/70 hover:bg-white/10">
          <X size={22} />
        </button>
        <button onClick={handleDownload}
          className="absolute top-4 right-20 z-10 flex items-center justify-center w-12 h-12 border-3 border-white/30 text-white/70 hover:bg-white/10">
          <Download size={20} />
        </button>

        {items.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-4 z-10 flex items-center justify-center w-12 h-12 border-3 border-white/30 text-white/70 hover:bg-white/10">
              <ChevronLeft size={24} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-4 z-10 flex items-center justify-center w-12 h-12 border-3 border-white/30 text-white/70 hover:bg-white/10">
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          className="relative max-w-5xl max-h-[85vh] w-full h-full mx-4 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full flex items-center justify-center border-3 border-white/20">
            <Image
              src={currentItem?.image || ""}
              alt={currentItem?.title || "Galerie Sare și Piper"}
              fill className="object-contain" sizes="(max-width: 1280px) 100vw, 90vw" priority
            />
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-center">
          {currentItem?.title && <p className="text-white font-display text-lg uppercase">{currentItem.title}</p>}
          <p className="text-white/60 text-sm mt-1 font-bold">{currentIndex + 1} / {items.length}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
