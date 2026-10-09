"use client";

import React, { useEffect, useState, Suspense } from "react";
import LoginOptions from "@/components/shared/LoginOptions/LoginOptions";
import PasswordInput from "@/components/shared/PasswordInput/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/firebase/firebase.init";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { Mail } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface LoginFormInputs {
  email: string;
  password: string;
}

function LoginForm() {
  const { logIn, logOut, stateData, setStateData, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = searchParams.get("from") || stateData || "/";

  useEffect(() => {
    if (!loading && user && !isSubmitting) {
      setStateData(null);
      router.replace(from);
    }
  }, [loading, user, from, router, setStateData, isSubmitting]);

  const updateLastLogin = async (userId: string) => {
    try {
      await axios.patch(
        `/api/users/last-login/${userId}`
      );
    } catch (err) {
      console.error("❌ Failed to update last login:", err);
    }
  };

  const onSubmit = async (data: LoginFormInputs) => {
    setIsSubmitting(true);
    try {
      await logIn(data.email, data.password);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateLastLogin(currentUser.uid);
      }

      if (currentUser) {
        const res = await axios.get("/api/users", {
          params: { uid: currentUser.uid },
        });

        if (res.data?.[0]?.banned) {
          await logOut();
          toast.error("Your account has been banned.");
          return;
        }
      }

      router.replace(from);
      setStateData(null);
    } catch (error: unknown) {
      const authError = error as { code?: string; message?: string };
      if (authError?.code === "auth/wrong-password") {
        setError("password", {
          type: "manual",
          message: "Incorrect password",
        });
      } else if (authError?.code === "auth/user-not-found") {
        setError("email", {
          type: "manual",
          message: "No user found with this email",
        });
      } else {
        setError("password", {
          type: "manual",
          message: authError?.message || "Authentication failed",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/20 p-4">
      <div className="max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl w-full">
            <h2 className="text-2xl font-bold text-center text-primary mb-6">
              Welcome Back
            </h2>

            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <PasswordInput register={register} errors={errors} />

                <Button type="submit" className="w-full mt-4">
                  Login
                </Button>
              </form>

              <p className="text-sm text-center mt-4 text-muted-foreground">
                New to KindPaws?{" "}
                <Link href="/register" className="text-primary underline">
                  Register here
                </Link>
              </p>
              <LoginOptions />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
