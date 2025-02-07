"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";

const PDFDownloadButton = dynamic(
  () =>
    import("@/components/cv/03-DownloadCV/PDFDownloadButton").then((mod) => ({
      default: mod.PDFDownloadButton,
    })),
  {
    ssr: false,
    loading: () => (
      <Button variant="outline" className="w-full rounded-xl" disabled>
        Loading...
      </Button>
    ),
  },
);

export default function DownloadCV() {
  return <PDFDownloadButton />;
}
