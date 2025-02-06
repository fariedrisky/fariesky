"use client";
import { useState } from "react";
import Image from "next/image";
import { profile } from "./data";
import { MapPin, Phone, Mail, Menu, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface ProfileProps {
	variant: "desktop" | "tablet" | "mobile";
}

const Profile = ({ variant }: ProfileProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen(!isOpen);

	const ProfileContent = () => (
		<>
			{/* Profile Image */}
			<div className="relative">
				<Image
					src="/assets/images/avatar.jpg"
					alt="Profile"
					className={`object-cover rounded-3xl ${
						variant === "mobile" ? "w-24 h-24" : "w-full h-64"
					}`}
					width={variant === "mobile" ? 96 : 200}
					height={variant === "mobile" ? 96 : 500}
				/>
			</div>

			{/* Profile Info */}
			<div className="space-y-4">
				<div>
					<h2 className="text-2xl font-bold">{profile.name}</h2>
					<p className="text-gray-600 mt-1">{profile.role}</p>
				</div>

				{/* Contact Info */}
				<div className="space-y-3">
					<div className="flex items-center space-x-3">
						<MapPin className="h-5 w-5 text-gray-500" />
						<span className="text-gray-600">
							{profile.location}
						</span>
					</div>

					{variant !== "mobile" && (
						<>
							<div className="flex items-center space-x-3">
								<Phone className="h-5 w-5 text-gray-500" />
								<span className="text-gray-600">
									{profile.phone}
								</span>
							</div>

							<div className="flex items-center space-x-3">
								<Mail className="h-5 w-5 text-gray-500" />
								<span className="text-gray-600">
									{profile.email}
								</span>
							</div>
						</>
					)}
				</div>

				{/* Buttons */}
				{variant !== "mobile" && (
					<div className="space-y-3">
						<button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl transition duration-200">
							Download CV
						</button>
						<button className="w-full py-2 px-4 bg-black hover:bg-gray-900 text-white rounded-2xl transition duration-200">
							Contact Me
						</button>
					</div>
				)}
			</div>
		</>
	);

	if (variant === "mobile") {
		return (
			<Card className="relative p-4">
				<CardContent className="p-0">
					<div className="flex justify-between items-start">
						<div className="flex gap-4">
							<ProfileContent />
						</div>
						<button
							onClick={toggleMenu}
							className="p-2 hover:bg-gray-100 rounded-full"
						>
							{isOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>

					{/* Mobile Menu */}
					{isOpen && (
						<Card className="absolute top-full left-0 right-0 mt-2 shadow-lg z-50">
							<CardContent className="space-y-3">
								<div className="flex items-center space-x-3">
									<Phone className="h-5 w-5 text-gray-500" />
									<span className="text-gray-600">
										{profile.phone}
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<Mail className="h-5 w-5 text-gray-500" />
									<span className="text-gray-600">
										{profile.email}
									</span>
								</div>
								<button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl transition duration-200">
									Download CV
								</button>
								<button className="w-full py-2 px-4 bg-black hover:bg-gray-900 text-white rounded-2xl transition duration-200">
									Contact Me
								</button>
							</CardContent>
						</Card>
					)}
				</CardContent>
			</Card>
		);
	}

	return (
		<Card
			className={`space-y-6 ${
				variant === "tablet" ? "max-w-4xl mx-auto" : ""
			}`}
		>
			<CardContent>
				<ProfileContent />
			</CardContent>
		</Card>
	);
};

export default Profile;
