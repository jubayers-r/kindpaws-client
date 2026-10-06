"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "motion/react";
import LoadingScreen from "@/components/shared/LoadingScreen/LoadingScreen";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import { Pet } from "@/types";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

export default function PetDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);

  const {
    data: pet,
    isLoading,
    error: petError,
  } = useQuery<Pet>({
    queryKey: ["pet", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await axios.get(
        `https://kind-paws.vercel.app/api/pets/${id}`
      );
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: {
      petName: string;
      userId: string;
      userName: string;
      userEmail: string;
      phone: string;
      address: string;
    }) => {
      const res = await axios.post(
        `https://kind-paws.vercel.app/api/pets/${id}/adoption-request`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Adoption request sent!");
      setPhone("");
      setAddress("");
      setOpen(false);
      router.back();
    },
    onError: () => {
      toast.error("Failed to send adoption request.");
    },
  });

  const handleAdopt = () => {
    if (!phone || !address) return toast.error("All fields are required.");
    if (!pet || !user) return toast.error("Please sign in first.");

    mutation.mutate({
      petName: pet.name,
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userEmail: user.email || "",
      phone,
      address,
    });
  };

  if (petError && !pet) {
    return <ErrorPage error={petError} />;
  }

  if (isLoading || !pet) {
    return <LoadingScreen isLoading={true} />;
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn(0)}
    >
      <motion.img
        src={pet.image}
        alt={pet.name}
        className="w-full rounded-xl shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div variants={fadeIn(0.2)} className="space-y-2">
        <h1 className="text-4xl font-bold">{pet.name}</h1>
        <p className="text-muted-foreground text-lg">{pet.shortDescription}</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700"
        variants={fadeIn(0.3)}
      >
        <div>
          <strong>Age:</strong> {pet.age}
        </div>
        <div>
          <strong>Gender:</strong> {pet.gender}
        </div>
        <div>
          <strong>Category:</strong> {pet.category}
        </div>
        <div>
          <strong>Location:</strong> {pet.location}
        </div>
      </motion.div>

      {pet.tags && pet.tags.length > 0 && (
        <motion.div className="flex flex-wrap gap-2" variants={fadeIn(0.35)}>
          {pet.tags.map((tag) => (
            <Badge key={tag} className="text-sm px-3 py-1 rounded-full">
              {tag}
            </Badge>
          ))}
        </motion.div>
      )}

      <motion.div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: pet.longDescription }}
        variants={fadeIn(0.4)}
      />

      <motion.div
        className="bg-gray-100 p-4 rounded-lg flex items-center gap-4 shadow-sm"
        variants={fadeIn(0.45)}
      >
        <img
          src={pet.ownerPhoto}
          alt={pet.ownerName}
          className="w-14 h-14 rounded-full object-cover border"
        />
        <div>
          <div className="font-medium">{pet.ownerName}</div>
          <div className="text-sm text-muted-foreground">{pet.ownerEmail}</div>
        </div>
      </motion.div>

      <motion.div
        className="text-sm text-gray-600 flex flex-wrap gap-4"
        variants={fadeIn(0.5)}
      >
        <span>
          📅 Added on:{" "}
          {new Date(pet.dateAdded || pet.createdAt || "").toLocaleDateString()}
        </span>
        {pet.isFeatured && (
          <span className="text-yellow-600">🌟 Featured Pet</span>
        )}
        {pet.isAdopted && (
          <span className="text-green-600">✅ Already Adopted</span>
        )}
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <motion.div
            className="w-fit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="mt-4">Adopt</Button>
          </motion.div>
        </DialogTrigger>

        <DialogContent>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>Adopt {pet?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={user?.displayName || ""} disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button onClick={handleAdopt} disabled={mutation.isPending}>
                  {mutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
