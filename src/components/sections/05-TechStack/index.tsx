"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { techStackData } from "./data";
import Title from "@/components/ui/Title";

export default function TechStack() {
	return (
		<section className="max-w-3xl">
			<Title>{techStackData.title} </Title>

			{/* Ticker Container */}
			<div className="relative overflow-hidden py-6">
				{/* Double the items for seamless loop */}
				<motion.div
					animate={{
						x: [0, -50 * techStackData.tech.length],
					}}
					transition={{
						x: {
							repeat: Infinity,
							repeatType: "loop",
							duration: 20,
							ease: "linear",
						},
					}}
					className="flex gap-12 whitespace-nowrap"
				>
					{/* First set of items */}
					{techStackData.tech.map((item, index) => (
						<div
							key={`tech-${index}`}
							className="flex-shrink-0 w-20 h-20 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center p-4"
						>
							<div className="relative w-full h-full">
								<Image
									src={item.image}
									alt={item.name}
									fill
									className="object-contain"
								/>
							</div>
						</div>
					))}

					{/* Duplicate set for seamless loop */}
					{techStackData.tech.map((item, index) => (
						<div
							key={`tech-dup-${index}`}
							className="flex-shrink-0 w-20 h-20 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center p-4"
						>
							<div className="relative w-full h-full">
								<Image
									src={item.image}
									alt={item.name}
									fill
									className="object-contain"
								/>
							</div>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
