"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meteors } from "../../components/magicui/meteors";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "../../components/ui/animated-modal";
import Link from "next/link";
import Image from "next/image";

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("programming");
  const [uploadedProjects, setUploadedProjects] = useState<UploadedProject[]>([]);
  const [editingProject, setEditingProject] = useState<UploadedProject | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    tech: "",
    tags: "",
    status: "Ongoing"
  });
  const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set());

  const categories = [
    { id: "programming", name: "Coding", icon: "🚀" },
    { id: "design", name: "Media", icon: "🎨" }
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
      id: 11,
      title: "Phrolova",
      description: "30 Seconds to Fall in Love with Phrolova!「Wuthering Waves × Phrolova × Bet On Me」",
      tech: ["After Effects"],
      video: "/videos/Phrolova.mp4",
      tags: ["Wuthering Waves", "Project WAVE", "Phrolova"],
      status: "Completed"
    },
    {
      id: 10,
      title: "Jinhsi",
      description: "「Wuthering Waves × Jinhsi」",
      tech: ["After Effects"],
      video: "/videos/小今子.mp4",
      tags: ["Wuthering Waves", "Project WAVE", "Jinhsi"],
      status: "Completed"
    },
    {
      id: 9, 
      title: "Sanhua", 
      description: "「Wuthering Waves × Sanhua」",
      tech: ["After Effects"],
      video: "/videos/叱妖诰.mp4",
      tags: ["Wuthering Waves", "Project WAVE", "Sanhua"], 
      status: "Completed"
    },
    {
      id: 7,
      title: "Transition", 
      description: "A showcase of advanced transition techniques and motion design principles. Demonstrates seamless scene transitions, dynamic camera movements, and sophisticated visual effects inspired by Wuthering Waves' cinematic style and game aesthetics.",
      tech: ["After Effects"],
      video: "/videos/ae-transition.mp4",
      tags: ["AE Techniques", "Transition", "Wuwa"],
      status: "Ongoing"
    },
    {
      id: 6,
      title: "Prototype",
      description: "An experimental anime-inspired motion graphics prototype exploring advanced After Effects techniques. Created as a proof of concept for dynamic character animations and visual effects inspired by Sword Art Online's distinctive aesthetic and UI elements.",
      tech: ["After Effects"],
      video: "/videos/ae-prac.mp4",
      tags: ["Anime", "Prototype", "Sword Art Online"],
      status: "Terminated"
    }
  ];

  // Load uploaded projects from localStorage on component mount
  useEffect(() => {
    const loadUploadedProjects = () => {
      try {
        const stored = localStorage.getItem('uploadedProjects');
        if (stored) {
          const projects = JSON.parse(stored);
          setUploadedProjects(projects);
        }
      } catch (error) {
        console.error("Error loading uploaded projects:", error);
      }
    };

    loadUploadedProjects();

    // Listen for storage changes (when new projects are uploaded)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'uploadedProjects') {
        loadUploadedProjects();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for focus events to catch uploads from the same tab
    const handleFocus = () => {
      loadUploadedProjects();
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const isUploadedProject = (project: Project): project is UploadedProject => {
    return 'uploadDate' in project;
  };

  const deleteUploadedProject = (projectId: number) => {
    const projectToDelete = uploadedProjects.find(p => p.id === projectId);
    if (!projectToDelete) return;

    // Enhanced confirmation with project details
    const confirmMessage = `Are you sure you want to permanently delete "${projectToDelete.title}"?\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      try {
        const updatedProjects = uploadedProjects.filter(p => p.id !== projectId);
        setUploadedProjects(updatedProjects);
        localStorage.setItem('uploadedProjects', JSON.stringify(updatedProjects));
        
        // Clean up object URL to prevent memory leaks
        if (projectToDelete.video) {
          URL.revokeObjectURL(projectToDelete.video);
        }

        // Close edit mode if deleting the currently edited project
        if (editingProject?.id === projectId) {
          setEditingProject(null);
        }

        console.log(`Project "${projectToDelete.title}" deleted successfully`);
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  const startEditingProject = (project: UploadedProject) => {
    setEditingProject(project);
    setEditForm({
      title: project.title,
      description: project.description || "",
      tech: project.tech ? project.tech.join(", ") : "",
      tags: project.tags ? project.tags.join(", ") : "",
      status: project.status
    });
  };

  const cancelEditing = () => {
    setEditingProject(null);
    setEditForm({
      title: "",
      description: "",
      tech: "",
      tags: "",
      status: "Ongoing"
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEditedProject = () => {
    if (!editingProject) return;

    try {
      const updatedProject: UploadedProject = {
        ...editingProject,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        tech: editForm.tech ? editForm.tech.split(',').map(t => t.trim()).filter(t => t) : [],
        tags: editForm.tags ? editForm.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        status: editForm.status
      };

      const updatedProjects = uploadedProjects.map(p => 
        p.id === editingProject.id ? updatedProject : p
      );

      setUploadedProjects(updatedProjects);
      localStorage.setItem('uploadedProjects', JSON.stringify(updatedProjects));
      
      setEditingProject(null);
      setEditForm({
        title: "",
        description: "",
        tech: "",
        tags: "",
        status: "Ongoing"
      });

      console.log(`Project "${updatedProject.title}" updated successfully`);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  const toggleProjectSelection = (projectId: number) => {
    setSelectedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const selectAllProjects = () => {
    setSelectedProjects(new Set(uploadedProjects.map(p => p.id)));
  };

  const clearSelection = () => {
    setSelectedProjects(new Set());
  };

  const deleteSelectedProjects = () => {
    if (selectedProjects.size === 0) return;

    const confirmMessage = `Are you sure you want to permanently delete ${selectedProjects.size} selected project(s)?\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      try {
        // Clean up object URLs for selected projects
        uploadedProjects.forEach(project => {
          if (selectedProjects.has(project.id) && project.video) {
            URL.revokeObjectURL(project.video);
          }
        });

        const updatedProjects = uploadedProjects.filter(p => !selectedProjects.has(p.id));
        setUploadedProjects(updatedProjects);
        localStorage.setItem('uploadedProjects', JSON.stringify(updatedProjects));
        
        // Clear selection and close edit mode if necessary
        setSelectedProjects(new Set());
        if (editingProject && selectedProjects.has(editingProject.id)) {
          setEditingProject(null);
        }

        console.log(`${selectedProjects.size} projects deleted successfully`);
      } catch (error) {
        console.error("Error deleting projects:", error);
        alert("Failed to delete projects. Please try again.");
      }
    }
  };

  const getFilteredProjects = (): (Project | UploadedProject)[] => {
    if (activeCategory === "design") {
      // Combine uploaded projects with static design projects
      return [...uploadedProjects, ...designProjects];
    }
    return programmingProjects;
  };

  const EditModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={cancelEditing}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-black/90 border border-neutral-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Edit Project</h3>
            </div>
            <button
              onClick={cancelEditing}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); saveEditedProject(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  required
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                rows={3}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                placeholder="Describe your project"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Technologies Used</label>
                <input
                  type="text"
                  name="tech"
                  value={editForm.tech}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g., After Effects, Premiere Pro (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={editForm.tags}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g., Animation, Motion Graphics (comma separated)"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={cancelEditing}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Save Changes
              </button>
            </div>
          </form>

          {editingProject && (
            <div className="mt-4 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
              <p className="text-xs text-gray-400 mb-1">
                <span className="font-medium">Original file:</span> {editingProject.fileName}
              </p>
              <p className="text-xs text-gray-400">
                <span className="font-medium">Uploaded:</span> {new Date(editingProject.uploadDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  interface Project {
    id: number;
    title: string;
    description?: string;
    tech?: string[];
    image?: string;
    video?: string;
    github?: string;
    demo?: string;
    tags?: string[];
    status: string;
  }

  interface UploadedProject extends Project {
    fileName: string;
    fileSize: number;
    uploadDate: string;
  }

  const ProjectCard = ({ project, index }: { project: Project | UploadedProject, index: number }) => (
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
        
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Upload indicator for user-uploaded projects */}
          {isUploadedProject(project) && (
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-purple-500/20 text-purple-400 border-purple-500/30">
              📤 Uploaded
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
            project.status === 'Completed' 
              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
              : project.status === 'Ongoing'
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {project.status}
          </span>
        </div>

        {/* Selection Checkbox for Uploaded Projects */}
        {isUploadedProject(project) && (
          <div className="absolute top-4 left-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedProjects.has(project.id)}
                onChange={() => toggleProjectSelection(project.id)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                selectedProjects.has(project.id)
                  ? 'bg-purple-600 border-purple-600'
                  : 'border-gray-400 hover:border-purple-400 bg-black/50'
              }`}>
                {selectedProjects.has(project.id) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                )}
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {project.description}
          </p>
        )}

        {/* Upload info for user-uploaded projects */}
        {isUploadedProject(project) && (
          <div className="mb-4 p-2 bg-purple-500/5 border border-purple-500/20 rounded text-xs text-purple-300">
            <div className="flex items-center justify-between">
              <span>📅 Uploaded: {new Date(project.uploadDate).toLocaleDateString()}</span>
              {project.fileName && (
                <span className="text-gray-400 truncate ml-2 max-w-[120px]">
                  {project.fileName}
                </span>
              )}
            </div>
          </div>
        )}

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
        <div className="space-y-3">
          {/* Primary Actions (Demo, GitHub, View) */}
          <div className="flex gap-2">
            {project.github && (
              <Link
                href={project.github}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Link>
            )}
            {project.demo && (
              <Link
                href={project.demo}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15,3 21,3 21,9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Demo
              </Link>
            )}
            {project.video && (
              <Modal>
                <ModalTrigger className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21"></polygon>
                  </svg>
                  Play
                </ModalTrigger>
                <ModalBody className="w-full max-w-6xl mx-auto">
                  <ModalContent className="text-center">
                    <h3 className="text-2xl font-semibold mb-6 text-black dark:text-white">{project.title}</h3>

                    <div className="w-full aspect-video max-w-5xl mx-auto">
                      <video
                        className="w-full h-full rounded-lg object-contain bg-black"
                        controls
                        loop
                        autoPlay
                        playsInline
                      >
                        <source src={project.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    
                    {project.tags && (
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {project.tags.map((tag: string, idx: number) => (
                          <div 
                            key={idx}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium shadow-sm"
                          >
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                              <line x1="7" y1="7" x2="7.01" y2="7"></line>
                            </svg>
                            {tag}
                          </div>
                        ))}
                      </div>
                    )}
                  </ModalContent>
                </ModalBody>
              </Modal>
            )}
          </div>

          {/* Management Actions (Edit, Delete) for Uploaded Projects */}
          {isUploadedProject(project) && (
            <div className="flex gap-2 pt-2 border-t border-neutral-700/50">
              <button
                onClick={() => startEditingProject(project)}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                title="Edit project details"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
              <button
                onClick={() => deleteUploadedProject(project.id)}
                className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                title="Delete uploaded project"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete
              </button>
            </div>
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
                    onClick={() => {
                      setActiveCategory(category.id);
                      setSelectedProjects(new Set()); // Clear selection when switching categories
                    }}
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

            {/* Bulk Actions for Media Category */}
            {activeCategory === "design" && uploadedProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-neutral-800/50">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">
                        {uploadedProjects.length} uploaded project{uploadedProjects.length !== 1 ? 's' : ''}
                      </span>
                      {selectedProjects.size > 0 && (
                        <span className="text-sm text-purple-400">
                          {selectedProjects.size} selected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {uploadedProjects.length > 1 && (
                        <>
                          {selectedProjects.size === 0 ? (
                            <button
                              onClick={selectAllProjects}
                              className="text-sm bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Select All
                            </button>
                          ) : (
                            <button
                              onClick={clearSelection}
                              className="text-sm bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Clear Selection
                            </button>
                          )}
                        </>
                      )}

                      {selectedProjects.size > 0 && (
                        <button
                          onClick={deleteSelectedProjects}
                          className="text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                          </svg>
                          Delete Selected ({selectedProjects.size})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}



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

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProject && <EditModal />}
      </AnimatePresence>
    </div>
  );
} 