"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Share2, Loader2 } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const contactItems = [
  {
    icon: <Phone className="w-5 h-5" />,
    label: "+880 18669-65359",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: "Mohakhali DOHS, Dhaka",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    label: "juabyer.shikder.007@gmail.com",
  },
];

const socialLinks = [
  {
    href: "https://linkedin.com/in/jubayer-shikder",
    icon: <FaLinkedinIn className="w-4 h-4" />,
  },
  {
    href: "https://x.com/jubayers_r",
    icon: <FaXTwitter className="w-4 h-4" />,
  },
  {
    href: "https://facebook.com/jubayers.r",
    icon: <FaFacebookF className="w-4 h-4" />,
  },
  {
    href: "https://instagram.com",
    icon: <FaInstagram className="w-4 h-4" />,
  },
];

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
    const nextErrors: Record<string, string> = {};

    if (!form.email.trim())
      nextErrors.email = "Please enter your email address.";
    else if (!emailRegex.test(form.email))
      nextErrors.email = "Please enter a valid email address.";
    if (form.phone.trim() && !phoneRegex.test(form.phone))
      nextErrors.phone = "Please enter a valid phone number.";
    if (!form.message.trim())
      nextErrors.message = "Please enter your message.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    clearError(e.target.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!validate()) {
      toast.error("⚠️ Please fill in the required fields before sending.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", phone: "", message: "" });
      setErrors({});
      toast.success("Message sent! We'll get back to you soon.");
    }, 1200);
  };

  const fieldClass = (hasError: boolean) =>
    hasError ? "border-2 border-destructive" : "";

  const errorClass =
    "mt-1.5 text-xs font-semibold text-destructive bg-destructive/10 rounded-full px-3 py-1 w-fit";

  return (
    <section className="w-full py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left Side */}
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            We’re Here for You and Your Future Pet
          </h2>
          <p className="text-muted-foreground max-w-md dark:text-primary-foreground">
            Have questions about adoption, campaigns, or caring for your new
            companion? Reach out — our team is ready to help you every paw-step
            of the way.
          </p>
          <div className="mt-6 space-y-5">
            {contactItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="p-3 rounded-full bg-primary/10 text-primary">
                  {item.icon}
                </span>
                <p className="text-base text-muted-foreground dark:text-white">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <span className="p-3 rounded-full bg-primary/10 text-primary">
              <Share2 className="w-4 h-4" />
            </span>
            <div className="flex gap-4">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 text-black flex items-center justify-center hover:text-primary dark:bg-white rounded-full transition-colors"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-white/90 border-none shadow-sm">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-primary">
                Your queries are important to us
              </h3>
              <p className="text-sm text-muted-foreground">
                Your email address will not be published. Required fields are
                marked *
              </p>
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <div>
                    <Input
                      name="email"
                      placeholder="E-mail*"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      aria-invalid={!!errors.email}
                      className={fieldClass(!!errors.email)}
                    />
                    {errors.email && (
                      <p className={errorClass}>{errors.email}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Input
                    name="phone"
                    placeholder="Phone number"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    aria-invalid={!!errors.phone}
                    className={fieldClass(!!errors.phone)}
                  />
                  {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Message*"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    aria-invalid={!!errors.message}
                    className={fieldClass(!!errors.message)}
                  />
                  {errors.message && (
                    <p className={errorClass}>{errors.message}</p>
                  )}
                </div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      "Send Us Message →"
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
