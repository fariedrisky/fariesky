import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectModalContentProps {
  project: {
    title: string;
    date?: string;
    image: string[];
    description: string;
    techStack?: string[];
    features?: string[];
    url: string;
  };
  currentImageIndex: number;
  setIsLightboxOpen: (isOpen: boolean) => void;
}

export function ProjectModalContent({
  project,
  currentImageIndex,
  setIsLightboxOpen,
}: ProjectModalContentProps) {
  return (
    <div className="flex h-full flex-col gap-5">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-bold lg:text-2xl">{project.title}</h2>
        {project.date && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 lg:text-base">
            <span className="font-medium">Published:</span>
            <span>{project.date}</span>
          </div>
        )}
      </div>

      {/* Main Content Section */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left Column - Image */}
        <div className="lg:col-span-7">
          <div
            className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-2xl border lg:aspect-[16/9]"
            onClick={() => setIsLightboxOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsLightboxOpen(true);
              }
            }}
          >
            <Image
              src={project.image[currentImageIndex]}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </div>

          {/* Description under image on desktop */}
          <div className="mt-4 hidden lg:block">
            <p className="text-justify text-base text-gray-600">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* Description only visible on mobile */}
          <p className="text-justify text-sm text-gray-600 [letter-spacing:-0.02em] [word-spacing:-2px] lg:hidden">
            {project.description}
          </p>

          {/* Tech Stack Section */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold lg:text-lg">Technologies</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700 lg:px-3 lg:py-1 lg:text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold lg:text-lg">Key Features</h3>
              <ul className="grid gap-1.5 text-sm text-gray-600 lg:text-base">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-500 lg:mt-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* URL Section */}
          <div className="mt-auto space-y-1.5">
            <h3 className="text-sm font-semibold lg:text-lg">Project URL</h3>
            <Link
              href={project.url}
              target="_blank"
              className="group inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 lg:text-base"
            >
              <span className="break-all">{project.url}</span>
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 lg:h-4 lg:w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
