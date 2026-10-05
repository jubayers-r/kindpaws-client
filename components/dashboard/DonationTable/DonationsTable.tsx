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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Pencil, Trash2, Pause, Play, Search } from "lucide-react";
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
import { Campaign } from "@/types";

const ROWS_PER_PAGE = 10;

interface DonationsTableProps {
  user: User | null;
  role: string | null;
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  headerActions?: React.ReactNode;
}

export default function DonationsTable({
  user,
  role,
  header,
  headerActions,
}: DonationsTableProps) {
  const pathname = usePathname();
  const isAdmin = role === "admin";
  const isAllDonationsLocation = pathname === "/dashboard/all-donations";
  const showAll = isAdmin && isAllDonationsLocation;

  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Campaign | null>(null);

  const {
    data: campaigns = [],
    isLoading,
    refetch,
  } = useQuery<Campaign[]>({
    queryKey: ["allDonations"],
    queryFn: async () => {
      const res = await fetch("https://kind-paws.vercel.app/api/campaigns");
      if (!res.ok) throw new Error("Failed to fetch donation campaigns");
      return res.json();
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: async (campaignId: string) =>
      await axios.delete("https://kind-paws.vercel.app/api/campaigns/delete", {
        params: { id: campaignId },
      }),
    onSuccess: () => {
      setPendingDelete(null);
      refetch();
      toast.success("Campaign deleted successfully");
    },
    onError: () => toast.error("Failed to delete campaign"),
  });

  const togglePause = useMutation({
    mutationFn: async (campaignId: string) =>
      await axios.patch(
        "https://kind-paws.vercel.app/api/campaigns/statusToggle",
        {},
        { params: { id: campaignId } }
      ),
    onSuccess: () => {
      toast.success("Campaign status updated");
      refetch();
    },
    onError: () => toast.error("Failed to update campaign status"),
  });

  const filteredCampaigns = campaigns
    .filter((c) => showAll || c?.ownerId === user?.uid)
    .filter((c) => {
      if (filter === "active" && !c.isOpen) return false;
      if (filter === "paused" && c.isOpen) return false;
      if (
        ownerFilter &&
        !c.ownerName?.toLowerCase().includes(ownerFilter.trim().toLowerCase())
      )
        return false;
      return true;
    });

  const totalPages = Math.ceil(filteredCampaigns.length / ROWS_PER_PAGE);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );
  const columnCount = isAdmin ? 6 : 5;

  const actions = (c: Campaign) => (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="min-w-[90px]"
        onClick={() => togglePause.mutate(c._id)}
        disabled={togglePause.isPending}
      >
        {c.isOpen ? (
          <>
            <Pause className="h-4 w-4 mr-1" /> Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-1" /> Play
          </>
        )}
      </Button>
      <Button size="sm" variant="outline" asChild>
        <Link href={`/dashboard/update-campaign/${c._id}`}>
          <Pencil className="h-4 w-4" /> Edit
        </Link>
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={ACTION_DESTRUCTIVE}
        onClick={() => setPendingDelete(c)}
      >
        <Trash2 className="h-4 w-4" /> Delete
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
            <div className="flex gap-2">
              {(["all", "active", "paused"] as const).map((val) => (
                <Button
                  key={val}
                  size="sm"
                  variant={filter === val ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => {
                    setFilter(val);
                    setCurrentPage(1);
                  }}
                >
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </Button>
              ))}
            </div>
            {isAdmin && (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter by owner"
                  value={ownerFilter}
                  onChange={(e) => {
                    setOwnerFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 w-full rounded-full pl-9 sm:w-52"
                />
              </div>
            )}
          </>
        }
      />
      <TableShell>
        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={TABLE_HEAD}>Title</TableHead>
                <TableHead className={TABLE_HEAD}>Goal</TableHead>
                <TableHead className={TABLE_HEAD}>Progress</TableHead>
                <TableHead className={TABLE_HEAD}>Status</TableHead>
                {isAdmin && <TableHead className={TABLE_HEAD}>Owner</TableHead>}
                <TableHead className={`${TABLE_HEAD} text-center`}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={5} cols={columnCount} />
              ) : paginatedCampaigns.length > 0 ? (
                paginatedCampaigns.map((c) => {
                  const progress = Math.min(
                    100,
                    Math.round((c.collectedAmount / c.goalAmount) * 100)
                  );
                  return (
                    <TableRow key={c._id}>
                      <TableCell className="px-3 py-3 font-semibold text-secondary">
                        {c.title}
                      </TableCell>
                      <TableCell className="px-3 py-3">${c.goalAmount}</TableCell>
                      <TableCell className="px-3 py-3 min-w-[180px]">
                        <Progress value={progress} className="h-2" />
                        <span className="mt-1 block text-xs text-muted-foreground">
                          ${c.collectedAmount} raised ({progress}%)
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        <Badge variant={c.isOpen ? "success" : "outline"}>
                          {c.isOpen ? "Active" : "Paused"}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="px-3 py-3">
                          {c.ownerName || "N/A"}
                        </TableCell>
                      )}
                      <TableCell className="px-3 py-3">{actions(c)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columnCount} className="p-0">
                    <EmptyState
                      title="No campaigns found"
                      description="Adjust the filters, or create a new donation campaign."
                    >
                      <Button size="sm" className="rounded-full" asChild>
                        <Link href="/dashboard/create-campaign">
                          Create campaign
                        </Link>
                      </Button>
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
                <div className="h-4 w-3/4 rounded bg-accent" />
                <div className="h-2 w-full rounded bg-accent" />
                <div className="h-2 w-1/2 rounded bg-accent" />
              </div>
            ))
          ) : paginatedCampaigns.length > 0 ? (
            paginatedCampaigns.map((c) => {
              const progress = Math.min(
                100,
                Math.round((c.collectedAmount / c.goalAmount) * 100)
              );
              return (
                <div
                  key={c._id}
                  className="rounded-2xl border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-secondary">{c.title}</h3>
                    <Badge variant={c.isOpen ? "success" : "outline"}>
                      {c.isOpen ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    ${c.goalAmount} goal
                  </p>
                  <Progress value={progress} className="mt-2 h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    ${c.collectedAmount} raised ({progress}%)
                  </p>
                  {isAdmin && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      By: {c.ownerName || "N/A"}
                    </p>
                  )}
                  <div className="mt-3">{actions(c)}</div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="No campaigns found"
              description="Adjust the filters, or create a new donation campaign."
            >
              <Button size="sm" className="rounded-full" asChild>
                <Link href="/dashboard/create-campaign">
                  Create campaign
                </Link>
              </Button>
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
        title={`Delete “${pendingDelete?.title}”?`}
        description="This permanently removes the campaign and its progress. This action cannot be undone."
        confirmLabel="Delete campaign"
        isLoading={deleteCampaign.isPending}
        onConfirm={() => {
          if (pendingDelete) deleteCampaign.mutate(pendingDelete._id);
        }}
      />
    </>
  );
}
