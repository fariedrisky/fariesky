"use client";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/Button";
import CVDocument from "../01-CVDocument";
import { profile } from "@/components/sections/01-Profile/data";
import { useState, useEffect } from "react";

export const OpenPDFButton = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsMobile(
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent,
        ),
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const openPDF = async () => {
    try {
      const blob = await pdf(<CVDocument profile={profile} />).toBlob();
      const file = new File([blob], `CV - ${profile.name}.pdf`, {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(file);

      if (isMobile) {
        // For mobile: Create download link
        const link = document.createElement("a");
        link.href = url;
        link.download = `CV - ${profile.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For desktop: Open in new tab
        window.open(url, "_blank");
      }

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
      {isMobile ? "Download CV/Resume" : "View CV/Resume"}
    </Button>
  );
};
