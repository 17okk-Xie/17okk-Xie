"use client";

import React from "react";
import { motion } from "framer-motion";
import { Meteors } from "../../components/magicui/meteors";
import { BentoGridProps } from "../../components/bento-grid";
import Link from "next/link";

export default function SkillsPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background with meteors */}
      <div className="fixed inset-0 w-full h-full z-0">
        <div className="absolute inset-0 w-full h-full bg-[#1a1a1a]">
          <Meteors number={20} />
        </div>
      </div>
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-900/30 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-cyan-400 font-bold text-xl">17okk</Link>
          <div className="flex space-x-8">
            <Link href="/projects" className="text-gray-300 hover:text-cyan-400 transition-colors relative">Projects</Link>
            <Link href="/skills" className="text-cyan-400 transition-colors relative">Skills</Link>
            <Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors relative">Contact</Link>
          </div>
        </div>
      </nav>
      
      {/* Content */}
      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white text-center">Skills & Expertise</h1>
            
            {/* BentoGrid Component */}
            <div className="mt-8">
              <BentoGridProps />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 