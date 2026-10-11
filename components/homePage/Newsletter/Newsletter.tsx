"use client";

import { useState } from "react";
import { MailPlus, Send, CircleCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section
      className="w-full rounded-3xl sm:rounded-4xl overflow-hidden p-6 sm:p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/newsletter-bg.jpg')` }}
    >
      <div className="flex items-center gap-4 text-white w-full lg:w-auto">
        <div className="bg-white rounded-full p-4 sm:p-7 lg:p-8 shadow-md shrink-0">
          <MailPlus className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="text-left">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-white max-w-md">
            Subscribe To Our Newsletter
          </h2>
        </div>
      </div>

      {subscribed ? (
        <div className="w-full max-w-xl flex items-center gap-3 bg-white rounded-2xl sm:rounded-full px-6 py-4 sm:px-8 sm:py-5 shadow-md text-gray-800">
          <CircleCheck className="text-primary w-6 h-6 shrink-0" />
          <p className="font-semibold text-sm sm:text-base">
            Success! You&apos;re subscribed to our newsletter.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full overflow-hidden shadow-md p-1.5 sm:p-0"
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="rounded-xl sm:rounded-none sm:rounded-l-full border-0 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none px-4 sm:px-8 py-4 sm:py-6 flex-grow text-gray-700 bg-transparent text-sm sm:text-base"
          />
          <Button
            type="submit"
            className="rounded-xl sm:rounded-none sm:rounded-r-full bg-primary hover:bg-secondary text-white px-6 py-4 sm:py-6 text-xs sm:text-sm font-semibold tracking-wide border-0 shadow-none outline-none focus-visible:ring-0 shrink-0 mt-2 sm:mt-0"
          >
            DISCOVER NOW <Send className="w-4 h-4 ml-2" />
          </Button>
        </form>
      )}
    </section>
  );
};

export default Newsletter;
