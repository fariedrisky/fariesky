"use client";
import Image from "next/image";
import { education } from "./data";
import { Education as EducationType } from "./types";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";

export default function Education() {
  return (
    <section>
      <Title>{education.title}</Title>

      <div className="space-y-4">
        {education.educations.map((education: EducationType, index: number) => (
          <Card
            key={index}
            className="!overflow-hidden !rounded-3xl !bg-white !p-0"
          >
            <CardContent className="flex flex-col justify-between !p-4 sm:flex-row sm:items-start">
              <div className="flex gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Image
                    src={education.logo}
                    alt={`${education.school} logo`}
                    width={40}
                    height={50}
                    className="h-[40px] w-[50px] object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold sm:text-lg">
                    {education.school}
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p className="text-sm sm:text-base">{education.degree}</p>
                    {education.score && (
                      <p className="text-sm text-gray-500">{education.score}</p>
                    )}
                  </div>
                  <div className="mt-1 flex flex-col sm:hidden">
                    <span className="text-sm text-gray-500">
                      {education.period}
                    </span>
                    <span className="text-sm text-gray-500">
                      {education.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden flex-col items-end gap-2 sm:flex">
                <div className="flex flex-col items-end">
                  <span className="text-right text-sm text-gray-500">
                    {education.period}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>{education.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
