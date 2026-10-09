"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Repeat,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "firebase/auth";

import TableShell from "@/components/dashboard/shared/TableShell";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import TableSkeleton from "@/components/dashboard/shared/TableSkeleton";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import Pagination from "@/components/dashboard/shared/Pagination";
import ConfirmDialog from "@/components/dashboard/shared/ConfirmDialog";
import {
  ACTION_DESTRUCTIVE,
  TABLE_HEAD,
} from "@/components/dashboard/shared/styles";
import { Pet } from "@/types";
import { API_BASE } from "@/lib/api";

const ROWS_PER_PAGE = 10;

interface PetsTableProps {
  user: User | null;
  role: string | null;
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  headerActions?: React.ReactNode;
}

export default function PetsTable({
  user,
  role,
  header,
  headerActions,
}: PetsTableProps) {
  const pathname = usePathname();
  const isAdmin = role === "admin";
  const isAllPetsLocation = pathname === "/dashboard/all-pets";
  const showAllPets = isAdmin && isAllPetsLocation;

  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Pet | null>(null);

  const {
    data: pets = [],
    isLoading,
    refetch,
  } = useQuery<Pet[]>({
    queryKey: ["allPets"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/pets`);
      if (!res.ok) throw new Error("Failed to fetch pets");
      return res.json();
    },
  });

  const deletePet = useMutation({
    mutationFn: async (petId: string) => {
      const res = await axios.delete(
        `${API_BASE}/api/pets/delete`,
        {
          params: { id: petId },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Pet deleted successfully");
      setPendingDelete(null);
      refetch();
    },
    onError: () => toast.error("Failed to delete pet"),
  });

  const toggleStatus = useMutation({
    mutationFn: async (petId: string) => {
      const res = await axios.patch(
        `${API_BASE}/api/pets/statusToggle`,
        {},
        { params: { id: petId } }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Pet status updated");
      refetch();
    },
    onError: () => toast.error("Failed to update pet status"),
  });

  const filteredPets = (
    showAllPets ? pets : pets.filter((pet) => pet?.ownerId === user?.uid)
  ).filter((pet) =>
    pet?.name?.toLowerCase().includes(search.trim().toLowerCase())
  );

  const sortedPets = [...filteredPets];
  if (sortConfig.key) {
    const key = sortConfig.key as keyof Pet;
    sortedPets.sort((a, b) => {
      const aValue = String(a[key] ?? "").toLowerCase();
      const bValue = String(b[key] ?? "").toLowerCase();
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const requestSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const sortHeadProps = (key: string) => ({
    onClick: () => requestSort(key),
    className: `${TABLE_HEAD} cursor-pointer select-none hover:text-primary`,
  });

  const totalPages = Math.ceil(sortedPets.length / ROWS_PER_PAGE);
  const paginatedPets = sortedPets.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );
  const columnCount = isAdmin ? 7 : 6;

  const actions = (pet: Pet) => (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {isAdmin && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => toggleStatus.mutate(pet._id)}
          disabled={pet.isAdopted || toggleStatus.isPending}
        >
          <Repeat className="h-4 w-4" />
          Adopt
        </Button>
      )}
      <Button size="sm" variant="outline" asChild>
        <Link href={`/dashboard/update-pet/${pet._id}`}>
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={ACTION_DESTRUCTIVE}
        onClick={() => setPendingDelete(pet)}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );

  return (
    <>
      <PageHeader
        {...header}
        actions={
          <>
            {headerActions}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 w-full rounded-full pl-9 sm:w-64"
              />
            </div>
          </>
        }
      />
      <TableShell>
        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={TABLE_HEAD}>#</TableHead>
                <TableHead className={TABLE_HEAD}>Image</TableHead>
                <TableHead {...sortHeadProps("name")}>
                  <span className="inline-flex items-center gap-1">
                    Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />)}
                  </span>
                </TableHead>
                <TableHead {...sortHeadProps("category")}>
                  <span className="inline-flex items-center gap-1">
                    Type {sortConfig.key === "category" && (sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />)}
                  </span>
                </TableHead>
                <TableHead {...sortHeadProps("isAdopted")}>
                  <span className="inline-flex items-center gap-1">
                    Status {sortConfig.key === "isAdopted" && (sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />)}
                  </span>
                </TableHead>
                {isAdmin && (
                  <TableHead {...sortHeadProps("ownerName")}>
                    <span className="inline-flex items-center gap-1">
                      Owner {sortConfig.key === "ownerName" && (sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />)}
                    </span>
                  </TableHead>
                )}
                <TableHead className={`${TABLE_HEAD} text-center`}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={5} cols={columnCount} />
              ) : paginatedPets.length > 0 ? (
                paginatedPets.map((pet, index) => (
                  <TableRow key={pet._id}>
                    <TableCell className="px-3 py-3 text-muted-foreground">
                      {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <Image
                        src={pet.image || "/paws-logo.png"}
                        alt={pet.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="mx-auto h-12 w-12 rounded-xl object-cover"
                      />
                    </TableCell>
                    <TableCell className="px-3 py-3 font-semibold text-secondary">
                      {pet.name}
                    </TableCell>
                    <TableCell className="px-3 py-3 capitalize">
                      {pet.category}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <Badge variant={pet.isAdopted ? "success" : "outline"}>
                        {pet.isAdopted ? "Adopted" : "Available"}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="px-3 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={pet.ownerPhoto || ""}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {pet.ownerName?.[0] || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {pet.ownerName || "N/A"}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {pet.ownerEmail || ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="px-3 py-3">{actions(pet)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columnCount} className="p-0">
                    <EmptyState
                      title={
                        search ? "No pets match your search" : "No pets yet"
                      }
                      description={
                        search
                          ? `Nothing found for “${search}”.`
                          : "Pets you add will show up here."
                      }
                    >
                      {!search && (
                        <Button size="sm" className="rounded-full" asChild>
                          <Link href="/dashboard/add-pet">Add a pet</Link>
                        </Button>
                      )}
                    </EmptyState>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Mobile cards */}
        <div className="space-y-4 p-4 lg:hidden">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm"
              >
                <div className="h-16 w-16 rounded-xl bg-accent" />
                <div className="h-4 w-1/2 rounded bg-accent" />
                <div className="h-4 w-1/3 rounded bg-accent" />
              </div>
            ))
          ) : paginatedPets.length > 0 ? (
            paginatedPets.map((pet) => (
              <div
                key={pet._id}
                className="rounded-2xl border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={pet.image || "/paws-logo.png"}
                    alt={pet.name}
                    width={64}
                    height={64}
                    unoptimized
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 space-y-1">
                    <h3 className="truncate font-semibold text-secondary">
                      {pet.name}
                    </h3>
                    <p className="text-sm capitalize text-muted-foreground">
                      {pet.category}
                    </p>
                    <Badge variant={pet.isAdopted ? "success" : "outline"}>
                      {pet.isAdopted ? "Adopted" : "Available"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4">{actions(pet)}</div>
              </div>
            ))
          ) : (
            <EmptyState
              title={search ? "No pets match your search" : "No pets yet"}
              description={
                search
                  ? `Nothing found for “${search}”.`
                  : "Pets you add will show up here."
              }
            >
              {!search && (
                <Button size="sm" className="rounded-full" asChild>
                  <Link href="/dashboard/add-pet">Add a pet</Link>
                </Button>
              )}
            </EmptyState>
          )}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </TableShell>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete “${pendingDelete?.name}”?`}
        description="This permanently removes the pet from KindPaws. This action cannot be undone."
        confirmLabel="Delete pet"
        isLoading={deletePet.isPending}
        onConfirm={() => {
          if (pendingDelete) deletePet.mutate(pendingDelete._id);
        }}
      />
    </>
  );
}
