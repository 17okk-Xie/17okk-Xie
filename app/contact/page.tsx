"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Meteors } from "../../components/magicui/meteors";
import Link from "next/link";
import Image from "next/image";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "../../components/ui/animated-modal";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      }, 3000);
    }, 1500);
  };

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
            <Link href="/contact" className="text-cyan-400 transition-colors relative">Contact</Link>
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
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white text-center">Get In Touch</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Personal Information - Left Column */}
              <div className="md:col-span-1">
                <div className="bg-black/50 backdrop-blur-md rounded-xl overflow-hidden border border-neutral-800/50 shadow-xl">
                  <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-cyan-400 mb-4">
                        <Image
                          src="/images/Yixi.jpeg"
                          alt="Yixi Xie"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Yixi Xie</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-cyan-500/20 p-2 rounded mr-3 text-cyan-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-sm text-white">17okk.xie@gmail.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-cyan-500/20 p-2 rounded mr-3 text-cyan-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Phone</p>
                          <p className="text-sm text-white">+1 (845) 321-5664</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-cyan-500/20 p-2 rounded mr-3 text-cyan-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Location</p>
                          <p className="text-sm text-white">Greensboro, NC</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-cyan-500/20 p-2 rounded mr-3 text-cyan-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Website</p>
                          <Link href="https://17okk-xie.vercel.app" className="text-sm text-white">17okk-xie.vercel.app</Link>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-neutral-800">
                      <p className="text-sm text-gray-400">依旧开户/.</p>
                    </div>

                  </div>
                </div>
              </div>
              
              {/* Contact Form - Right Column */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="bg-black/50 backdrop-blur-md rounded-xl overflow-hidden border border-neutral-800/50 shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-white mb-6">Send Me a Message</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-neutral-900/70 border border-neutral-800 focus:border-cyan-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                        placeholder="Yixi"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-neutral-900/70 border border-neutral-800 focus:border-cyan-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                        placeholder="17okk.xie@gmail.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-neutral-900/70 border border-neutral-800 focus:border-cyan-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                      placeholder="Coming soon..."
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full bg-neutral-900/70 border border-neutral-800 focus:border-cyan-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                      placeholder="Message function is not available yet..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${isSubmitting || submitSuccess ? 'bg-cyan-800 text-gray-300' : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/20'}`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : submitSuccess ? (
                        <span className="flex items-center">
                          <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Sent Successfully! (假的，别信)
                        </span>
                      ) : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 