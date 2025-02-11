"use client";
import { Experience as ExperienceType } from "./types";
import { useState } from "react";
import Image from "next/image";
import { experience } from "./data";
import Title from "@/components/ui/Title";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const bgColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
];

export default function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getRandomColor = (index: number) => {
    return bgColors[index % bgColors.length];
  };

  const LogoComponent = ({
    experience,
    index,
  }: {
    experience: ExperienceType;
    index: number;
  }) => {
    if (experience.logo) {
      return (
        <Image
          src={experience.logo}
          alt={`${experience.company} logo`}
          width={40}
          height={50}
          className="h-[40px] w-[50px] object-contain"
        />
      );
    }

    const firstLetter = experience.company.charAt(0);
    const bgColor = getRandomColor(index);

    return (
      <div
        className={`h-full w-full ${bgColor} flex items-center justify-center rounded-2xl`}
      >
        <span className="text-xl font-semibold text-white">{firstLetter}</span>
      </div>
    );
  };

  return (
    <section>
      <Title>{experience.title}</Title>

      <div className="space-y-4">
        {experience.experiences.map(
          (experience: ExperienceType, index: number) => (
            <Card key={index} className="!p-0">
              <div
                className="relative cursor-pointer"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                <CardContent className="flex flex-col justify-between p-4 sm:flex-row sm:items-start">
                  <div className="flex gap-4">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl">
                      <LogoComponent experience={experience} index={index} />
                    </div>
                    <div className="flex flex-col pr-8">
                      <h3 className="text-base font-semibold sm:text-lg">
                        {experience.company}
                      </h3>
                      <p className="text-sm text-gray-600 sm:text-sm">
                        {experience.role}
                      </p>
                      <div className="mt-1 flex flex-col sm:hidden">
                        <span className="text-sm text-gray-500">
                          {experience.period}
                        </span>
                        <span className="text-sm text-gray-500">
                          {experience.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden flex-col items-end gap-2 sm:flex">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="text-right text-xs sm:text-sm">
                          {experience.period}
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center">
                          <ChevronDown
                            size={20}
                            className={`transform transition-transform duration-300 ${
                              expandedIndex === index ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                      <div className="mr-10 flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
                        <span>{experience.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-4 top-4">
                    <div className="flex h-6 w-6 items-center justify-center sm:hidden">
                      <ChevronDown
                        size={20}
                        className={`transform transition-transform duration-300 ${
                          expandedIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </div>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  expandedIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <CardContent
                    onClick={() => {
                      setExpandedIndex(null);
                    }}
                    className="!px-4 !pb-4 !pl-20 !pt-2"
                  >
                    <ul
                      className="list-disc space-y-2 text-sm sm:text-base"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {experience.description.map(
                        (item: string, idx: number) => (
                          <li key={idx} className="text-gray-600">
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </CardContent>
                </div>
              </div>
            </Card>
          ),
        )}
      </div>
    </section>
  );
}
