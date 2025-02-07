// components/cv/DownloadCV.tsx
"use client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/Button";
import CVDocument from "../01-CVDocument";
import { profile } from "@/components/sections/01-Profile/data";

export const DownloadCV = () => (
  <PDFDownloadLink
    document={<CVDocument profile={profile} />}
    fileName={`CV - ${profile.name}.pdf`}
  >
    {({ loading }) => (
      <Button
        variant="outline"
        className="w-full rounded-xl"
        disabled={loading}
      >
        {loading ? "Generating CV..." : "Download CV"}
      </Button>
    )}
  </PDFDownloadLink>
);
