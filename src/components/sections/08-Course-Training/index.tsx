"use client";
import { Course as CourseType } from "./types";
import { useState } from "react";
import Image from "next/image";
import { course } from "./data";
import Title from "@/components/ui/Title";
import { X, ChevronDown, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";

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

export default function Course() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getRandomColor = (index: number) => {
    return bgColors[index % bgColors.length];
  };

  const LogoComponent = ({
    course,
    index,
  }: {
    course: CourseType;
    index: number;
  }) => {
    if (course.logo) {
      return (
        <Image
          src={course.logo}
          alt={`${course.provider} logo`}
          width={40}
          height={50}
          className="h-[40px] w-[50px] object-contain"
        />
      );
    }

    const firstLetter = course.provider.charAt(0);
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
      <Title>{course.title}</Title>

      <div className="space-y-4">
        {course.courses.map((course: CourseType, index: number) => (
          <Card key={index} className="overflow-hidden !bg-white !p-0">
            <div
              className="relative cursor-pointer"
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
            >
              <CardContent className="flex flex-col justify-between !p-4 sm:flex-row sm:items-start">
                <div className="flex gap-4">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl">
                    <LogoComponent course={course} index={index} />
                  </div>
                  <div className="flex flex-col pr-8">
                    <h3 className="text-base font-semibold sm:text-lg">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-600">{course.provider}</p>
                    <div className="mt-1 flex flex-col sm:hidden">
                      <span className="text-sm text-gray-500">
                        {course.period}
                      </span>
                      <span className="text-sm text-gray-500">
                        {course.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden flex-col items-end gap-2 sm:flex">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="text-right text-sm">
                        {course.period}
                      </span>
                      <div className="flex h-6 w-6 items-center justify-center">
                        <div
                          className={`transform transition-transform duration-300 ${
                            expandedIndex === index ? "rotate-180" : ""
                          }`}
                        >
                          {expandedIndex === index ? (
                            <X size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mr-10 flex items-center gap-1 text-sm text-gray-500">
                      <span>{course.location}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute right-4 top-4">
                  <div className="flex h-6 w-6 items-center justify-center sm:hidden">
                    <div
                      className={`transform transition-transform duration-300 ${
                        expandedIndex === index ? "rotate-180" : ""
                      }`}
                    >
                      {expandedIndex === index ? (
                        <X size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
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
                <CardContent className="!px-4 !pb-4 !pl-20 !pt-2">
                  <ul className="list-disc space-y-2 text-sm sm:text-base">
                    {course.description.map((item: string, idx: number) => (
                      <li key={idx} className="text-gray-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {course.certificateUrl && (
                    <div className="mt-4 flex items-center gap-2">
                      <Link
                        href={course.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center px-2 py-2 text-sm text-gray-600 hover:text-gray-900 sm:text-base"
                      >
                        <span className="mr-2">Certificate Source</span>
                        <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  )}
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
