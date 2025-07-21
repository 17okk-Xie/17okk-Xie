"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meteors } from "../../components/magicui/meteors";
import Link from "next/link";

interface BaseProject {
  id: number;
  title: string;
  description: string;
  tech: string[];
  tags: string[];
  status: string;
  video: string;
}

interface StaticProject extends BaseProject {
  isStatic: true;
}

interface UploadedProject extends BaseProject {
  isStatic?: false;
  fileName: string;
  fileSize: number;
  uploadDate: string;
}

type Project = StaticProject | UploadedProject;

export default function UploadPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const pinInputRef = useRef<HTMLInputElement>(null);
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    description: "",
    tech: "",
    tags: "",
    videoFile: null as File | null,
    status: "Ongoing"
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [uploadedProjects, setUploadedProjects] = useState<UploadedProject[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [showManagement, setShowManagement] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    tech: "",
    tags: "",
    status: "Ongoing"
  });

  // Type guard to check if project is uploaded
  const isUploadedProject = (project: Project): project is UploadedProject => {
    return !project.isStatic;
  };

  // Static design projects from the main projects page
  const staticDesignProjects: StaticProject[] = [
    {
      id: 9, 
      title: "Sanhua", 
      description: "「Wuthering Waves × Sanhua」",
      tech: ["After Effects"],
      video: "/videos/叱妖诰.mp4",
      tags: ["Wuthering Waves", "Project WAVE", "Sanhua"], 
      status: "Completed",
      isStatic: true
    },
    {
      id: 7,
      title: "Transition", 
      description: "A showcase of advanced transition techniques and motion design principles. Demonstrates seamless scene transitions, dynamic camera movements, and sophisticated visual effects inspired by Wuthering Waves' cinematic style and game aesthetics.",
      tech: ["After Effects"],
      video: "/videos/ae-transition.mp4",
      tags: ["AE Techniques", "Transition", "Wuwa"],
      status: "Ongoing",
      isStatic: true
    },
    {
      id: 6,
      title: "Prototype",
      description: "An experimental anime-inspired motion graphics prototype exploring advanced After Effects techniques. Created as a proof of concept for dynamic character animations and visual effects inspired by Sword Art Online's distinctive aesthetic and UI elements.",
      tech: ["After Effects"],
      video: "/videos/ae-prac.mp4",
      tags: ["Anime", "Prototype", "Sword Art Online"],
      status: "Terminated",
      isStatic: true
    }
  ];

  // You can change this PIN to whatever you want
  const CORRECT_PIN = "7526";

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === CORRECT_PIN) {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Invalid PIN. Please try again.");
      setPinInput("");
      // Refocus on input after error
      setTimeout(() => {
        pinInputRef.current?.focus();
      }, 100);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 4 digits
    if (/^\d{0,4}$/.test(value)) {
      setPinInput(value);
      setPinError(""); // Clear any previous errors
      
      // Auto-submit when 4 digits are entered
      if (value.length === 4) {
        setTimeout(() => {
          if (value === CORRECT_PIN) {
            setIsAuthenticated(true);
            setPinError("");
          } else {
            setPinError("Invalid PIN. Please try again.");
            setPinInput("");
            setTimeout(() => {
              pinInputRef.current?.focus();
            }, 100);
          }
        }, 300); // Small delay for better UX
      }
    }
  };

  // Focus on PIN input when component mounts or after error
  useEffect(() => {
    if (!isAuthenticated && pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [isAuthenticated, pinError]);

  const loadAllProjects = useCallback(() => {
    try {
      // Load uploaded projects
      const storedUploaded = localStorage.getItem('uploadedProjects');
      const uploaded: UploadedProject[] = storedUploaded ? JSON.parse(storedUploaded) : [];
      setUploadedProjects(uploaded);

      // Load modified static projects (if any)
      const storedStatic = localStorage.getItem('modifiedStaticProjects');
      const modifiedStatic = storedStatic ? JSON.parse(storedStatic) : {};

      // Load deleted static projects
      const storedDeleted = localStorage.getItem('deletedStaticProjects');
      const deletedStatic = storedDeleted ? JSON.parse(storedDeleted) : [];

      // Combine static projects with modifications, excluding deleted ones
      const activeStaticProjects: StaticProject[] = staticDesignProjects
        .filter(project => !deletedStatic.includes(project.id))
        .map(project => {
          const modifications = modifiedStatic[project.id] || {};
          return {
            ...project,
            title: modifications.title || project.title,
            description: modifications.description || project.description,
            tech: modifications.tech || project.tech,
            tags: modifications.tags || project.tags,
            status: modifications.status || project.status,
            isStatic: true as const,
          };
        });

      // Combine all projects
      const combined: Project[] = [...uploaded, ...activeStaticProjects];
      setAllProjects(combined);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  }, [staticDesignProjects]);

  // Load existing projects when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllProjects();
    }
  }, [isAuthenticated, loadAllProjects]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFormData.videoFile) {
      setFileError("Please select a video file.");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress for demo (replace with actual upload logic)
      for (let progress = 0; progress <= 100; progress += 5) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate upload time
      }
      
      // Create object URL for the video file (for demo purposes)
      const videoUrl = URL.createObjectURL(uploadFormData.videoFile);
      
      // Create new project object
      const newProject = {
        id: Date.now(), // Simple ID generation
        title: uploadFormData.title,
        description: uploadFormData.description,
        tech: uploadFormData.tech ? uploadFormData.tech.split(',').map(t => t.trim()) : ["Video Editing"],
        video: videoUrl,
        tags: uploadFormData.tags ? uploadFormData.tags.split(',').map(t => t.trim()) : ["User Upload"],
        status: uploadFormData.status,
        fileName: uploadFormData.videoFile.name,
        fileSize: uploadFormData.videoFile.size,
        uploadDate: new Date().toISOString()
      };
      
      // Get existing uploaded projects from localStorage
      const existingProjects = JSON.parse(localStorage.getItem('uploadedProjects') || '[]');
      
      // Add new project to the beginning of the array
      const updatedProjects = [newProject, ...existingProjects];
      
      // Save to localStorage
      localStorage.setItem('uploadedProjects', JSON.stringify(updatedProjects));
      
      console.log("Project added to design section:", newProject);
      
      // Reload existing projects to show the new upload
      loadAllProjects();
      
      // Reset form
      setUploadFormData({
        title: "",
        description: "",
        tech: "",
        tags: "",
        videoFile: null,
        status: "Ongoing"
      });
      setUploadProgress(0);
      setFileError("");
      
      // Show success message with options
      const choice = confirm("Video uploaded successfully! Click OK to view in Projects page, or Cancel to manage uploads here.");
      
      if (choice) {
        window.location.href = '/projects';
      } else {
        setShowManagement(true);
      }
      
    } catch (error) {
      console.error("Upload failed:", error);
      setFileError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError("");
    
    if (file) {
      // Check file size (3GB = 3 * 1024 * 1024 * 1024 bytes)
      const maxSize = 3 * 1024 * 1024 * 1024; // 3GB
      if (file.size > maxSize) {
        setFileError(`File too large. Maximum size is 3GB. Your file is ${formatFileSize(file.size)}.`);
        return;
      }
      
      // Check file type
      const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mkv'];
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(mp4|mov|avi|webm|mkv)$/)) {
        setFileError("Please select a valid video file (MP4, MOV, AVI, WebM, MKV).");
        return;
      }
    }
    
    setUploadFormData(prev => ({
      ...prev,
      videoFile: file
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const startEditingProject = (project: Project) => {
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
      const updatedProject = {
        ...editingProject,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        tech: editForm.tech ? editForm.tech.split(',').map(t => t.trim()).filter(t => t) : [],
        tags: editForm.tags ? editForm.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        status: editForm.status
      };

      if (editingProject.isStatic) {
        // Handle static project modification
        const storedStatic = localStorage.getItem('modifiedStaticProjects');
        const modifiedStatic = storedStatic ? JSON.parse(storedStatic) : {};
        
        modifiedStatic[editingProject.id] = {
          title: updatedProject.title,
          description: updatedProject.description,
          tech: updatedProject.tech,
          tags: updatedProject.tags,
          status: updatedProject.status
        };
        
        localStorage.setItem('modifiedStaticProjects', JSON.stringify(modifiedStatic));
      } else {
        // Handle uploaded project modification
        const updatedUploaded = uploadedProjects.map(p => 
          p.id === editingProject.id ? {
            ...p,
            title: updatedProject.title,
            description: updatedProject.description,
            tech: updatedProject.tech,
            tags: updatedProject.tags,
            status: updatedProject.status
          } : p
        );
        
        setUploadedProjects(updatedUploaded);
        localStorage.setItem('uploadedProjects', JSON.stringify(updatedUploaded));
      }

      // Reload all projects to reflect changes
      loadAllProjects();
      cancelEditing();
      console.log(`Project "${updatedProject.title}" updated successfully`);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  const deleteProject = (projectId: number) => {
    const projectToDelete = allProjects.find(p => p.id === projectId);
    if (!projectToDelete) return;

    const confirmMessage = `Are you sure you want to permanently delete "${projectToDelete.title}"?\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      try {
        if (projectToDelete.isStatic) {
          // Handle static project deletion (mark as deleted)
          const storedDeleted = localStorage.getItem('deletedStaticProjects');
          const deletedStatic = storedDeleted ? JSON.parse(storedDeleted) : [];
          
          if (!deletedStatic.includes(projectId)) {
            deletedStatic.push(projectId);
            localStorage.setItem('deletedStaticProjects', JSON.stringify(deletedStatic));
          }
        } else {
          // Handle uploaded project deletion (actually remove)
          const updatedUploaded = uploadedProjects.filter(p => p.id !== projectId);
          setUploadedProjects(updatedUploaded);
          localStorage.setItem('uploadedProjects', JSON.stringify(updatedUploaded));
          
          // Clean up object URL to prevent memory leaks
          if (projectToDelete.video && projectToDelete.video.startsWith('blob:')) {
            URL.revokeObjectURL(projectToDelete.video);
          }
        }

        // Close edit mode if deleting the currently edited project
        if (editingProject?.id === projectId) {
          cancelEditing();
        }

        // Reload all projects to reflect changes
        loadAllProjects();
        console.log(`Project "${projectToDelete.title}" deleted successfully`);
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  const PinForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-black/50 backdrop-blur-md rounded-xl overflow-hidden border border-neutral-800/50 shadow-xl max-w-md mx-auto"
    >
      <div className="p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full p-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-white text-center mb-2">Access Required</h3>
        <p className="text-gray-400 text-center mb-8">Enter PIN to access the upload portal</p>

        <form onSubmit={handlePinSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 text-center">Enter PIN</label>
            <input
              ref={pinInputRef}
              type="password"
              value={pinInput}
              onChange={handlePinChange}
              maxLength={4}
              className="w-full px-4 py-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="••••"
              autoComplete="off"
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
            />
            {pinError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center mt-3"
              >
                {pinError}
              </motion.p>
            )}
          </div>

          <div className="flex gap-4">
            <Link
              href="/projects"
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Access
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-700">
          <p className="text-xs text-gray-500 text-center">
            This area is restricted. Please contact the administrator if you need access.
          </p>
        </div>
      </div>
    </motion.div>
  );

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
              {isUploadedProject(editingProject) ? (
                <>
                  <p className="text-xs text-gray-400 mb-1">
                    <span className="font-medium">Original file:</span> {editingProject.fileName}
                  </p>
                  <p className="text-xs text-gray-400">
                    <span className="font-medium">Uploaded:</span> {new Date(editingProject.uploadDate).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-400">
                  <span className="font-medium">Type:</span> Built-in static project
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  const ManagementSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-black/50 backdrop-blur-md rounded-xl overflow-hidden border border-neutral-800/50 shadow-xl mt-8"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"></path>
                <path d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
              </svg>
            </div>
                         <div>
               <h3 className="text-xl font-semibold text-white">Manage All Media Projects</h3>
               <p className="text-sm text-gray-400">{allProjects.length} project{allProjects.length !== 1 ? 's' : ''} total ({uploadedProjects.length} uploaded)</p>
             </div>
           </div>
           <button
             onClick={() => setShowManagement(false)}
             className="text-gray-400 hover:text-white transition-colors"
           >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
           </button>
         </div>

         {allProjects.length === 0 ? (
           <div className="text-center py-8">
             <div className="text-gray-500 text-4xl mb-4">📁</div>
             <p className="text-gray-400">No media projects found.</p>
             <p className="text-sm text-gray-500 mt-2">Upload your first project using the form above.</p>
           </div>
         ) : (
           <div className="space-y-4">
             {allProjects.map((project: Project, index: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Video Thumbnail */}
                  <div className="w-20 h-20 bg-neutral-700 rounded-lg overflow-hidden flex-shrink-0">
                    <video
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay={false}
                    >
                      <source src={project.video} type="video/mp4" />
                    </video>
                  </div>

                  {/* Project Info */}
                                     <div className="flex-1 min-w-0">
                     <div className="flex items-start justify-between mb-2">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-medium text-white truncate">{project.title}</h4>
                           {project.isStatic ? (
                             <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                               Static
                             </span>
                           ) : (
                             <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                               Uploaded
                             </span>
                           )}
                         </div>
                         <p className="text-sm text-gray-400 truncate">
                           {project.isStatic ? 'Built-in project' : (isUploadedProject(project) ? project.fileName : 'Unknown')}
                         </p>
                       </div>
                       <div className="flex items-center gap-2 ml-4">
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
                     </div>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{project.description}</p>

                                         <div className="flex items-center justify-between">
                       <div className="text-xs text-gray-500">
                         {project.isStatic ? (
                           <span>Built-in media project</span>
                         ) : (
                           isUploadedProject(project) ? (
                             <>
                               <span>{formatFileSize(project.fileSize)}</span>
                               <span className="mx-2">•</span>
                               <span>{new Date(project.uploadDate).toLocaleDateString()}</span>
                             </>
                           ) : (
                             <span>No file info</span>
                           )
                         )}
                       </div>

                                             <div className="flex gap-2">
                         <button
                           onClick={() => startEditingProject(project)}
                           className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded text-xs font-medium transition-colors"
                         >
                           Edit
                         </button>
                         <button
                           onClick={() => deleteProject(project.id)}
                           className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded text-xs font-medium transition-colors"
                           title={project.isStatic ? "Hide static project" : "Permanently delete upload"}
                         >
                           {project.isStatic ? 'Hide' : 'Delete'}
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

                 {/* Show hidden static projects if any */}
         {(() => {
           const storedDeleted = localStorage.getItem('deletedStaticProjects');
           const deletedStatic = storedDeleted ? JSON.parse(storedDeleted) : [];
           const hiddenProjects = staticDesignProjects.filter(p => deletedStatic.includes(p.id));
           
           if (hiddenProjects.length > 0) {
             return (
               <div className="mt-6 pt-4 border-t border-neutral-700">
                 <div className="flex items-center gap-2 mb-3">
                   <div className="text-orange-400 text-sm">⚠️</div>
                   <h4 className="text-sm font-medium text-orange-400">Hidden Static Projects ({hiddenProjects.length})</h4>
                 </div>
                 <div className="space-y-2">
                   {hiddenProjects.map((project: StaticProject) => (
                     <div key={project.id} className="flex items-center justify-between bg-neutral-900/50 border border-orange-500/20 rounded-lg p-3">
                       <div>
                         <span className="text-sm text-white">{project.title}</span>
                         <p className="text-xs text-gray-500">Hidden static project</p>
                       </div>
                       <button
                         onClick={() => {
                           const current = JSON.parse(localStorage.getItem('deletedStaticProjects') || '[]');
                           const updated = current.filter((id: number) => id !== project.id);
                           localStorage.setItem('deletedStaticProjects', JSON.stringify(updated));
                           loadAllProjects();
                         }}
                         className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded text-xs font-medium transition-colors"
                       >
                         Restore
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             );
           }
           return null;
         })()}

         <div className="mt-6 pt-4 border-t border-neutral-700 flex gap-3">
           <button
             onClick={() => setShowManagement(false)}
             className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
           >
             Back to Upload
           </button>
           <Link
             href="/projects"
             className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
           >
             View in Projects
           </Link>
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
            <Link href="/projects" className="text-gray-300 hover:text-cyan-400 transition-colors relative">Projects</Link>
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
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white text-center">
              {isAuthenticated ? "Upload Media Project" : "Restricted Access"}
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              {isAuthenticated 
                ? "Share your creative work with the world. Upload your latest media projects and showcase your talent."
                : "This area requires authentication. Please enter your PIN to continue."
              }
            </p>

            {/* Show PIN form or Upload form based on authentication */}
            {!isAuthenticated ? (
              <PinForm />
            ) : (
              <>
                {/* Upload Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-black/50 backdrop-blur-md rounded-xl overflow-hidden border border-neutral-800/50 shadow-xl"
                >
                  <div className="p-8">
                    <div className="flex items-center mb-8">
                      <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full p-3 mr-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14,2 14,8 20,8"></polyline>
                          <path d="M12 18v-6"></path>
                          <path d="M9 15l3-3 3 3"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-white">Project Details</h3>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
                          <input
                            type="text"
                            name="title"
                            value={uploadFormData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="Enter project title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Project Status</label>
                          <select
                            name="status"
                            value={uploadFormData.status}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                          >
                            <option value="Completed">Completed</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Terminated">Terminated</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                        <textarea
                          name="description"
                          value={uploadFormData.description}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                          placeholder="Describe your project, its goals, and creative process"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Technologies Used</label>
                          <input
                            type="text"
                            name="tech"
                            value={uploadFormData.tech}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="e.g., After Effects, Premiere Pro (comma separated)"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                          <input
                            type="text"
                            name="tags"
                            value={uploadFormData.tags}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="e.g., Animation, Motion Graphics (comma separated)"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Video File *</label>
                        <div className="relative">
                          <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            fileError ? 'border-red-500 bg-red-500/5' : 
                            uploadFormData.videoFile ? 'border-green-500 bg-green-500/5' : 
                            'border-neutral-700 hover:border-cyan-500'
                          }`}>
                            <input
                              type="file"
                              accept="video/*,.mp4,.mov,.avi,.webm,.mkv"
                              onChange={handleFileChange}
                              required
                              disabled={isUploading}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className="flex flex-col items-center">
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={`mb-4 ${
                                fileError ? 'text-red-400' : 
                                uploadFormData.videoFile ? 'text-green-400' : 
                                'text-gray-500'
                              }`}>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <path d="M12 18v-6"></path>
                                <path d="M9 15l3-3 3 3"></path>
                              </svg>
                              <p className={`mb-2 ${
                                fileError ? 'text-red-400' : 
                                uploadFormData.videoFile ? 'text-green-400' : 
                                'text-gray-400'
                              }`}>
                                {isUploading ? 'Uploading...' :
                                 uploadFormData.videoFile ? 'File Selected' : 
                                 'Click to upload or drag and drop large video files'}
                              </p>
                              <p className="text-sm text-gray-500">
                                MP4, MOV, AVI, WebM, MKV up to 3GB
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* File Error */}
                        {fileError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                          >
                            <p className="text-sm text-red-400 flex items-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                              </svg>
                              {fileError}
                            </p>
                          </motion.div>
                        )}

                        {/* File Selected */}
                        {uploadFormData.videoFile && !fileError && (
                          <div className="mt-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm text-green-400 flex items-center mb-2">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                                    <polyline points="20,6 9,17 4,12"></polyline>
                                  </svg>
                                  Selected: {uploadFormData.videoFile.name}
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                                  <div>
                                    <span className="font-medium">Size:</span> {formatFileSize(uploadFormData.videoFile.size)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Type:</span> {uploadFormData.videoFile.type || 'Video file'}
                                  </div>
                                </div>
                                {uploadFormData.videoFile.size > 500 * 1024 * 1024 && (
                                  <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-400">
                                    <span className="font-medium">⚠️ Large file detected:</span> Upload may take several minutes depending on your internet connection.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Upload Progress */}
                        {isUploading && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-cyan-400">Uploading large file...</span>
                              <span className="text-sm text-cyan-400 font-mono">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-neutral-700 rounded-full h-2">
                              <motion.div
                                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Large files may take several minutes to upload. Please don&apos;t close this page.
                            </p>
                          </motion.div>
                        )}
                      </div>

                                                <div className="flex gap-4 pt-6">
                            <Link
                              href="/projects"
                              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors text-center ${
                                isUploading 
                                  ? 'bg-neutral-800 text-gray-500 cursor-not-allowed' 
                                  : 'bg-neutral-700 hover:bg-neutral-600 text-white'
                              }`}
                              style={isUploading ? { pointerEvents: 'none' } : {}}
                            >
                              Cancel
                            </Link>
                            <button
                              type="submit"
                              disabled={isUploading || !!fileError}
                              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all shadow-lg flex items-center justify-center gap-2 ${
                                isUploading || fileError
                                  ? 'bg-neutral-600 text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white hover:shadow-xl'
                              }`}
                            >
                              {isUploading && (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                              )}
                              {isUploading ? 'Uploading...' : 'Upload Project'}
                            </button>
                          </div>
                    </form>
                  </div>
                </motion.div>

                {/* Management Toggle */}
                {allProjects.length > 0 && !showManagement && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8 text-center"
                  >
                    <button
                      onClick={() => setShowManagement(true)}
                      className="inline-flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"></path>
                        <path d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
                      </svg>
                      Manage All Projects ({allProjects.length})
                    </button>
                  </motion.div>
                )}

                {/* Show Management Section */}
                {showManagement && <ManagementSection />}

                {/* Additional Info - Only show when not in management mode */}
                {!showManagement && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-neutral-800/50 text-center">
                      <div className="text-cyan-400 text-2xl mb-3">🎨</div>
                      <h4 className="text-white font-semibold mb-2">Creative Freedom</h4>
                      <p className="text-gray-400 text-sm">Express your artistic vision without limitations</p>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-neutral-800/50 text-center">
                      <div className="text-purple-400 text-2xl mb-3">🚀</div>
                      <h4 className="text-white font-semibold mb-2">Easy Sharing</h4>
                      <p className="text-gray-400 text-sm">Showcase your work to a global audience</p>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-neutral-800/50 text-center">
                      <div className="text-green-400 text-2xl mb-3">⭐</div>
                      <h4 className="text-white font-semibold mb-2">Quality Focus</h4>
                      <p className="text-gray-400 text-sm">High-quality video streaming and presentation</p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
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
