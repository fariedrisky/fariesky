"use client";
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
            <CardContent className="!ml-5 flex items-center justify-between !p-0">
              <div className="flex items-center gap-4 text-base sm:text-lg">
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
