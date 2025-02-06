"use client";
import Link from "next/link";
import { links } from "./data";
import Title from "@/components/ui/Title";
import { Instagram, Linkedin, Github, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

const iconComponents = {
	Instagram,
	Linkedin,
	Github,
};

export default function Links() {
	return (
		<section className="max-w-3xl">
			<Title>{links.title}</Title>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{links.links.map((link, index) => {
					const IconComponent =
						iconComponents[
							link.icon as keyof typeof iconComponents
						];

					return (
						<Link
							key={index}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="block no-underline"
						>
							<Card className="flex items-center justify-between hover:scale-105 active:scale-95 transition-all duration-300">
								<div className="flex items-center gap-3">
									<IconComponent className="w-5 h-5 text-gray-600" />
									<span className="text-lg text-gray-700">
										{link.title}
									</span>
								</div>
								<ArrowRight className="w-5 h-5 text-gray-400" />
							</Card>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
