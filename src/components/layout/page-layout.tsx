"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Header from "./header";
import Footer from "./footer";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`flex-1 pb-20 md:pb-0 ${className || ""}`}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
