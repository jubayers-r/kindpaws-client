"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter, useParams } from "next/navigation";
import Image from "next/image";
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
import {
  Loader2,
  UploadCloud,
  X,
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { Pet } from "@/types";

const categoryOptions = ["Dog", "Cat", "Bird", "Rabbit"] as const;
const genderOptions = ["Male", "Female", "Other"] as const;

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  age: z.string().min(1, "Pet age is required"),
  gender: z.string().min(1, "Please pick a gender"),
  category: z.string().min(1, "Please pick a category"),
  location: z.string().min(1, "Location is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Detailed description is required"),
});

type PetFormValues = z.infer<typeof petSchema>;

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

  const matchedCategory =
    categoryOptions.find(
      (opt) => opt.toLowerCase() === initialData?.category?.toLowerCase()
    ) || "";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: initialData?.name || "",
      age: initialData?.age || "",
      gender: initialData?.gender || "",
      category: matchedCategory,
      location: initialData?.location || "",
      shortDescription: initialData?.shortDescription || "",
      longDescription: initialData?.longDescription || "",
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.longDescription || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] p-3 text-sm focus:outline-none focus:ring-0 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mb-1 [&>blockquote]:border-l-2 [&>blockquote]:border-primary [&>blockquote]:pl-3 [&>blockquote]:italic",
      },
    },
    onUpdate: ({ editor: ed }) => {
      setValue("longDescription", ed.getHTML(), { shouldValidate: true });
    },
  });


  const handleFormSubmit = async (values: PetFormValues) => {
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
    await onSubmit(payload);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      setUploading(true);
      const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";
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

  const busy = isSubmitting || isFormSubmitting || uploading;

  return (
    <motion.div {...rise()}>
      <Card className={`${CARD} mx-auto max-w-3xl gap-0 px-0 py-0`}>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              label="Pet photo"
              required
              error={imageError}
              hint={!imageURL && !uploading ? "PNG or JPG" : undefined}
            >
              {imageURL ? (
                <div className="flex items-center gap-4">
                  <Image
                    src={imageURL}
                    alt="Pet preview"
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
              <FormField label="Pet name" required error={errors.name?.message}>
                <Input
                  id="name"
                  placeholder="e.g. Max"
                  {...register("name")}
                  aria-invalid={Boolean(errors.name)}
                />
              </FormField>

              <FormField label="Age" required error={errors.age?.message}>
                <Input
                  id="age"
                  placeholder="e.g. 5 months"
                  {...register("age")}
                  aria-invalid={Boolean(errors.age)}
                />
              </FormField>

              <FormField label="Gender" required error={errors.gender?.message}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
              </FormField>

              <FormField
                label="Category"
                required
                error={errors.category?.message}
              >
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
              </FormField>

              <FormField
                label="Location"
                required
                error={errors.location?.message}
                className="sm:col-span-2"
              >
                <Input
                  id="location"
                  placeholder="City, Country"
                  {...register("location")}
                  aria-invalid={Boolean(errors.location)}
                />
              </FormField>
            </div>

            <FormField
              label="Short description"
              required
              error={errors.shortDescription?.message}
              hint="One line shown on the pet card"
            >
              <Textarea
                id="shortDescription"
                rows={2}
                placeholder="Friendly golden retriever who loves kids"
                {...register("shortDescription")}
                aria-invalid={Boolean(errors.shortDescription)}
              />
            </FormField>

            <FormField
              label="Detailed description"
              required
              error={errors.longDescription?.message}
              hint="Use the formatting toolbar or markdown shortcuts to style your pet's story."
            >
              <div className="overflow-hidden rounded-xl border bg-background shadow-xs transition focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
                {editor && (
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b bg-muted/40 p-1.5 text-muted-foreground sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground ${
                        editor.isActive("bold")
                          ? "bg-primary/15 text-primary font-bold"
                          : ""
                      }`}
                      title="Bold"
                      aria-label="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground ${
                        editor.isActive("italic")
                          ? "bg-primary/15 text-primary"
                          : ""
                      }`}
                      title="Italic"
                      aria-label="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground ${
                        editor.isActive("strike")
                          ? "bg-primary/15 text-primary"
                          : ""
                      }`}
                      title="Strikethrough"
                      aria-label="Strikethrough"
                    >
                      <Strikethrough className="h-4 w-4" />
                    </button>

                    <div className="mx-1 h-4 w-px bg-border" />

                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleHeading({ level: 2 })
                          .run()
                      }
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground ${
                        editor.isActive("heading", { level: 2 })
                          ? "bg-primary/15 text-primary font-bold"
                          : ""
                      }`}
                      title="Heading 2"
                      aria-label="Heading 2"
                    >
                      <Heading2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .toggleHeading({ level: 3 })
                          .run()
                      }
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground ${
                        editor.isActive("heading", { level: 3 })
                          ? "bg-primary/15 text-primary font-bold"
                          : ""
                      }`}
                      title="Heading 3"
                      aria-label="Heading 3"
                    >
                      <Heading3 className="h-4 w-4" />
                    </button>

                    <div className="mx-1 h-4 w-px bg-border" />

                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground ${
                        editor.isActive("bulletList")
                          ? "bg-primary/15 text-primary"
                          : ""
                      }`}
                      title="Bullet list"
                      aria-label="Bullet list"
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground ${
                        editor.isActive("orderedList")
                          ? "bg-primary/15 text-primary"
                          : ""
                      }`}
                      title="Numbered list"
                      aria-label="Numbered list"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                      }
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground ${
                        editor.isActive("blockquote")
                          ? "bg-primary/15 text-primary"
                          : ""
                      }`}
                      title="Quote"
                      aria-label="Quote"
                    >
                      <Quote className="h-4 w-4" />
                    </button>

                    <div className="mx-1 h-4 w-px bg-border" />

                    <button
                      type="button"
                      onClick={() => editor.chain().focus().undo().run()}
                      disabled={!editor.can().undo()}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                      title="Undo"
                      aria-label="Undo"
                    >
                      <Undo className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().redo().run()}
                      disabled={!editor.can().redo()}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                      title="Redo"
                      aria-label="Redo"
                    >
                      <Redo className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="min-h-[220px] cursor-text bg-background">
                  <EditorContent editor={editor} />
                </div>
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
                  : isSubmitting || isFormSubmitting
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
