"use client";

import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LandingHero = ({ isSignedIn }: { isSignedIn: boolean }) => {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build Agents <br /> That Actually Work
      </motion.h1>
      <p className="mt-4 text-slate-400 max-w-lg text-center mx-auto">
        Don't just automate tasks. Build intelligent agents that browse the web, read files, and make decisions. The future is here.
      </p>
      <div className="mt-8">
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-8 py-6 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all hover:scale-105">
            Launch Console
          </Button>
        </Link>
      </div>
    </LampContainer>
  );
};