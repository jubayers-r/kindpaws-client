"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "motion/react";
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

interface CreateCampaignFormProps {
  initialData?: Campaign | null;
  onSubmit: (payload: Record<string, unknown>) => Promise<unknown> | void;
  isSubmitting?: boolean;
}

const CampaignSchema = Yup.object().shape({
  picture: Yup.mixed().nullable(),
  goalAmount: Yup.number()
    .typeError("Must be a number")
    .required("Goal amount is required")
    .positive("Must be greater than 0"),
  deadline: Yup.date().required("Deadline is required"),
  shortDescription: Yup.string().required("Short description is required"),
  longDescription: Yup.string().required("Long description is required"),
  title: Yup.string().required("Title is required"),
  location: Yup.string().required("Location is required"),
  tags: Yup.string(),
  isFeatured: Yup.boolean(),
});

export const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({
  initialData = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const uploadImageToImgbb = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "d3aac2d3f145f2ff181135ea8a0ba76b";
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
    mutationFn: async (values: Record<string, unknown>) => {
      let imageUrl = initialData?.image;
      if (values.picture instanceof File) {
        imageUrl = await uploadImageToImgbb(values.picture);
      }
      const payload: Record<string, unknown> = {
        ...values,
        image: imageUrl,
        tags: typeof values.tags === "string"
          ? values.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
          : [],
        ownerId: initialData?.ownerId || user?.uid,
        ownerName: initialData?.ownerName || user?.displayName,
        ownerEmail: initialData?.ownerEmail || user?.email,
        ownerPhoto: initialData?.ownerPhoto || user?.photoURL,
      };
      delete payload.picture;
      await onSubmit(payload);
    },
    onError: () => toast.error("Image upload failed. Please try again."),
    onSettled: () => setUploadProgress(0),
  });

  const uploading = uploadProgress > 0 && uploadProgress < 100;
  const busy = mutation.isPending || isSubmitting || uploading;

  return (
    <motion.div {...rise()}>
      <Card className={`${CARD} mx-auto max-w-3xl gap-0 px-0 py-0`}>
        <CardContent className="p-6 sm:p-8">
          <Formik
            initialValues={{
              picture: null,
              goalAmount: initialData?.goalAmount || "",
              deadline: initialData?.deadline
                ? new Date(initialData.deadline).toISOString().split("T")[0]
                : "",
              shortDescription: initialData?.shortDescription || "",
              longDescription: initialData?.longDescription || "",
              title: initialData?.title || "",
              location: initialData?.location || "",
              tags: initialData?.tags?.join(", ") || "",
              isFeatured: initialData?.isFeatured || false,
            }}
            enableReinitialize={true}
            validationSchema={CampaignSchema}
            onSubmit={(values) => mutation.mutate(values)}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">
                <FormField
                  label="Campaign image"
                  required={!initialData}
                  hint={
                    !imagePreview
                      ? "PNG or JPG, shown on the campaign card"
                      : undefined
                  }
                >
                  {imagePreview ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={imagePreview}
                        alt="Campaign preview"
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
                              setFieldValue("picture", file);
                              setImagePreview(URL.createObjectURL(file));
                              setUploadProgress(0);
                            }}
                          />
                          Replace image
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFieldValue("picture", null);
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
                          setFieldValue("picture", file);
                          setImagePreview(URL.createObjectURL(file));
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
                  <InputField
                    name="title"
                    label="Campaign title"
                    placeholder="Help Max walk again"
                  />
                  <InputField
                    name="location"
                    label="Location"
                    placeholder="City, Country"
                  />
                  <InputField
                    name="goalAmount"
                    label="Goal amount ($)"
                    type="number"
                    placeholder="500"
                  />
                  <InputField name="deadline" label="Deadline" type="date" />
                  <InputField
                    name="shortDescription"
                    label="Short description"
                    placeholder="One line shown on the card"
                    className="sm:col-span-2"
                  />
                  <InputField
                    name="tags"
                    label="Tags"
                    placeholder="comma, separated"
                    hint="Optional"
                    className="sm:col-span-2"
                  />
                </div>

                <FormField label="Full story" required>
                  <Field
                    as={Textarea}
                    name="longDescription"
                    rows={5}
                    placeholder="Why this campaign matters, where the money goes…"
                  />
                  <ErrorMessage
                    name="longDescription"
                    component="p"
                    className="w-fit rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive"
                  />
                </FormField>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border bg-background px-4 py-3 transition hover:bg-accent/50">
                  <Field
                    type="checkbox"
                    name="isFeatured"
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
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const InputField = ({
  name,
  label,
  type = "text",
  placeholder,
  hint,
  className,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  className?: string;
}) => (
  <FormField label={label} hint={hint} className={className}>
    <Field name={name} type={type} placeholder={placeholder} as={Input} />
    <ErrorMessage
      name={name}
      component="p"
      className="w-fit rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive"
    />
  </FormField>
);

export default CreateCampaignForm;
