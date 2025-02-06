"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { contactData } from "./data";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log(formData);
	};

	return (
		<section className="max-w-3xl">
			<Title>{contactData.title}</Title>

			<Card className="!p-6">
				<CardContent className="!p-0">
					<form onSubmit={handleSubmit} className="space-y-6">
						{Object.entries(contactData.fields).map(
							([key, label]) => (
								<motion.div
									key={key}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									<label className="block text-gray-700 mb-2 text-lg">
										{label}
									</label>
									{key === "message" ? (
										<textarea
											className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
											rows={6}
											value={
												formData[
													key as keyof typeof formData
												]
											}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													[key]: e.target.value,
												}))
											}
											required
										/>
									) : (
										<input
											type={
												key === "email"
													? "email"
													: "text"
											}
											className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
											value={
												formData[
													key as keyof typeof formData
												]
											}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													[key]: e.target.value,
												}))
											}
											required
										/>
									)}
								</motion.div>
							)
						)}

						<motion.button
							type="submit"
							className="w-full py-4 bg-black hover:bg-gray-900 text-white rounded-2xl transition-colors"
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
						>
							{contactData.submitText}
						</motion.button>
					</form>
				</CardContent>
			</Card>
		</section>
	);
}
