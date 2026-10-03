"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "motion/react";
import { toast } from "sonner";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormField from "@/components/dashboard/shared/FormField";
import { CARD, rise } from "@/components/dashboard/shared/styles";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Pet } from "@/types";

const categoryOptions = ["Dog", "Cat", "Bird", "Rabbit"];
const genderOptions = ["Male", "Female", "Other"];

interface PetFormProps {
  initialData?: Pet | null;
  onSubmit: (payload: Record<string, unknown>) => Promise<unknown> | void;
  isSubmitting?: boolean;
}

export const PetForm: React.FC<PetFormProps> = ({
  initialData = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id;

  const [imageURL, setImageURL] = useState(initialData?.image || "");
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  const isEditPage = pathname === `/dashboard/update-pet/${id}`;

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.longDescription || "",
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      formik.setFieldValue("longDescription", ed.getHTML());
    },
  });

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      age: initialData?.age || "",
      gender: initialData?.gender || "",
      category:
        categoryOptions.find(
          (opt) => opt.toLowerCase() === initialData?.category?.toLowerCase()
        ) || "",
      location: initialData?.location || "",
      shortDescription: initialData?.shortDescription || "",
      longDescription: initialData?.longDescription || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Pet name is required"),
      age: Yup.string().required("Pet age is required"),
      gender: Yup.string().required("Please pick a gender"),
      category: Yup.string().required("Please pick a category"),
      location: Yup.string().required("Location is required"),
      shortDescription: Yup.string().required("Short description is required"),
      longDescription: Yup.string().required("Detailed description is required"),
    }),
    onSubmit: (values) => {
      if (!imageURL) {
        setImageError("A photo is required");
        return;
      }
      setImageError("");

      const payload = {
        ...values,
        image: imageURL,
        isAdopted: initialData?.isAdopted || false,
        ownerId: initialData?.ownerId || user?.uid,
        ownerName: initialData?.ownerName || user?.displayName,
        ownerEmail: initialData?.ownerEmail || user?.email,
        ownerPhoto: initialData?.ownerPhoto || user?.photoURL,
      };
      onSubmit(payload);
      formik.setSubmitting(false);
    },
  });

  const err = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : undefined;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      setUploading(true);
      const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "d3aac2d3f145f2ff181135ea8a0ba76b";
      const imgUpload = `https://api.imgbb.com/1/upload?key=${key}`;
      const res = await axios.post(imgUpload, formData);
      const data = res.data;
      if (data.success) {
        setImageURL(data.data.url);
        setImageError("");
        toast.success("Photo uploaded!");
      } else {
        throw new Error("Image upload failed");
      }
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const busy = isSubmitting || formik.isSubmitting || uploading;

  return (
    <motion.div {...rise()}>
      <Card className={`${CARD} mx-auto max-w-3xl gap-0 px-0 py-0`}>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <FormField
              label="Pet photo"
              required
              error={imageError}
              hint={!imageURL && !uploading ? "PNG or JPG" : undefined}
            >
              {imageURL ? (
                <div className="flex items-center gap-4">
                  <img
                    src={imageURL}
                    alt="Pet preview"
                    className="h-24 w-24 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-1 object-cover"
                  />
                  <div className="flex flex-col items-start gap-2">
                    <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border bg-background px-4 text-sm font-medium shadow-xs transition hover:bg-accent">
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      Replace photo
                    </label>
                    <button
                      type="button"
                      onClick={() => setImageURL("")}
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
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <UploadCloud className="h-8 w-8 text-primary" />
                  <span className="text-sm font-semibold text-secondary">
                    Click to upload a photo
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Your pet&apos;s best side, well lit
                  </span>
                </label>
              )}
              {uploading && (
                <p className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </p>
              )}
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Pet name" required error={err("name")}>
                <Input
                  id="name"
                  placeholder="e.g. Max"
                  {...formik.getFieldProps("name")}
                  aria-invalid={Boolean(err("name"))}
                />
              </FormField>

              <FormField label="Age" required error={err("age")}>
                <Input
                  id="age"
                  placeholder="e.g. 5 months"
                  {...formik.getFieldProps("age")}
                  aria-invalid={Boolean(err("age"))}
                />
              </FormField>

              <FormField label="Gender" required error={err("gender")}>
                <Select
                  value={formik.values.gender}
                  onValueChange={(val) => formik.setFieldValue("gender", val)}
                >
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Category" required error={err("category")}>
                <Select
                  value={formik.values.category}
                  onValueChange={(val) => formik.setFieldValue("category", val)}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Location"
                required
                error={err("location")}
                className="sm:col-span-2"
              >
                <Input
                  id="location"
                  placeholder="City, Country"
                  {...formik.getFieldProps("location")}
                  aria-invalid={Boolean(err("location"))}
                />
              </FormField>
            </div>

            <FormField
              label="Short description"
              required
              error={err("shortDescription")}
              hint="One line shown on the pet card"
            >
              <Textarea
                id="shortDescription"
                rows={2}
                placeholder="Friendly golden retriever who loves kids"
                {...formik.getFieldProps("shortDescription")}
                aria-invalid={Boolean(err("shortDescription"))}
              />
            </FormField>

            <FormField
              label="Detailed description"
              required
              error={err("longDescription")}
              hint="Supports markdown shortcuts (## for headings, ** for bold)"
            >
              <div className="min-h-[160px] rounded-md border bg-transparent p-3 shadow-xs transition focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
                <EditorContent editor={editor} />
              </div>
            </FormField>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
              {isEditPage && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-6"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="rounded-full px-8"
                disabled={busy}
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {uploading
                  ? "Uploading photo…"
                  : isSubmitting || formik.isSubmitting
                  ? "Saving…"
                  : initialData
                  ? "Save changes"
                  : "Add pet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PetForm;
