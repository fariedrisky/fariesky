"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { profile } from "./data";
import { MapPin, Phone, Mail, Menu, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ProfileProps {
  variant: "desktop" | "tablet" | "mobile";
}

const Profile = ({ variant }: ProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {}, [isOpen]);

  const handleContactClick = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const ProfileContent = () => (
    <div
      className={`flex ${variant === "tablet" ? "flex-row gap-8" : "flex-col"}`}
    >
      {variant === "desktop" && (
        <div className="mb-6">
          <Image
            src="/assets/images/avatar.jpg"
            alt="Profile"
            className="h-72 w-full rounded-2xl object-cover"
            width={400}
            height={288}
            priority
          />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <div
          className={`flex items-start justify-between ${variant === "tablet" ? "gap-6" : "gap-4"}`}
        >
          <div className="flex gap-4">
            {variant !== "desktop" && (
              <Image
                src="/assets/images/avatar.jpg"
                alt="Profile"
                className={`rounded-2xl object-cover ${variant === "tablet" ? "h-32 w-32" : "h-20 w-20"}`}
                width={variant === "tablet" ? 128 : 80}
                height={variant === "tablet" ? 128 : 80}
                priority
              />
            )}

            <div className="flex flex-1 flex-col space-y-2">
              <h2
                className={`font-semibold text-gray-800 ${variant === "mobile" ? "text-lg" : "text-2xl"}`}
              >
                {profile.name}
              </h2>
              <p
                className={`${variant === "mobile" ? "text-sm" : "text-md"} text-gray-600`}
              >
                {profile.role}
              </p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin
                    className={`text-gray-500 ${variant === "mobile" ? "h-4 w-4" : "h-5 w-5"}`}
                  />
                  <span
                    className={`text-gray-600 ${variant === "mobile" ? "text-sm" : ""}`}
                  >
                    {profile.location}
                  </span>
                </div>
                {variant === "mobile" && isOpen && (
                  <>
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
                  </>
                )}
              </div>
              {!variant?.includes("mobile") && !variant?.includes("tablet") && (
                <>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600">{profile.email}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {variant === "mobile" && (
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="!rounded-xl p-2"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>

        {variant === "mobile" && (
          <div
            ref={contentRef}
            className={`overflow-hidden transition-all duration-300 ${isOpen ? "mt-4 opacity-100" : "mt-0 opacity-0"} ${
              isOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full rounded-xl text-sm">
                  Download CV
                </Button>
                <Button
                  className="w-full rounded-xl bg-gray-900 text-sm text-white hover:bg-gray-800"
                  onClick={handleContactClick}
                >
                  Contact Me
                </Button>
              </div>
            </div>
          </div>
        )}

        {variant === "desktop" && (
          <div className="mt-6">
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full rounded-xl">
                Download CV
              </Button>
              <Button
                className="w-full rounded-xl bg-gray-900 text-white hover:bg-gray-800"
                onClick={handleContactClick}
              >
                Contact Me
              </Button>
            </div>
          </div>
        )}
      </div>

      {variant === "tablet" && (
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
            <Button variant="outline" className="w-full rounded-xl">
              Download CV
            </Button>
            <Button
              className="w-full rounded-xl bg-gray-900 text-white hover:bg-gray-800"
              onClick={handleContactClick}
            >
              Contact Me
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card
      className={`${variant === "tablet" ? "mx-auto max-w-4xl" : "w-full"} bg-white p-6`}
    >
      <CardContent className="p-0">
        <ProfileContent />
      </CardContent>
    </Card>
  );
};

export default Profile;
