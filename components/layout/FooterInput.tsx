"use client";

import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Input } from "@/components/ui/input";
import { CircleCheck, Send } from "lucide-react";

export const FooterInput = () => {
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSent(true);
    setQuestion("");
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-center md:justify-start">
        <Logo />
      </div>
      <p className="text-center md:text-left">
        We&apos;re here to help you give pets a better life — whether you&apos;re a
        first-time adopter or ready to welcome another friend into your home.
        Have questions? We&apos;re just a paw away.
      </p>

      {sent ? (
        <div className="w-full mx-auto mb-5 flex items-center gap-3 rounded-full bg-white px-5 py-4 shadow-md">
          <CircleCheck className="w-5 h-5 shrink-0 text-primary" />
          <p className="text-sm font-semibold text-gray-800">
            Success! Your question has been sent.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative w-full mx-auto mb-5">
          <Input
            type="text"
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your Question"
            className="px-5 py-6 rounded-full bg-transparent text-white !placeholder-gray-400"
          />
          <button
            type="submit"
            aria-label="Send question"
            className="absolute inset-y-0 right-1 top-1 flex items-center justify-center text-white hover:text-secondary hover:bg-white cursor-pointer rounded-full bg-primary w-10.5 h-10.5"
          >
            <Send className="w-4 h-4 pointer-events-none" />
          </button>
        </form>
      )}
    </div>
  );
};

export default FooterInput;
