import type { Metadata } from "next";
import { Instrument_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const instrument_sans = Instrument_Sans({
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
        className={`${instrument_sans.className} ${dm_mono.variable} antialiased`}
      >
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
