"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute h-full w-full inset-0 bg-transparent pointer-events-none", className)}>
      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-black via-black to-neutral-950 opacity-0" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 h-full w-full"
      >
        {[...Array(5)].map((_, i) => (
           <Beam key={i} delay={i * 2} />
        ))}
      </motion.div>
    </div>
  );
};

const Beam = ({ delay }: { delay: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -100, y: -100, rotate: 45 }}
            animate={{ opacity: [0, 1, 0], x: 500, y: 500 }}
            transition={{ 
                duration: 7, 
                repeat: Infinity, 
                delay: delay,
                ease: "easeInOut"
            }}
            className="absolute top-0 left-[20%] w-[1px] h-[300px] bg-gradient-to-b from-transparent via-violet-500 to-transparent blur-sm"
        />
    )
}