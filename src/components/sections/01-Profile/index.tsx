"use client";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { profile } from "./data";
import CVButton from "@/components/cv/03-CVButton";
import MobileProfile from "./MobileProfile";
import TabletProfile from "./TabletProfile";

interface ProfileProps {
  variant: "desktop" | "tablet" | "mobile";
}

export default function Profile({ variant }: ProfileProps) {
  const handleContactClick = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  if (variant === "mobile") {
    return <MobileProfile onContactClick={handleContactClick} />;
  }

  if (variant === "tablet") {
    return <TabletProfile onContactClick={handleContactClick} />;
  }

  return (
    <Card className="w-full !rounded-[35px] bg-white p-6">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="mb-6">
            <Image
              src="/assets/images/avatar.jpg"
              alt="Profile"
              className="h-72 w-full rounded-[30px] object-cover"
              width={400}
              height={288}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                {profile.name}
              </h2>
              <p className="text-md text-gray-600">{profile.role}</p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">{profile.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-3">
                <CVButton />
                <Button
                  className="w-full rounded-xl bg-gray-900 text-white hover:bg-gray-800"
                  onClick={handleContactClick}
                >
                  Contact Me
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
