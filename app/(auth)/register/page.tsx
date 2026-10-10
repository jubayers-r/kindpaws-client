"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { User as UserIcon, Mail, Loader2 } from "lucide-react";
import PasswordInput from "@/components/shared/PasswordInput/PasswordInput";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateProfile } from "firebase/auth";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import LoginOptions from "@/components/shared/LoginOptions/LoginOptions";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  photo?: FileList;
}

function RegisterForm() {
  const {
    createUser,
    stateData,
    setStateData,
    setUser,
    user,
    loading,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = searchParams.get("from") || stateData || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!loading && user && !isSubmitting) {
      setStateData(null);
      router.replace(from);
    }
  }, [loading, user, from, router, setStateData, isSubmitting]);

  const uploadToImgBB = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";
    const imgUpload = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    const res = await axios.post(imgUpload, formData);
    const data = res.data;

    if (data.success) {
      return data.data.url as string;
    } else {
      throw new Error("Image upload failed");
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsSubmitting(true);
    try {
      const imageFile = data.photo?.[0];
      const imageUrl = imageFile ? await uploadToImgBB(imageFile) : undefined;

      const userCredential = await createUser(data.email, data.password);
      const createdUser = userCredential.user;
      setUser(createdUser);
      router.replace(from);
      setStateData(null);

      await updateProfile(createdUser, {
        displayName: data.name,
        ...(imageUrl ? { photoURL: imageUrl } : {}),
      });

      const userDB = {
        uid: createdUser.uid,
        name: data.name,
        email: createdUser.email,
        image: imageUrl || "",
        role: "user",
        lastLoginAt: new Date(),
      };

      await axios.post(
        "/api/users/register",
        userDB
      );
    } catch (err: unknown) {
      console.error(err);
      const authError = err as { code?: string };
      if (authError?.code === "auth/email-already-in-use") {
        setSubmitError("This email is already registered. Please use another.");
      } else {
        setSubmitError("Something went wrong. Please try again.");
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
              Create an Account
            </h2>
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Your full name"
                      className="pl-10"
                      autoComplete="name"
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Profile Picture</label>
                  <Input
                    type="file"
                    accept="image/*"
                    {...register("photo", {
                      validate: {
                        fileType: (fileList) => {
                          if (!fileList || fileList.length === 0) return true;
                          return (
                            fileList[0].type.startsWith("image/") ||
                            "Only image files are allowed"
                          );
                        },
                      },
                    })}
                  />
                  {errors.photo && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.photo.message}
                    </p>
                  )}
                </div>

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

                {submitError && (
                  <p className="text-sm text-red-500 mt-1">{submitError}</p>
                )}

                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </form>

              <p className="text-sm text-center mt-4 text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary underline">
                  Login here
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
