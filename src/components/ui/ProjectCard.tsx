import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function usePreloadImages(images: string[]) {
  useEffect(() => {
    const preloadImage = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = document.createElement("img");
        img.src = src;
        img.onload = () => {
          resolve();
        };
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${src}`));
        };
      });
    };

    Promise.all(images.map((src) => preloadImage(src))).catch((error) =>
      console.error("Error preloading images:", error),
    );
  }, [images]);
}

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    image: string[];
    url: string;
  };
}

// Option 1: Remove memo completely if images update frequently
const ProjectCard = function ProjectCard({ project }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  usePreloadImages(project.image);

  // Reset currentImageIndex when images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project.image]);

  useEffect(() => {
    if (project.image.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.image.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [project.image.length]);

  // Convert image array to lightbox format
  const lightboxImages = project.image.map((src) => ({
    src,
    width: 1920,
    height: 1080,
    alt: project.title,
  }));

  return (
    <div className="flex w-[280px] flex-none cursor-pointer flex-col rounded-3xl border bg-white/60 p-3 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
      <div
        className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl border"
        onClick={() => setIsLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsLightboxOpen(true);
          }
        }}
      >
        {project.image.map((img, index) => (
          <Image
            key={`${img}-${index}`} // Added index to key for better uniqueness
            src={img}
            alt={`${project.title} - Image ${index + 1}`}
            fill
            className={`absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-500 ${
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            }`}
            sizes="280px"
            priority={index === 0}
          />
        ))}
      </div>

      <h3 className="mb-2 truncate px-2 text-lg font-semibold">
        {project.title}
      </h3>
      <p className="mb-4 flex-grow px-2 text-sm text-gray-600">
        {project.description}
      </p>

      <Link
        href={project.url}
        target="_blank"
        className="group inline-flex items-center px-2 py-2 text-sm text-gray-600 hover:text-gray-900 sm:text-base"
      >
        <span className="mr-2">Click to view</span>
        <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={lightboxImages}
        index={currentImageIndex}
        carousel={{ finite: project.image.length <= 1 }}
        render={{
          buttonPrev: project.image.length <= 1 ? () => null : undefined,
          buttonNext: project.image.length <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
};

export default ProjectCard;
