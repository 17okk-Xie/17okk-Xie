"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Meteors } from "../../components/magicui/meteors";
import Link from "next/link";
import Image from "next/image";

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("programming");

  const categories = [
    { id: "programming", name: "Coding", icon: "🚀" },
    { id: "design", name: "Media", icon: "🎨" },
    { id: "others", name: "Others", icon: "📁" }
  ];

  const programmingProjects = [
    {
      id: 1,
      title: "Personal Portfolio Website",
      description: "Continuously evolving portfolio that serves as a learning playground. Regularly updated with new projects, improved UI/UX based on feedback, and implementation of newly acquired skills through practical application.",
      tech: ["Next.js", "React", "TypeScript", "TailwindCSS", "Framer Motion", "EmailJS"],
      image: "/images/Portfolio.png",
      github: "https://github.com/17okk-Xie/17okk-Xie",
      demo: "https://17okk-xie.vercel.app/",
      status: "Ongoing"
    },
    {
      id: 2,
      title: "iHive - CSC490 Capstone Project",
      description: "iHive is a GitHub-inspired repository platform for ideas, designed to connect innovators and investors. It enables users to showcase their ideas, find potential funding, and collaborate on impactful projects. With AI-powered tag generation, advanced search, and collaboration tools, iHive aims to revolutionize idea sharing.",
      tech: ["Next.js", "React", "TailwindCSS", "Node.js", "Express.js", "Supabase", "PostgreSQL", "Socket.io", "OpenAI API"],
      image: "/images/Poster-iHive.png",
      github: "https://github.com/RizikH/iHive",
      demo: "https://ihive.vercel.app/",
      status: "Completed"
    },
    {
      id: 3, 
      title: "Playhub x Blueprint",
      description: "A curated platform where stories, secrets, and strategy collide. The platform serves as a comprehensive library and inspiration hub for players, creators, and offline venues game cafes.",
      tech: ["Next.js", "React", "TypeScript", "TailwindCSS", "Node.js", "Vercel"],
      image: "/images/playhub-blueprint.png",
      demo: "https://playhub-psi.vercel.app/",
      status: "Ongoing"
    },
    {
      id: 4,
      title: "Salad - E-commerce Website",
      description: "A modern e-commerce website for a premium salad business featuring responsive design, interactive menu with customization options, online ordering system, and location finder. Built with clean aesthetics and focus on fresh, healthy dining experience.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "React Icons"],
      image: "/images/Salad.png",
      github: "https://github.com/17okk-Xie/Green",
      demo: "https://green-sepia-six.vercel.app/",
      status: "Ongoing"
    },
    {
      id: 5,
      title: "iTea - CSC372 E-commerce Project",
      description: "A modern e-commerce website showcasing authentic Chinese tea culture. Features responsive design, product categories, tea heritage storytelling, customer testimonials, and newsletter subscription.",
      tech: ["Next.js", "React", "TypeScript", "TailwindCSS", "Vercel"],
      image: "/images/iTea.png",
      github: "https://github.com/17okk-Xie/tea-website",
      demo: "https://tea-website-zeta.vercel.app/",
      status: "Ongoing"
    },
    {
      id: 8,
      title: "Spartan Esports - CSC340 Prototype",
      description: "A comprehensive esports management platform for UNCG. Features coach booking, user reviews, admin management, team coordination, and Steam API integration for game statistics.",
      tech: ["Java", "Spring Boot", "MySQL", "HTML", "CSS", "JavaScript", "Steam API"],
      github: "https://github.com/AZubair-Iron/csc340-prototype",
      status: "Completed"
    }
  ];

  const designProjects = [
    {
      id: 6,
      title: "Typography",
      description: "Using After Effects to demonstrate and showcase ending typography layout concepts and design approaches, exploring creative motion graphics and visual storytelling techniques.",
      tech: ["After Effects"],
      video: "/videos/ae-prac.mp4",
      behance: "#",
      status: "Terminated"
    },
    {
      id: 7,
      title: "Transition", 
      description: "Using After Effects to showcase transition effects and creative visual storytelling techniques.",
      tech: ["After Effects"],
      video: "/videos/ae-transition.mp4", 
      behance: "#",
      status: "Ongoing"
    },
    {
      id: 9, 
      title: "Wuwa Edit - Sanhua", 
      description: "The best 4-star | Sanhua  #WutheringWaves #ProjectWAVE",
      tech: ["After Effects"], 
      video: "/videos/叱妖诰.mp4",
      behance: "#", 
      status: "Completed"
    }
  ];

  const getFilteredProjects = () => {
    switch(activeCategory) {
      case "programming":
        return programmingProjects;
      case "design":
        return designProjects;
      case "others":
        return [];
      default:
        return programmingProjects;
    }
  };

  interface Project {
    id: number;
    title: string;
    description: string;
    tech: string[];
    image?: string;
    video?: string;
    github?: string;
    demo?: string;
    behance?: string;
    status: string;
  }

  const ProjectCard = ({ project, index }: { project: Project, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-black/50 backdrop-blur-md rounded-xl overflow-hidden border border-neutral-800/50 shadow-xl hover:border-cyan-500/30 transition-all duration-300 group"
    >
      {/* Project Media */}
      <div className="relative h-48 overflow-hidden">
        {project.video ? (
          <video
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={project.video} type="video/mp4" />
          </video>
        ) : project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-900/20 to-purple-900/20 flex items-center justify-center">
            <span className="text-4xl">🚀</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            project.status === 'Completed' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : project.status === 'Ongoing'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : project.status === 'Terminated'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        {project.tech && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((tech: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs border border-cyan-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {project.github && (
            <Link
              href={project.github}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </Link>
          )}
          {project.demo && (
            <Link
              href={project.demo}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Live Demo
            </Link>
          )}
          {(project.behance || project.video) && (
            <Link
              href={project.video || project.behance || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              View
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );

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
            <Link href="/projects" className="text-cyan-400 transition-colors relative">Projects</Link>
            <Link href="/skills" className="text-gray-300 hover:text-cyan-400 transition-colors relative">Skills</Link>
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
            className="max-w-7xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white text-center">My Projects</h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              A collection of my portfolio on programming, design, and media projects.
            </p>

            {/* Category Tabs */}
            <div className="flex justify-center mb-12">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-2 border border-neutral-800/50">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all mr-2 last:mr-0 ${
                      activeCategory === category.id
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFilteredProjects().map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 text-center"
            >
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-neutral-800/50">
                <h3 className="text-2xl font-semibold text-white mb-4">Interested in collaborating?</h3>
                <p className="text-gray-400 mb-6">I&apos;m always open to discussing new opportunities and interesting projects.</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  Get In Touch
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 