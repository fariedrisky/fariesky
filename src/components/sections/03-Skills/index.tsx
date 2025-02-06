import Title from "@/components/ui/Title";
import { Card } from "@/components/ui/Card";
import { skillsData } from "./data";

export default function Skills() {
	return (
		<section className="max-w-3xl">
			<Title>{skillsData.title}</Title>

			{/* Skills Grid */}
			<div className="flex flex-wrap gap-4">
				{skillsData.skills.map((skill: string, index: number) => (
					<Card key={index} className="px-6 py-2 cursor-pointer">
						<span className="text-gray-700 text-base">{skill}</span>
					</Card>
				))}
			</div>
		</section>
	);
}
