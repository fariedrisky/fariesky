"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

const PDFDownloadButton = dynamic(
  () =>
    import("@/components/cv/03-DownloadCV/PDFDownloadButton").then((mod) => ({
      default: mod.PDFDownloadButton,
    })),
  {
    ssr: false,
    loading: () => (
      <Button variant="outline" className="w-full rounded-xl" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    ),
  },
);

export default function DownloadCV() {
  return <PDFDownloadButton />;
}
