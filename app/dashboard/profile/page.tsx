"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { toast } from "sonner";
import { updateProfile } from "firebase/auth";
import { Pencil, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { auth } from "@/firebase/firebase.init";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRole } from "@/hooks/useAuthRole";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import FormField from "@/components/dashboard/shared/FormField";
import { CARD, PAGE, rise } from "@/components/dashboard/shared/styles";

interface DetailRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

const DetailRow = ({ label, value, mono }: DetailRowProps) => (
  <div className="flex flex-col gap-1 border-t py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd
      className={`text-sm text-secondary sm:text-right ${
        mono ? "font-mono break-all" : "font-medium"
      }`}
    >
      {value}
    </dd>
  </div>
);

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { role, loading } = useAuthRole();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const openEdit = () => {
    setName(user?.displayName || "");
    setPhotoFile(null);
    setPhotoPreview(user?.photoURL || "");
    setOpen(true);
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview((prev) => {
      if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    e.target.value = "";
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Name can't be empty.");
      return;
    }
    setSaving(true);
    try {
      let photoURL = user?.photoURL || "";
      if (photoFile) {
        const formData = new FormData();
        formData.append("image", photoFile);
        const apiKey =
          process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
          process.env.VITE_imgbb_apiKey ||
          "";
        const uploadRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          formData
        );
        if (!uploadRes.data?.success) throw new Error("Image upload failed.");
        photoURL = uploadRes.data.data.url;
      }

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: trimmed, photoURL });
      }

      if (user?.uid) {
        await axios.patch(
          `https://kind-paws.vercel.app/api/users/profile/${user.uid}`,
          { name: trimmed, image: photoURL }
        );
      }

      if (user) {
        setUser({ ...user, displayName: trimmed, photoURL });
      }
      toast.success("Profile updated.");
      setOpen(false);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        errorObj?.response?.data?.message || errorObj?.message || "Could not update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className={PAGE}>
        <Card className={`${CARD} mx-auto max-w-3xl gap-0 py-0`}>
          <CardContent className="space-y-4 p-8">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={PAGE}>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <PageHeader
          eyebrow="Account"
          title="Your profile"
          description="How you appear across KindPaws, plus your account details."
          actions={
            <Button variant="outline" onClick={openEdit}>
              <Pencil className="h-4 w-4" />
              Edit profile
            </Button>
          }
        />

        <motion.div {...rise()}>
          <Card className={`${CARD} gap-0 overflow-hidden px-0 py-0`}>
            <div className="relative bg-secondary px-6 py-8 sm:px-8">
              <div className="relative flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-white/30">
                  <AvatarImage src={user.photoURL || ""} className="object-cover" />
                  <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                    {user.displayName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-bold text-white">
                    {user.displayName || "No name set"}
                  </h2>
                  <p className="truncate text-sm text-white/70">{user.email}</p>
                  <div className="mt-2">
                    <Badge variant={role === "admin" ? "default" : "secondary"}>
                      {loading ? "…" : role === "admin" ? "Administrator" : "Member"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8">
              <dl>
                <DetailRow label="Role" value={loading ? "…" : role || "—"} />
                <DetailRow
                  label="Email verified"
                  value={user.emailVerified ? "Yes" : "No"}
                />
                <DetailRow label="Phone" value={user.phoneNumber || "Not set"} />
                <DetailRow label="User ID" value={user.uid} mono />
                <DetailRow
                  label="Created"
                  value={
                    user.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleString()
                      : "—"
                  }
                />
                <DetailRow
                  label="Last sign in"
                  value={
                    user.metadata?.lastSignInTime
                      ? new Date(user.metadata.lastSignInTime).toLocaleString()
                      : "—"
                  }
                />
              </dl>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={open} onOpenChange={(o) => !saving && setOpen(o)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your display name and photo across KindPaws.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={photoPreview || ""} className="object-cover" />
                <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                  {name.trim()[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  id="profile-photo"
                  accept="image/*"
                  className="hidden"
                  onChange={onPhotoChange}
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="profile-photo" className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                    Change photo
                  </label>
                </Button>
                {photoFile && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {photoFile.name}
                  </p>
                )}
              </div>
            </div>

            <FormField label="Display name" htmlFor="profile-name" required>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </FormField>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
