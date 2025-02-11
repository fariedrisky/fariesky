"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { projectsData } from "./data";
import Title from "@/components/ui/Title";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";

// Constants
const CARD_WIDTH = 280;
const SCROLL_MULTIPLIER = 2;
const TOUCH_SLOP = 5; // Minimum pixel movement to determine scroll direction

interface ScrollProps {
  direction: "left" | "right";
}

export default function Projects() {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHorizontalScroll, setIsHorizontalScroll] = useState<boolean | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1,
    );
  }, []);

  useEffect(() => {
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkScroll]);

  const scroll = useCallback(({ direction }: ScrollProps) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = direction === "right" ? CARD_WIDTH : -CARD_WIDTH;
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const handleDragStart = useCallback((pointX: number, pointY: number) => {
    const container = containerRef.current;
    if (!container) return;

    setIsDragging(true);
    setStartX(pointX - container.offsetLeft);
    setStartY(pointY);
    setScrollLeft(container.scrollLeft);
    setIsHorizontalScroll(null);
  }, []);

  const handleDragMove = useCallback(
    (pointX: number, pointY: number) => {
      if (!isDragging) return;

      const container = containerRef.current;
      if (!container) return;

      const deltaX = Math.abs(pointX - container.offsetLeft - startX);
      const deltaY = Math.abs(pointY - startY);

      // Determine scroll direction if not yet determined
      if (
        isHorizontalScroll === null &&
        (deltaX > TOUCH_SLOP || deltaY > TOUCH_SLOP)
      ) {
        const isHorizontal = deltaX > deltaY;
        setIsHorizontalScroll(isHorizontal);
      }

      // Only handle horizontal scrolling
      if (isHorizontalScroll) {
        const x = pointX - container.offsetLeft;
        const walk = (x - startX) * SCROLL_MULTIPLIER;
        container.scrollLeft = scrollLeft - walk;
      }
    },
    [isDragging, startX, startY, scrollLeft, isHorizontalScroll],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setIsHorizontalScroll(null);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleDragStart(e.pageX, e.pageY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleDragMove(e.pageX, e.pageY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleDragStart(e.touches[0].pageX, e.touches[0].pageY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isHorizontalScroll) {
      e.preventDefault(); // Prevent vertical scrolling only when horizontal scrolling is detected
    }
    handleDragMove(e.touches[0].pageX, e.touches[0].pageY);
  };

  return (
    <section className="w-full">
      <Title>{projectsData.title}</Title>

      <div className="relative mt-8">
        <div
          ref={containerRef}
          className="flex cursor-grab touch-pan-x select-none gap-6 overflow-x-hidden scroll-smooth px-2 py-4 active:cursor-grabbing"
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          {projectsData.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={() => scroll({ direction: "left" })}
            className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-neutral-800/30 p-1.5 text-white shadow-md transition duration-150 hover:bg-neutral-800/40 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft size={30} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll({ direction: "right" })}
            className="absolute -right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-neutral-800/30 p-1.5 text-white shadow-md transition duration-150 hover:bg-neutral-800/40 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight size={30} />
          </button>
        )}
      </div>
    </section>
  );
}
