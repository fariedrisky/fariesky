"use client";
import { useState } from "react";
import { contactData } from "./data";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send");
      }

      if (data.success) {
        toast.success(data.message);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send message",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Title>{contactData.title}</Title>

      <Card className="!p-6">
        <CardContent className="!p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(contactData.fields).map(([key, label]) => (
              <div key={key}>
                {key === "message" ? (
                  <Textarea
                    label={label}
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    required
                    disabled={isLoading}
                  />
                ) : (
                  <Input
                    type={key === "email" ? "email" : "text"}
                    label={label}
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    required
                    disabled={isLoading}
                  />
                )}
              </div>
            ))}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-black text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  Sending
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                contactData.submitText
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
