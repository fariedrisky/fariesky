import Title from "@/components/ui/Title";
import { Card } from "@/components/ui/Card";
import { skillsData } from "./data";

export default function Skills() {
  return (
    <section>
      <Title>{skillsData.title}</Title>

      {/* Skills Grid */}
      <div className="flex justify-center items-center flex-wrap gap-4">
        {skillsData.skills.map((skill: string, index: number) => (
          <Card key={index} className="cursor-pointer px-6 py-2">
            <span className="text-sm text-gray-700 sm:text-base">{skill}</span>
          </Card>
        ))}
      </div>
    </section>
  );
}
