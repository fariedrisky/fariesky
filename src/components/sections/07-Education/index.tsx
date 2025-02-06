"use client";
import Image from "next/image";
import { education } from "./data";
import { Education as EducationType } from "./types";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";

export default function Education() {
	return (
		<section className="max-w-3xl">
			<Title>{education.title}</Title>

			<div className="space-y-4">
				{education.educations.map(
					(education: EducationType, index: number) => (
						<Card
							key={index}
							className="!bg-white !rounded-2xl !overflow-hidden !p-0"
						>
							<CardContent className="!p-4 flex items-start justify-between">
								<div className="flex gap-4">
									<div className="w-12 h-12 rounded-2xl flex items-center justify-center relative">
										<Image
											src={education.logo}
											alt={`${education.school} logo`}
											width={40}
											height={50}
											className="object-contain"
										/>
									</div>
									<div>
										<h3 className="font-semibold text-lg">
											{education.school}
										</h3>
										<div className="text-gray-600 space-y-1">
											<p>{education.degree}</p>
											{education.score && (
												<p className="text-sm text-gray-500">
													{education.score}
												</p>
											)}
										</div>
									</div>
								</div>
								<div className="flex flex-col items-end gap-2">
									<div className="flex flex-col items-end">
										<span className="text-gray-500 text-sm text-right">
											{education.period}
										</span>
										<div className="flex items-center gap-1 text-gray-500 text-sm">
											<span>{education.location}</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)
				)}
			</div>
		</section>
	);
}
