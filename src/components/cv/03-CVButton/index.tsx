"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

const OpenPDFButton = dynamic(
  () =>
    import("@/components/cv/03-CVButton/OpenPDFButton").then((mod) => ({
      default: mod.OpenPDFButton,
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

export default function ViewCV() {
  return <OpenPDFButton />;
}
