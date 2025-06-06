"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { projectsData } from "./data";
import Title from "@/components/ui/Title";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";

// Constants
const CARD_WIDTH = 280;
const SCROLL_MULTIPLIER = 2;
const TOUCH_SLOP = 5;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isHorizontalRef = useRef(false);
  const initialTouchRef = useRef(false);

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const touchStartHandler = (e: TouchEvent) => {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - container.offsetLeft);
      setStartY(e.touches[0].pageY);
      setScrollLeft(container.scrollLeft);
      isHorizontalRef.current = false;
      initialTouchRef.current = true;
    };

    const touchMoveHandler = (e: TouchEvent) => {
      if (!isDragging) return;

      const pointX = e.touches[0].pageX;
      const pointY = e.touches[0].pageY;
      const deltaX = Math.abs(pointX - container.offsetLeft - startX);
      const deltaY = Math.abs(pointY - startY);

      if (
        initialTouchRef.current &&
        (deltaX > TOUCH_SLOP || deltaY > TOUCH_SLOP)
      ) {
        initialTouchRef.current = false;
        isHorizontalRef.current = deltaX > deltaY;
      }

      if (isHorizontalRef.current) {
        e.preventDefault();
        const x = pointX - container.offsetLeft;
        const walk = (x - startX) * SCROLL_MULTIPLIER;
        container.scrollLeft = scrollLeft - walk;
      }
    };

    const touchEndHandler = () => {
      setIsDragging(false);
      isHorizontalRef.current = false;
      initialTouchRef.current = false;
    };

    container.addEventListener("touchstart", touchStartHandler, {
      passive: false,
    });
    container.addEventListener("touchmove", touchMoveHandler, {
      passive: false,
    });
    container.addEventListener("touchend", touchEndHandler, { passive: false });

    return () => {
      container.removeEventListener("touchstart", touchStartHandler);
      container.removeEventListener("touchmove", touchMoveHandler);
      container.removeEventListener("touchend", touchEndHandler);
    };
  }, [isDragging, scrollLeft, startX, startY]);

  const scroll = useCallback(({ direction }: ScrollProps) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = direction === "right" ? CARD_WIDTH : -CARD_WIDTH;
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="w-full">
      <Title marginBottom="!mb-2">{projectsData.title}</Title>

      <div
        ref={containerRef}
        className="flex select-none gap-6 overflow-x-hidden scroll-smooth px-2 py-4"
        onScroll={checkScroll}
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
    </section>
  );
}
