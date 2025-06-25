/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
    IconSignature,
    IconRocket,
    IconCode, 
    IconUser,
    IconSettings,
} from "@tabler/icons-react";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "@/components/ui/animated-modal";
import Image from "next/image";

export const BentoGridProps = (): React.ReactElement => {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <Modal key={i}>
            <ModalTrigger className="w-full h-full p-0 bg-transparent cursor-pointer">
              <BentoGridItem
                title={item.title}
                description={item.description}
                header={item.header}
                className={item.className}
                icon={item.icon}
              />
            </ModalTrigger>
            <ModalBody>
              <ModalContent>
                <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
                <div className="mb-6">
                  {item.modalContent || (
                    <>
                      <p className="mb-4">{item.description}</p>
                      <div className="w-full aspect-video rounded-lg overflow-hidden">
                        {item.header}
                      </div>
                    </>
                  )}
                </div>
              </ModalContent>
            </ModalBody>
          </Modal>
        ))}
    </BentoGrid>
  );
}

// Adding back Skeleton component with a comment to indicate it's not directly used
const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-3/4 h-3/4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-2xl" />
        </div>
    </div>
);

const VideoComponent = ({ src }: { src: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    // Fix the isHovering usage
    const [isHovering, setIsHovering] = useState(false);
    
    const handleMouseEnter = () => {
        setIsHovering(true);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };
    
    const handleMouseLeave = () => {
        setIsHovering(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };
    
    // Use isHovering to conditionally set a class if needed in the future
    const videoContainerClass = `flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden ${isHovering ? 'is-playing' : ''}`;
    
    return (
        <div 
            className={videoContainerClass}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                loop 
                muted 
                playsInline
                poster={`${src}?frame=1`}
            >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

const ImageComponent = ({ src, alt }: { src: string; alt: string }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <div className="relative w-full h-full flex items-center justify-center">
            <Image 
                src={src} 
                alt={alt} 
                width={400}
                height={300}
                className="object-contain max-h-full" 
                priority
            />
        </div>
    </div>
);

interface ItemType {
  title: string;
  description: string;
  header: React.ReactNode;
  className: string;
  icon: React.ReactNode;
  modalContent?: React.ReactNode;
}

const items: ItemType[] = [
    {
      title: "Frontend Development",
      description: "React, Next.js, TypeScript, and modern CSS frameworks including Tailwind",
      header: <ImageComponent src="/images/frontend.png" alt="Frontend Development" />,
      className: "md:col-span-2",
      icon: <IconCode className="h-4 w-4 text-neutral-500" />,
      modalContent: (
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden shadow-md mb-6">
            <Image 
              src="/images/frontend.png" 
              alt="Frontend Development"
              width={800}
              height={450}
              className="w-full object-cover"
            />
          </div>
          <p>My frontend development skills include:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>React.js and Next.js for building modern user interfaces</li>
            <li>TypeScript for type-safe code</li>
            <li>CSS frameworks like Tailwind CSS</li>
            <li>Responsive design and accessibility best practices</li>
            <li>Animation and interactive UI components</li>
          </ul>
        </div>
      )
    },
    {
      title: "Video Editing",
      description: "Adobe After Effects & Adobe Premiere Pro",
      header: <VideoComponent src="/videos/ae-prac.mp4" />,
      className: "md:col-span-1",
      icon: <IconSettings className="h-4 w-4 text-neutral-500" />,
      modalContent: (
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <video 
              className="w-full h-full object-cover"
              autoPlay 
              loop 
              playsInline
              controls
            >
              <source src="/videos/ae-prac.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p>Video editing expertise with professional software:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Advanced motion graphics in After Effects</li>
            <li>Video editing and color grading in Premiere Pro</li>
            <li>Visual effects and compositing</li>
            <li>Animation and keyframing techniques</li>
            <li>Audio synchronization and mixing</li>
          </ul>
        </div>
      )
    },
    {
      title: "Presentation & Leadership",
      description: "PowerPoint & Xmind",
      header: <ImageComponent src="/images/Poster-iHive.png" alt="Presentation Skills - iHive Poster" />,
      className: "md:col-span-1",
      icon: <IconUser className="h-4 w-4 text-neutral-500" />,
      modalContent: (
        <div className="space-y-5">
          <div className="rounded-lg overflow-hidden shadow-md">
            <Image 
              src="/images/Poster-iHive.png" 
              alt="iHive Project Presentation Poster" 
              width={800}
              height={600}
              className="w-full object-contain bg-white/5"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/90 p-5 rounded-xl border border-neutral-700/40 shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/20 hover:translate-y-[-2px]">
              <h4 className="font-medium text-cyan-400 mb-3 flex items-center">
                <span className="w-6 h-6 flex items-center justify-center bg-cyan-500/20 rounded-full mr-2 text-xs">1</span>
                Visual Organization
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Information architecture and hierarchy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Clean, impactful layouts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Strategic use of whitespace</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Visual storytelling techniques</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/90 p-5 rounded-xl border border-neutral-700/40 shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/20 hover:translate-y-[-2px]">
              <h4 className="font-medium text-cyan-400 mb-3 flex items-center">
                <span className="w-6 h-6 flex items-center justify-center bg-cyan-500/20 rounded-full mr-2 text-xs">2</span>
                Dynamic Animations
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Smooth transitions between slides</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Attention-guiding motion effects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Interactive elements and triggers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Morph transitions for fluid experiences</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/90 p-5 rounded-xl border border-neutral-700/40 shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/20 hover:translate-y-[-2px]">
              <h4 className="font-medium text-cyan-400 mb-3 flex items-center">
                <span className="w-6 h-6 flex items-center justify-center bg-cyan-500/20 rounded-full mr-2 text-xs">3</span>
                Team Project Showcases
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Cohesive project narratives</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Data visualization and infographics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Progress tracking and milestone displays</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Executive-ready summary slides</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/90 p-5 rounded-xl border border-neutral-700/40 shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/20 hover:translate-y-[-2px]">
              <h4 className="font-medium text-cyan-400 mb-3 flex items-center">
                <span className="w-6 h-6 flex items-center justify-center bg-cyan-500/20 rounded-full mr-2 text-xs">4</span>
                Mind Mapping
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Structured thought organization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Complex idea visualization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Project planning and roadmapping</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Brainstorming facilitation</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-neutral-700">
            <p className="text-sm text-gray-400 italic">
              Shown above: iHive platform presentation poster - a perfect example of translating complex concepts into visually engaging materials.
              <br />
              <br />
              Live Demo: <a href="https://ihive.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-500 transition-colors">https://ihive.vercel.app/</a>
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Magic Tricks",
      description: "Cards & Coins Tricks",
      header: <VideoComponent src="/videos/Snap-Deal.mp4" />,
      className: "md:col-span-2",
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
      modalContent: (
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <video 
              className="w-full h-full object-cover"
              autoPlay 
              loop 
              playsInline
              controls
            >
              <source src="/videos/Snap-Deal.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p>Card tricks: Snap Deal</p>
        </div>
      )
    },
    {
      title: "Classical Chinese Dance",
      description: "Jumping, Spinning, and Flipping",
      header: <ImageComponent src="/images/双飞燕.JPG" alt="Classical Chinese Dance" />,
      className: "md:col-span-2",
      icon: <IconRocket className="h-4 w-4 text-neutral-500" />,
      modalContent: (
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="relative aspect-video">
              <Image
                src="/images/双飞燕.JPG"
                alt="Classical Chinese Dance"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <p className="mb-6">Techniques: jumping, spinning, and flipping</p>
        </div>
      )
    },
];