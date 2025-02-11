"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, X, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { profile } from "./data";
import CVButton from "@/components/cv/03-CVButton";

interface MobileProfileProps {
  onContactClick: () => void;
}

export default function MobileProfile({ onContactClick }: MobileProfileProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const pdfButton = useMemo(() => <CVButton />, []);

  return (
    <Card className="w-full bg-white !p-0">
      <div
        className="relative cursor-pointer"
        onClick={() => setExpandedIndex(expandedIndex === 0 ? null : 0)}
      >
        <CardContent className="flex items-start justify-between !p-4">
          <div className="flex gap-4">
            <div className="relative h-20 w-20">
              <Image
                src="/assets/images/avatar.jpg"
                alt="Profile"
                className="rounded-2xl object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                priority
              />
            </div>

            <div className="flex flex-1 flex-col space-y-2 pr-8">
              <h2 className="text-lg font-semibold text-gray-800">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-600">{profile.role}</p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {profile.location}
                  </span>
                </div>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    expandedIndex === 0
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {profile.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {profile.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-4 top-4">
            <div className="flex h-6 w-6 items-center justify-center">
              <div
                className={`transform transition-transform duration-300 ${
                  expandedIndex === 0 ? "rotate-180" : ""
                }`}
              >
                {expandedIndex === 0 ? (
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
          expandedIndex === 0
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <CardContent className="!px-4 !pb-4 !pt-0">
            <div className="flex flex-col gap-2">
              {pdfButton}
              <Button
                className="w-full rounded-xl bg-gray-900 text-sm text-white hover:bg-gray-800"
                onClick={onContactClick}
              >
                Contact Me
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
