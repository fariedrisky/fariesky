"use client";
import { Experience as ExperienceType } from "./types";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { experience } from "./data";
import Title from "@/components/ui/Title";
import { X, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const bgColors = [
	"bg-blue-500",
	"bg-green-500",
	"bg-purple-500",
	"bg-red-500",
	"bg-yellow-500",
	"bg-indigo-500",
	"bg-pink-500",
	"bg-teal-500",
];

export default function Experience() {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

	const getRandomColor = (index: number) => {
		return bgColors[index % bgColors.length];
	};

	const LogoComponent = ({
		experience,
		index,
	}: {
		experience: ExperienceType;
		index: number;
	}) => {
		if (experience.logo) {
			return (
				<Image
					src={experience.logo}
					alt={`${experience.company} logo`}
					width={40}
					height={50}
					className="object-contain"
				/>
			);
		}

		const firstLetter = experience.company.charAt(0);
		const bgColor = getRandomColor(index);

		return (
			<div
				className={`w-full h-full ${bgColor} rounded-2xl flex items-center justify-center`}
			>
				<span className="text-white text-xl font-semibold">
					{firstLetter}
				</span>
			</div>
		);
	};

	return (
		<section className="max-w-3xl">
			<Title>{experience.title}</Title>

			<div className="space-y-4">
				{experience.experiences.map(
					(experience: ExperienceType, index: number) => (
						<Card
							key={index}
							className="!bg-white !rounded-3xl !overflow-hidden !p-0"
						>
							<motion.div
								initial={false}
								className="cursor-pointer"
								onClick={() =>
									setExpandedIndex(
										expandedIndex === index ? null : index
									)
								}
							>
								<CardContent className="!p-4 flex items-start justify-between">
									<div className="flex gap-4">
										<div className="w-12 h-12 rounded-2xl flex items-center justify-center relative">
											<LogoComponent
												experience={experience}
												index={index}
											/>
										</div>
										<div>
											<h3 className="font-semibold text-lg">
												{experience.company}
											</h3>
											<p className="text-gray-600">
												{experience.role}
											</p>
										</div>
									</div>
									<div className="flex flex-col items-end gap-2">
										<div className="flex flex-col items-end">
											<div className="flex items-center gap-4 text-gray-500">
												<span className="text-sm text-right">
													{experience.period}
												</span>
												<div className="w-6 h-6 flex items-center justify-center">
													{expandedIndex === index ? (
														<X size={20} />
													) : (
														<ChevronDown
															size={20}
														/>
													)}
												</div>
											</div>
											<div className="flex items-center gap-1 text-gray-500 text-sm mr-10">
												<span>
													{experience.location}
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</motion.div>

							<AnimatePresence initial={false}>
								{expandedIndex === index && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{
											duration: 0.3,
											ease: "easeInOut",
										}}
									>
										<CardContent className="!px-4 !pb-4 !pt-2 !pl-20">
											<ul className="list-disc space-y-2">
												{experience.description.map(
													(
														item: string,
														idx: number
													) => (
														<li
															key={idx}
															className="text-gray-600"
														>
															{item}
														</li>
													)
												)}
											</ul>
										</CardContent>
									</motion.div>
								)}
							</AnimatePresence>
						</Card>
					)
				)}
			</div>
		</section>
	);
}
