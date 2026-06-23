"use client";

import { motion } from "framer-motion";
import { Wordmark } from "@/components/wordmark";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-center"
      >
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Wordmark variant="dark" className="text-3xl md:text-4xl" />
        </motion.div>
      </motion.div>
    </div>
  );
}
