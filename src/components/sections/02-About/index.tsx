import React from "react";
import { about } from "./data";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";

export default function About() {
  return (
    <section>
      <Title>{about.title}</Title>

      <Card>
        <CardContent>
          {about.description.map((paragraph, index) => (
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
