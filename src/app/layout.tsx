import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dm_sans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
});

const dm_mono = DM_Mono({
	weight: "400",
	variable: "--font-dm-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "fariesky",
	description: "Portfolio of Muhammad Faried Risky",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${dm_sans.className} ${dm_mono.variable} antialiased bg-gray-50`}
			>
				{children}
			</body>
		</html>
	);
}
