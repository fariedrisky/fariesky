"use client";
import Image from "next/image";
import { languages } from "./data";
import { Language as LanguageType } from "./types";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";

export default function Languages() {
  return (
    <section>
      <Title>{languages.title}</Title>

      <div className="space-y-4">
        {languages.languages.map((language: LanguageType, index: number) => (
          <Card key={index} className="!overflow-hidden">
            <CardContent className="flex items-center justify-between !p-0">
              <div className="flex items-center gap-4 text-base sm:text-lg">
                {language.logo && (
                  <div className="relative h-8 w-8">
                    <Image
                      src={language.logo}
                      alt={`${language.name} language`}
                      fill
                      sizes="(max-width: 32px) 100vw"
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{language.name}</h3>
                  <p className="text-gray-600">{language.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
