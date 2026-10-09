"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "motion/react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import FormField from "@/components/dashboard/shared/FormField";
import { CARD, rise } from "@/components/dashboard/shared/styles";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Campaign } from "@/types";

const campaignSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  goalAmount: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .positive("Must be greater than 0"),
  deadline: z.string().min(1, "Deadline is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  tags: z.string().optional(),
  isFeatured: z.boolean(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

interface CreateCampaignFormProps {
  initialData?: Campaign | null;
  onSubmit: (payload: Record<string, unknown>) => Promise<unknown> | void;
  isSubmitting?: boolean;
}

export const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({
  initialData = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: initialData?.title || "",
      location: initialData?.location || "",
      goalAmount: initialData?.goalAmount || ("" as unknown as number),
      deadline: initialData?.deadline
        ? new Date(initialData.deadline).toISOString().split("T")[0]
        : "",
      shortDescription: initialData?.shortDescription || "",
      longDescription: initialData?.longDescription || "",
      tags: initialData?.tags?.join(", ") || "",
      isFeatured: initialData?.isFeatured || false,
    },
  });

  const uploadImageToImgbb = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const key =
      process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
      "d3aac2d3f145f2ff181135ea8a0ba76b";
    const url = `https://api.imgbb.com/1/upload?key=${key}`;
    const res = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (e.total) {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        }
      },
    });
    return res.data.data.url;
  };

  const mutation = useMutation({
    mutationFn: async (values: CampaignFormValues) => {
      let imageUrl = initialData?.image;
      if (selectedFile) {
        imageUrl = await uploadImageToImgbb(selectedFile);
      }
      const payload: Record<string, unknown> = {
        ...values,
        image: imageUrl,
        tags: values.tags
          ? values.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter(Boolean)
          : [],
        ownerId: initialData?.ownerId || user?.uid,
        ownerName: initialData?.ownerName || user?.displayName,
        ownerEmail: initialData?.ownerEmail || user?.email,
        ownerPhoto: initialData?.ownerPhoto || user?.photoURL,
      };
      await onSubmit(payload);
    },
    onError: () => toast.error("Image upload failed. Please try again."),
    onSettled: () => setUploadProgress(0),
  });

  const onFormSubmit = async (values: CampaignFormValues) => {
    if (!initialData && !selectedFile && !imagePreview) {
      setImageError("A campaign image is required");
      return;
    }
    setImageError("");
    mutation.mutate(values);
  };

  const uploading = uploadProgress > 0 && uploadProgress < 100;
  const busy = mutation.isPending || isSubmitting || uploading;

  return (
    <motion.div {...rise()}>
      <Card className={`${CARD} mx-auto max-w-3xl gap-0 px-0 py-0`}>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <FormField
              label="Campaign image"
              required={!initialData}
              error={imageError}
              hint={
                !imagePreview
                  ? "PNG or JPG, shown on the campaign card"
                  : undefined
              }
            >
              {imagePreview ? (
                <div className="flex items-center gap-4">
                  <Image
                    src={imagePreview}
                    alt="Campaign preview"
                    width={96}
                    height={96}
                    unoptimized
                    className="h-24 w-24 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-1 object-cover"
                  />
                  <div className="flex flex-col items-start gap-2">
                    <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border bg-background px-4 text-sm font-medium shadow-xs transition hover:bg-accent">
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          if (!file) return;
                          setSelectedFile(file);
                          setImagePreview(URL.createObjectURL(file));
                          setImageError("");
                          setUploadProgress(0);
                        }}
                      />
                      Replace image
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setSelectedFile(null);
                      }}
                      className="inline-flex items-center gap-1 text-sm font-medium text-destructive hover:underline"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-[#f9f5ef] px-6 py-8 text-center transition hover:border-primary">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (!file) return;
                      setSelectedFile(file);
                      setImagePreview(URL.createObjectURL(file));
                      setImageError("");
                      setUploadProgress(0);
                    }}
                  />
                  <UploadCloud className="h-8 w-8 text-primary" />
                  <span className="text-sm font-semibold text-secondary">
                    Click to upload a cover photo
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Warm, bright photos raise more
                  </span>
                </label>
              )}
              {uploading && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs font-medium text-primary">
                    Uploading {uploadProgress}%
                  </p>
                </div>
              )}
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Campaign title"
                required
                error={errors.title?.message}
              >
                <Input
                  id="title"
                  placeholder="Help Max walk again"
                  {...register("title")}
                  aria-invalid={Boolean(errors.title)}
                />
              </FormField>

              <FormField
                label="Location"
                required
                error={errors.location?.message}
              >
                <Input
                  id="location"
                  placeholder="City, Country"
                  {...register("location")}
                  aria-invalid={Boolean(errors.location)}
                />
              </FormField>

              <FormField
                label="Goal amount ($)"
                required
                error={errors.goalAmount?.message}
              >
                <Input
                  id="goalAmount"
                  type="number"
                  placeholder="500"
                  {...register("goalAmount")}
                  aria-invalid={Boolean(errors.goalAmount)}
                />
              </FormField>

              <FormField
                label="Deadline"
                required
                error={errors.deadline?.message}
              >
                <Input
                  id="deadline"
                  type="date"
                  {...register("deadline")}
                  aria-invalid={Boolean(errors.deadline)}
                />
              </FormField>

              <FormField
                label="Short description"
                required
                error={errors.shortDescription?.message}
                className="sm:col-span-2"
              >
                <Input
                  id="shortDescription"
                  placeholder="One line shown on the card"
                  {...register("shortDescription")}
                  aria-invalid={Boolean(errors.shortDescription)}
                />
              </FormField>

              <FormField
                label="Tags"
                hint="Optional"
                error={errors.tags?.message}
                className="sm:col-span-2"
              >
                <Input
                  id="tags"
                  placeholder="comma, separated"
                  {...register("tags")}
                  aria-invalid={Boolean(errors.tags)}
                />
              </FormField>
            </div>

            <FormField
              label="Full story"
              required
              error={errors.longDescription?.message}
            >
              <Textarea
                id="longDescription"
                rows={5}
                placeholder="Why this campaign matters, where the money goes…"
                {...register("longDescription")}
                aria-invalid={Boolean(errors.longDescription)}
              />
            </FormField>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border bg-background px-4 py-3 transition hover:bg-accent/50">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="size-4 cursor-pointer rounded accent-primary"
              />
              <span className="text-sm font-medium">
                Feature this campaign on the home page
              </span>
            </label>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
              <Button
                type="submit"
                className="rounded-full px-8"
                disabled={busy}
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {busy
                  ? initialData
                    ? "Updating…"
                    : "Creating…"
                  : initialData
                  ? "Save changes"
                  : "Create campaign"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateCampaignForm;
