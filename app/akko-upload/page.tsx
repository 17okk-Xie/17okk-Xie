"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Meteors } from "../../components/magicui/meteors";
import Link from "next/link";

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
      
      // Show success message with link to projects
      const viewProjects = confirm("Video uploaded successfully and added to Media projects! Click OK to view your upload in the Projects page, or Cancel to upload another video.");
      
      if (viewProjects) {
        window.location.href = '/projects';
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
                              Large files may take several minutes to upload. Please don't close this page.
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

                {/* Additional Info */}
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
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
