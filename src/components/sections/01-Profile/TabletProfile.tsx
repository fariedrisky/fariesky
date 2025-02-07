"use client";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { profile } from "./data";
import { DownloadCV } from "@/components/cv/03-DownloadCV";

interface TabletProfileProps {
  onContactClick: () => void;
}

export default function TabletProfile({ onContactClick }: TabletProfileProps) {
  return (
    <Card className="mx-auto max-w-4xl bg-white p-6">
      <CardContent className="p-0">
        <div className="flex flex-row gap-8">
          <div className="flex flex-1 flex-col">
            <div className="flex gap-4">
              <Image
                src="/assets/images/avatar.jpg"
                alt="Profile"
                className="h-32 w-32 rounded-2xl object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                width={128}
                height={128}
                priority
              />

              <div className="flex flex-1 flex-col space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {profile.name}
                </h2>
                <p className="text-md text-gray-600">{profile.role}</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">{profile.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-64 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">{profile.email}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <DownloadCV />
              <Button
                className="w-full rounded-xl bg-gray-900 text-white hover:bg-gray-800"
                onClick={onContactClick}
              >
                Contact Me
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
