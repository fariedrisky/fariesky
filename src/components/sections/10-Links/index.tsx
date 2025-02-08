"use client";
import Link from "next/link";
import Image from "next/image";
import { links } from "./data";
import Title from "@/components/ui/Title";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function Links() {
  return (
    <section>
      <Title>{links.title}</Title>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {links.links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block no-underline"
          >
            <Card className="flex items-center justify-between transition-all duration-300 hover:scale-105 active:scale-95">
              <div className="flex items-center gap-3">
                <div className="relative h-5 w-5">
                  <Image
                    src={link.logo}
                    alt={`${link.title} logo`}
                    fill
                    sizes="(max-width: 20px) 100vw"
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
                <span className="text-base text-gray-700 sm:text-lg">
                  {link.title}
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
