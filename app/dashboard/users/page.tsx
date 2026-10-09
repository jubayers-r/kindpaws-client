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
import { motion } from "motion/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Search, ShieldCheck, Ban, Undo2, UserCheck, UserCog } from "lucide-react";
import axios from "axios";

import TableShell from "@/components/dashboard/shared/TableShell";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import TableSkeleton from "@/components/dashboard/shared/TableSkeleton";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import Pagination from "@/components/dashboard/shared/Pagination";
import ConfirmDialog from "@/components/dashboard/shared/ConfirmDialog";
import {
  ACTION_DESTRUCTIVE,
  PAGE,
  TABLE_HEAD,
  rise,
} from "@/components/dashboard/shared/styles";
import { AppUser } from "@/types";

const ROWS_PER_PAGE = 10;

export default function UsersTablePage() {
  const authUser = useAuth().user;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingBan, setPendingBan] = useState<AppUser | null>(null);

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery<AppUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("https://kind-paws.vercel.app/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const makeAdminMutation = useMutation({
    mutationFn: async (userId: string) =>
      (
        await axios.patch(
          `https://kind-paws.vercel.app/api/users/promote`,
          {},
          { params: { uid: userId } }
        )
      ).data,
    onSuccess: () => {
      toast.success("User promoted to admin");
      refetch();
    },
    onError: () => toast.error("Something went wrong while promoting"),
  });

  const makeUserMutation = useMutation({
    mutationFn: async (userId: string) =>
      (
        await axios.patch(
          `https://kind-paws.vercel.app/api/users/demote`,
          {},
          { params: { uid: userId } }
        )
      ).data,
    onSuccess: () => {
      toast.success("Admin demoted to user");
      refetch();
    },
    onError: () => toast.error("Something went wrong while demoting"),
  });

  const banUserMutation = useMutation({
    mutationFn: async (userId: string) =>
      (
        await axios.patch(
          `https://kind-paws.vercel.app/api/users/ban`,
          {},
          { params: { uid: userId } }
        )
      ).data,
    onSuccess: () => {
      toast.success("User has been banned");
      setPendingBan(null);
      refetch();
    },
    onError: () => toast.error("Failed to ban user"),
  });

  const unbanUserMutation = useMutation({
    mutationFn: async (userId: string) =>
      (
        await axios.patch(
          `https://kind-paws.vercel.app/api/users/unban`,
          {},
          { params: { uid: userId } }
        )
      ).data,
    onSuccess: () => {
      toast.success("User has been unbanned");
      refetch();
    },
    onError: () => toast.error("Failed to unban user"),
  });

  const filteredUsers = users.filter((u) =>
    `${u.name || ""} ${u.email || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );



  const actions = (u: AppUser) => (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {u.role !== "admin" && !u.banned && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => makeAdminMutation.mutate(u.uid)}
          disabled={makeAdminMutation.isPending}
        >
          <UserCog className="h-4 w-4" />
          Make admin
        </Button>
      )}
      {u.role === "admin" && u.uid !== authUser?.uid && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => makeUserMutation.mutate(u.uid)}
          disabled={makeUserMutation.isPending}
        >
          <UserCheck className="h-4 w-4" />
          Make user
        </Button>
      )}
      {!u.banned && u.uid !== authUser?.uid && (
        <Button
          size="sm"
          variant="ghost"
          className={ACTION_DESTRUCTIVE}
          onClick={() => setPendingBan(u)}
        >
          <Ban className="h-4 w-4" />
          Ban
        </Button>
      )}
      {u.banned && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => unbanUserMutation.mutate(u.uid)}
          disabled={unbanUserMutation.isPending}
        >
          <Undo2 className="h-4 w-4" />
          Unban
        </Button>
      )}
      {u.uid === authUser?.uid && u.role === "admin" && (
        <Badge variant="secondary">You</Badge>
      )}
    </div>
  );

  return (
    <div className={PAGE}>
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Everyone registered on KindPaws, their roles and account status."
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-full rounded-full pl-9 sm:w-64"
            />
          </div>
        }
      />
      <TableShell>
        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={TABLE_HEAD}>Profile</TableHead>
                <TableHead className={TABLE_HEAD}>Name</TableHead>
                <TableHead className={TABLE_HEAD}>Email</TableHead>
                <TableHead className={TABLE_HEAD}>Role</TableHead>
                <TableHead className={TABLE_HEAD}>Status</TableHead>
                <TableHead className={`${TABLE_HEAD} text-center`}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="px-3 py-3">
                      <Avatar className="mx-auto h-10 w-10">
                        <AvatarImage
                          src={u.image || ""}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {u.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="px-3 py-3 font-semibold text-secondary">
                      {u.name}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      {u.role === "admin" ? (
                        <Badge variant="default">
                          <ShieldCheck className="mr-1 h-3 w-3" /> Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">User</Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      {u.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-3 py-3">{actions(u)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState
                      title="No users found"
                      description={
                        search
                          ? `Nothing found for “${search}”.`
                          : "No accounts yet."
                      }
                    />
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
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-accent" />
                    <div className="h-3 w-40 rounded bg-accent" />
                  </div>
                </div>
                <div className="h-8 w-full rounded bg-accent" />
              </div>
            ))
          ) : paginatedUsers.length > 0 ? (
            paginatedUsers.map((u) => (
              <motion.div
                key={u._id}
                {...rise()}
                className="rounded-2xl border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={u.image || ""} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {u.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-secondary">
                      {u.name}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {u.email}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {u.role === "admin" ? (
                    <Badge variant="default">
                      <ShieldCheck className="mr-1 h-3 w-3" /> Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline">User</Badge>
                  )}
                  {u.banned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="success">Active</Badge>
                  )}
                </div>
                <div className="mt-3">{actions(u)}</div>
              </motion.div>
            ))
          ) : (
            <EmptyState
              title="No users found"
              description={
                search ? `Nothing found for “${search}”.` : "No accounts yet."
              }
            />
          )}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </TableShell>

      <ConfirmDialog
        open={Boolean(pendingBan)}
        onOpenChange={(open) => !open && setPendingBan(null)}
        title={`Ban ${pendingBan?.name}?`}
        description="A banned user can no longer sign in or use KindPaws until unbanned."
        confirmLabel="Ban user"
        isLoading={banUserMutation.isPending}
        onConfirm={() => {
          if (pendingBan) banUserMutation.mutate(pendingBan.uid);
        }}
      />
    </div>
  );
}
