"use client";
import { useState, useRef } from "react";
import { projectsData } from "./data";
import Title from "@/components/ui/Title";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";

export default function Projects() {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1,
    );
  };

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const cardWidth = 280;
    const scrollAmount = direction === "right" ? cardWidth : -cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <Title>{projectsData.title}</Title>

      <div className="relative mt-8">
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-hidden scroll-smooth px-2 py-4"
          onScroll={checkScroll}
        >
          {projectsData.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-neutral-800/30 p-1.5 text-white shadow-md transition duration-150 active:scale-95"
          >
            <ChevronLeft size={30} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-neutral-800/30 p-1.5 text-white shadow-md transition duration-150 active:scale-95"
          >
            <ChevronRight size={30} />
          </button>
        )}
      </div>
    </section>
  );
}
