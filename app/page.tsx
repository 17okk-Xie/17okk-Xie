"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypingAnimation } from "../components/typing-animation";
import { Meteors } from "../components/magicui/meteors";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "../components/ui/animated-modal";
import Image from "next/image";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showNavbar, setShowNavbar] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling down to approximately the second screen
      const viewportHeight = window.innerHeight;
      setShowNavbar(window.scrollY > viewportHeight * 0.7);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navbar animation variants
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] // Custom cubic bezier for a springy feel
      }
    }
  };

  // Logo animation variants
  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        delay: 0.2,
        ease: "backOut"
      }
    },
    hover: {
      scale: 1.05,
      textShadow: "0 0 8px rgb(34, 211, 238, 0.8)",
      transition: { duration: 0.2 }
    }
  };

  // Menu items animation variants
  const menuItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3 + (i * 0.1),
        duration: 0.35,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -3,
      textShadow: "0 0 8px rgb(34, 211, 238, 0.5)",
      color: "rgb(34, 211, 238)",
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const menuItems = [
    { name: "Projects", href: "/projects" },
    { name: "Skills", href: "/skills" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <div ref={containerRef} className="min-h-[200vh] relative">
      {/* Meteors background - fixed to cover the entire page */}
      <div className="fixed inset-0 w-full h-full z-0">
        <div className="absolute inset-0 w-full h-full bg-[#1a1a1a]">
          <Meteors number={20} />
        </div>
      </div>
      
      {/* Navbar - appears when scrolling down */}
      <AnimatePresence>
        {showNavbar && (
          <motion.nav 
            className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-900/30"
            variants={navbarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="bg-black/80 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <motion.a 
                  href="#" 
                  className="text-cyan-400 font-bold text-xl relative"
                  variants={logoVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <span className="relative z-10">17okk</span>
                  <motion.span 
                    className="absolute -inset-1 rounded-lg bg-cyan-500/10 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.1, 0.2, 0.1], 
                      scale: [1, 1.05, 1] 
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </motion.a>
                <div className="flex space-x-8">
                  {menuItems.map((item, i) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 transition-colors relative"
                      custom={i}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      {item.name}
                      <motion.span 
                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <div className="relative z-10">
        {/* First screen - Introduction */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Hi, I&apos;m{" "}
              <TypingAnimation
                words={["朔望", "Yixi Xie", "a Programmer", "a Video Editor"]}
                className="text-cyan-400 text-glow"
                cursorClassName="bg-cyan-400"
                speed={80}
                delay={2000}
              />
            </h1>
            <p className="text-xl text-gray-300 max-w-xl mx-auto mb-8">
              Welcome to My Personal Website
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mb-12"
            >
              <Modal>
                <ModalTrigger className="cursor-pointer">
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg shadow-cyan-400/20 transition-all duration-300 hover:shadow-cyan-400/40 hover:scale-[1.02]">
                    <Image
                      src="/images/Yixi.jpeg"
                      alt="Yixi Xie"
                      title="v me 50"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </ModalTrigger>
                <ModalBody>
                  <ModalContent>
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-semibold mb-4">Connect with me on WeChat</h3>
                      <div className="relative w-full aspect-square max-w-md overflow-hidden bg-white p-2 rounded-xl mb-3">
                        <Image
                          src="/images/QR-code.JPG"
                          alt="WeChat QR Code"
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">Scan the QR code to add me as a friend.</p>
                    </div>
                  </ModalContent>
                </ModalBody>
              </Modal>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center space-x-6"
            >
              {/* GitHub */}
              <a
                href="https://github.com/17okk-Xie"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              
              {/* Twitter/X */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/17okk-xie/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              
              {/* Resume */}
              <a
                href="/resume/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
                aria-label="Resume"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </a>
            </motion.div>
          </div>
          
          {/* Scroll Down Indicator */}
          <motion.div 
            className="absolute bottom-8 left-0 right-0 flex flex-col items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: [0.4, 1, 0.4], 
              y: [-10, 0, -10] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "loop" 
            }}
          >
            <p className="text-cyan-400 mb-2 text-sm font-medium tracking-wider">SCROLL DOWN</p>
            <motion.div
              animate={{ 
                y: [0, 6, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-cyan-400"
              >
                <path d="M12 5v14"></path>
                <path d="m19 12-7 7-7-7"></path>
              </svg>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Second screen - Content after scroll */}
        <section className="min-h-screen flex items-center justify-center pt-32 px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">About Me</h2>
            <p className="text-lg text-gray-300 mb-8">
              Passionate about building creative web experiences, leading projects, organizing ideas, 
              and telling stories through video content and editing. 
            </p>
            <p className="text-lg text-gray-300">
              Feel free to explore my portfolio and get in touch if you&apos;d like to collaborate on a project.
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
