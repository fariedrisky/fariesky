"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { projectsData } from "./data";
import Title from "@/components/ui/Title";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

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
            <div
              key={project.id}
              className="flex w-[280px] flex-none cursor-pointer flex-col rounded-3xl border bg-white/60 p-3 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl border">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
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
            </div>
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
