import React from "react";
import { aboutData } from "./data";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";

export default function About() {
  return (
    <section>
      <Title>{aboutData.title}</Title>

      <Card>
        <CardContent>
          {aboutData.description.map((paragraph, index) => (
            <p
              key={index}
              className="text-sm sm:text-base text-left leading-relaxed text-gray-600"
            >
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
