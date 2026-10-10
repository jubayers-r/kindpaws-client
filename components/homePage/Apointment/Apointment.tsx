"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Bird,
  CalendarIcon,
  Cat,
  Clock,
  Dog,
  Mail,
  ArrowUpRight,
  PawPrint,
  Phone,
  User,
} from "lucide-react";
import { toast } from "sonner";

const petOptions = [
  { value: "Dog", icon: Dog },
  { value: "Cat", icon: Cat },
  { value: "Bird", icon: Bird },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export const Apointment = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [petType, setPetType] = useState("");
  const [time, setTime] = useState("08:00");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const validate = () => {
    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = "Please enter your full name.";
    if (!phone.trim()) nextErrors.phone = "Please enter your phone number.";
    else if (!phoneRegex.test(phone))
      nextErrors.phone = "Please enter a valid phone number.";
    if (!email.trim()) nextErrors.email = "Please enter your email address.";
    else if (!emailRegex.test(email))
      nextErrors.email = "Please enter a valid email address.";
    if (!petType) nextErrors.petType = "Please pick your pet type.";
    if (!date) nextErrors.date = "Please choose a visit date.";
    if (!time) nextErrors.time = "Please choose a visit time.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleReservation = () => {
    if (!validate()) {
      toast.error("⚠️ Please fill out all fields before reserving.");
      return;
    }

    toast.success(
      `🎉 Reservation confirmed for ${name} with a ${petType} on ${date?.toLocaleDateString()} at ${time}.`
    );

    setName("");
    setPhone("");
    setEmail("");
    setPetType("");
    setDate(undefined);
    setTime("08:00");
    setErrors({});
  };

  const fieldClass = (hasError: boolean | string | undefined) =>
    `bg-[#f9f5ef] rounded-full pl-11 pr-5 py-3 h-auto text-sm text-gray-700 placeholder:text-gray-400 border ${
      hasError ? "border-2 border-destructive" : "border-transparent"
    }`;

  const iconWrap =
    "absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none";

  const errorClass =
    "mt-1.5 text-xs font-semibold text-destructive bg-destructive/10 rounded-full px-3 py-1 w-fit";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="w-full mx-auto p-6 sm:p-10 bg-white text-secondary shadow-md rounded-[2.5rem] relative overflow-hidden"
    >
      <Image
        src="/assets/cta/paw-bg-pattern.png"
        alt=""
        width={224}
        height={224}
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 -right-4 w-40 sm:w-56 h-auto select-none"
      />
      <Image
        src="/assets/cta/paw-bg-pattern.png"
        alt=""
        width={176}
        height={176}
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -left-6 w-32 sm:w-44 h-auto rotate-180 select-none hidden sm:block"
      />

      <motion.div variants={item} className="mb-3 flex justify-center">
        <div className="bg-primary/10 rounded-full w-fit px-5 py-1 flex items-center gap-2">
          <PawPrint className="text-primary w-4 h-4" />
          <span className="uppercase text-sm font-semibold text-primary">
            Book a visit
          </span>
        </div>
      </motion.div>

      <motion.h2
        variants={item}
        className="text-center text-3xl/tight sm:text-4xl/tight font-bold mb-2"
      >
        Schedule A Visit Today!
      </motion.h2>

      <motion.p
        variants={item}
        className="text-center text-muted-foreground mb-8 max-w-lg mx-auto"
      >
        Reserve a spot for your furry friend and we will have everything ready
        before you arrive.
      </motion.p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <motion.div variants={item}>
          <label htmlFor="appt-name" className="block mb-2 text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <span className={iconWrap}>
              <User className="w-4 h-4" />
            </span>
            <Input
              id="appt-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              placeholder="Type Your Full Name"
              aria-invalid={!!errors.name}
              className={fieldClass(errors.name)}
            />
          </div>
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </motion.div>

        <motion.div variants={item}>
          <label htmlFor="appt-phone" className="block mb-2 text-sm font-medium">
            Phone
          </label>
          <div className="relative">
            <span className={iconWrap}>
              <Phone className="w-4 h-4" />
            </span>
            <Input
              id="appt-phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearError("phone");
              }}
              placeholder="+123 888 ..."
              aria-invalid={!!errors.phone}
              className={fieldClass(errors.phone)}
            />
          </div>
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </motion.div>

        <motion.div variants={item}>
          <label htmlFor="appt-email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <span className={iconWrap}>
              <Mail className="w-4 h-4" />
            </span>
            <Input
              id="appt-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              placeholder="you@hotmail.com"
              aria-invalid={!!errors.email}
              className={fieldClass(errors.email)}
            />
          </div>
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </motion.div>

        <motion.div variants={item}>
          <span className="block mb-2 text-sm font-medium">Pet Type</span>
          <div className="flex gap-3" role="radiogroup" aria-label="Pet type">
            {petOptions.map((pet) => {
              const active = petType === pet.value;
              const Icon = pet.icon;
              return (
                <button
                  key={pet.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setPetType(pet.value);
                    clearError("petType");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/10 text-primary ring-2 ring-primary"
                      : "bg-[#f9f5ef] text-gray-600 hover:bg-primary/10"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {pet.value}
                </button>
              );
            })}
          </div>
          {errors.petType && <p className={errorClass}>{errors.petType}</p>}
        </motion.div>

        <motion.div variants={item}>
          <label className="block mb-2 text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start items-center gap-3 rounded-full pl-4 pr-5 py-3 h-auto bg-[#f9f5ef] text-sm text-gray-700 hover:text-gray-700 hover:bg-[#f9f5ef] border ${
                  errors.date ? "border-2 border-destructive" : "border-transparent"
                }`}
              >
                <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
                <span className={date ? "text-gray-700" : "text-gray-400"}>
                  {date ? date.toLocaleDateString() : "mm/dd/yyyy"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-fit border-none" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  clearError("date");
                }}
                autoFocus
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className={errorClass}>{errors.date}</p>}
        </motion.div>

        <motion.div variants={item}>
          <label htmlFor="appt-time" className="block mb-2 text-sm font-medium">
            Time
          </label>
          <label
            htmlFor="appt-time"
            onClick={(e) => {
              const input = e.currentTarget.querySelector("input");
              if (input && "showPicker" in input) {
                e.preventDefault();
                try {
                  (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
                } catch {
                  input.focus();
                }
              }
            }}
            className={`flex items-center bg-[#f9f5ef] rounded-full pl-4 pr-5 py-3 border cursor-pointer ${
              errors.time ? "border-2 border-destructive" : "border-transparent"
            }`}
          >
            <Clock className="mr-3 h-4 w-4 text-primary shrink-0" />
            <input
              id="appt-time"
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                clearError("time");
              }}
              className="bg-transparent w-full outline-none text-sm text-gray-700 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </label>
          {errors.time && <p className={errorClass}>{errors.time}</p>}
        </motion.div>
      </div>

      <motion.div variants={item} className="text-center mt-10">
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="inline-block"
        >
          <Button
            onClick={handleReservation}
            className="group bg-primary text-white hover:bg-secondary rounded-full px-7 py-3 h-auto text-base font-semibold gap-2 transition-all duration-300 shadow-md shadow-primary/25"
          >
            <span>Start A Reservation</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Apointment;
