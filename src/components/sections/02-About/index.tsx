import React from "react";
import { aboutData } from "./data";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";

export default function About() {
	return (
		<section className="max-w-3xl">
			<Title>{aboutData.title}</Title>

			<Card>
				<CardContent>
					{aboutData.description.map((paragraph, index) => (
						<p
							key={index}
							className="text-gray-600 text-md leading-relaxed"
						>
							{paragraph}
						</p>
					))}
				</CardContent>
			</Card>
		</section>
	);
}
