"use client";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/Button";
import CVDocument from "../01-CVDocument";
import { profile } from "@/components/sections/01-Profile/data";

export const OpenPDFButton = () => {
  const openPDF = async () => {
    try {
      // Generate PDF blob
      const blob = await pdf(<CVDocument profile={profile} />).toBlob();

      // Create blob URL with filename
      const file = new File([blob], `CV - ${profile.name}.pdf`, {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(file);

      // Open in new tab
      window.open(url, "_blank");

      // Clean up blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Button variant="outline" className="w-full rounded-xl" onClick={openPDF}>
      View CV/Resume
    </Button>
  );
};
