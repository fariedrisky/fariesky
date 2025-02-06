"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData } from "./data";
import Title from "@/components/ui/Title";

export default function Projects() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState(0);

	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? 1000 : -1000,
			opacity: 0,
		}),
	};

	const swipeConfidenceThreshold = 10000;
	const swipePower = (offset: number, velocity: number) => {
		return Math.abs(offset) * velocity;
	};

	const paginate = (newDirection: number) => {
		setDirection(newDirection);
		setCurrentIndex((prevIndex) => {
			const nextIndex = prevIndex + newDirection;
			if (nextIndex < 0) return projectsData.projects.length - 1;
			if (nextIndex >= projectsData.projects.length) return 0;
			return nextIndex;
		});
	};

	return (
		<section className="max-w-3xl">
			<Title>{projectsData.title}</Title>

			{/* Carousel */}
			<div className="relative h-[500px] bg-gray-100 rounded-2xl overflow-hidden">
				<AnimatePresence initial={false} custom={direction}>
					<motion.div
						key={currentIndex}
						custom={direction}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 },
						}}
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={1}
						onDragEnd={(_, { offset, velocity }) => {
							const swipe = swipePower(offset.x, velocity.x);

							if (swipe < -swipeConfidenceThreshold) {
								paginate(1);
							} else if (swipe > swipeConfidenceThreshold) {
								paginate(-1);
							}
						}}
						className="absolute w-full h-full"
					>
						<div className="relative w-full h-full p-6 bg-white rounded-2xl">
							{/* Project Image */}
							<div className="relative w-full h-60 mb-6 overflow-hidden rounded-xl">
								<Image
									src={
										projectsData.projects[currentIndex]
											.image
									}
									alt={
										projectsData.projects[currentIndex]
											.title
									}
									fill
									className="object-cover"
								/>
							</div>

							{/* Project Info */}
							<div className="space-y-4">
								<h3 className="text-2xl font-semibold">
									{projectsData.projects[currentIndex].title}
								</h3>
								<p className="text-gray-600">
									{
										projectsData.projects[currentIndex]
											.description
									}
								</p>
								<button className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900">
									<span>Click to view</span>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M14 5l7 7m0 0l-7 7m7-7H3"
										/>
									</svg>
								</button>
							</div>
						</div>
					</motion.div>
				</AnimatePresence>

				{/* Navigation Buttons */}
				<button
					className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10"
					onClick={() => paginate(-1)}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<button
					className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10"
					onClick={() => paginate(1)}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>

				{/* Dots Navigation */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
					{projectsData.projects.map((_, index) => (
						<button
							key={index}
							className={`w-2 h-2 rounded-full transition-colors ${
								index === currentIndex
									? "bg-gray-800"
									: "bg-gray-300"
							}`}
							onClick={() => {
								setDirection(index > currentIndex ? 1 : -1);
								setCurrentIndex(index);
							}}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
