"use client";
import { languages } from "./data";
import { Language as LanguageType } from "./types";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";

export default function Languages() {
	return (
		<section className="max-w-3xl">
			<Title>{languages.title}</Title>

			<div className="space-y-4">
				{languages.languages.map(
					(language: LanguageType, index: number) => (
						<Card
							key={index}
							className="!bg-white !rounded-2xl !overflow-hidden"
						>
							<CardContent className="!p-0 flex items-center justify-between !ml-5">
								<div className="flex items-center gap-4">
									<div>
										<h3 className="font-semibold text-lg">
											{language.name}
										</h3>
										<p className="text-gray-600">
											{language.level}
										</p>
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
