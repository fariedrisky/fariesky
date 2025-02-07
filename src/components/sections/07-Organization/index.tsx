"use client";
import { Organization as OrganizationType } from "./types";
import { useState } from "react";
import Image from "next/image";
import { organization } from "./data";
import Title from "@/components/ui/Title";
import { X, ChevronDown } from "lucide-react";
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

export default function Organization() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getRandomColor = (index: number) => {
    return bgColors[index % bgColors.length];
  };

  const LogoComponent = ({
    organization,
    index,
  }: {
    organization: OrganizationType;
    index: number;
  }) => {
    if (organization.logo) {
      return (
        <Image
          src={organization.logo}
          alt={`${organization.name} logo`}
          width={40}
          height={50}
          className="object-contain"
        />
      );
    }

    const firstLetter = organization.name.charAt(0);
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
      <Title>{organization.title}</Title>

      <div className="space-y-4">
        {organization.organizations.map(
          (organization: OrganizationType, index: number) => (
            <Card key={index} className="overflow-hidden !bg-white !p-0">
              <div
                className="cursor-pointer transition-colors duration-300 hover:bg-gray-50"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                <CardContent className="flex items-start justify-between !p-4">
                  <div className="flex gap-4">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl">
                      <LogoComponent
                        organization={organization}
                        index={index}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {organization.name}
                      </h3>
                      <p className="text-gray-600">{organization.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="text-right text-sm">
                          {organization.period}
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
                        <span>{organization.location}</span>
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
                    <ul className="list-disc space-y-2">
                      {organization.description.map(
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
