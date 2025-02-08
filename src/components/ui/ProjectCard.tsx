import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Modal from "./Modal";
import { Button } from "./Button";
import { ProjectModalContent } from "./ProjectModalContent";

function usePreloadImages(images: string[]) {
  useEffect(() => {
    const preloadImage = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = document.createElement("img");
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      });
    };

    Promise.all(images.map((src) => preloadImage(src))).catch((error) =>
      console.error("Error preloading images:", error),
    );
  }, [images]);
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string[];
  url: string;
  techStack?: string[];
  features?: string[];
  date?: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  usePreloadImages(project.image);

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

  const lightboxImages = project.image.map((src) => ({
    src,
    width: 1920,
    height: 1080,
    alt: project.title,
  }));

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[role="button"]') && !target.closest("a")) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        className="flex w-[280px] flex-none cursor-pointer flex-col rounded-3xl border bg-white p-3 transition-all duration-300 hover:shadow-lg"
        onClick={handleCardClick}
      >
        <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl border">
          {project.image.map((img, index) => (
            <Image
              key={`${img}-${index}`}
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

        <h3 className="mb-2 truncate px-2 text-center text-lg font-semibold">
          {project.title}
        </h3>
        <p className="mb-4 flex-grow px-2 text-justify text-sm text-gray-600 [word-spacing:-2px] [letter-spacing:-0.02em]">
  {project.description}
</p>

        <Button
          variant="outline"
          className="group !rounded-[15px] p-0 shadow-none hover:!bg-neutral-50"
        >
          <Link
            href={project.url}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <span className="mr-2">Click to view</span>
            <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>

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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProjectModalContent
          project={project}
          currentImageIndex={currentImageIndex}
          setIsLightboxOpen={setIsLightboxOpen}
        />
      </Modal>
    </>
  );
}
