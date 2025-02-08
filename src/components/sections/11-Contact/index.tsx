"use client";
import { useState } from "react";
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

      if (!response.ok) throw new Error(data.error || "Failed to send");

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
      <Title>Contact Me</Title>
      <Card className="!p-6">
        <CardContent className="!p-0">
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
            <Input
              name="name"
              type="text"
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={isLoading}
            />

            <Input
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={isLoading}
            />

            <Textarea
              name="message"
              label="Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gray-900 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  Sending
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
