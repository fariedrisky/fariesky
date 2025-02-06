"use client";
import { useState } from "react";
import { contactData } from "./data";
import Title from "@/components/ui/Title";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
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
                  />
                )}
              </div>
            ))}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-black text-white"
            >
              {contactData.submitText}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
