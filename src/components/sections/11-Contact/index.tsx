"use client";
import { useState } from "react";
import { contactData } from "./data";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

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

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ name: "", email: "", message: "" });
        toast.success("Message sent successfully!");
      } else {
        toast.error(data.error?.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section>
      <Toaster position="top-center" />
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
              {isLoading ? "Sending..." : contactData.submitText}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
