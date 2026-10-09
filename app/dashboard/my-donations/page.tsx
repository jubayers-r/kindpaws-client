"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

import PageHeader from "@/components/dashboard/shared/PageHeader";
import TableShell from "@/components/dashboard/shared/TableShell";
import TableSkeleton from "@/components/dashboard/shared/TableSkeleton";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import Pagination from "@/components/dashboard/shared/Pagination";
import ConfirmDialog from "@/components/dashboard/shared/ConfirmDialog";
import {
  ACTION_DESTRUCTIVE,
  PAGE,
  TABLE_HEAD,
} from "@/components/dashboard/shared/styles";
import { DonationRecord } from "@/types";

const ROWS_PER_PAGE = 10;

export default function MyDonationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingRefund, setPendingRefund] = useState<DonationRecord | null>(
    null
  );

  const { data: donations = [], isLoading } = useQuery<DonationRecord[]>({
    queryKey: ["my-donations"],
    enabled: Boolean(user?.uid),
    queryFn: async () => {
      const res = await axios.get(
        "https://kind-paws.vercel.app/api/campaigns/my",
        {
          params: { id: user?.uid },
        }
      );
      return res.data;
    },
  });

  const refundMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.patch(
        `https://kind-paws.vercel.app/api/campaigns/refund/${id}`
      );
    },
    onSuccess: () => {
      toast.success("Refund processed");
      setPendingRefund(null);
      queryClient.invalidateQueries({ queryKey: ["my-donations"] });
    },
    onError: () => toast.error("Refund failed"),
  });

  const totalPages = Math.ceil(donations.length / ROWS_PER_PAGE);
  const paginatedDonations = donations.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const refundButton = (d: DonationRecord) => (
    <Button
      variant="ghost"
      size="sm"
      className={ACTION_DESTRUCTIVE}
      disabled={d.isRefunded}
      onClick={() => setPendingRefund(d)}
    >
      Ask for refund
    </Button>
  );

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className={PAGE}>
      <PageHeader
        eyebrow="Donations"
        title="My donations"
        description="Every contribution you have made to KindPaws campaigns."
      />

      <TableShell>
        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={TABLE_HEAD}>Pet</TableHead>
                <TableHead className={TABLE_HEAD}>Campaign</TableHead>
                <TableHead className={TABLE_HEAD}>Amount</TableHead>
                <TableHead className={TABLE_HEAD}>Date</TableHead>
                <TableHead className={TABLE_HEAD}>Status</TableHead>
                <TableHead className={`${TABLE_HEAD} text-center`}>
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : paginatedDonations.length > 0 ? (
                paginatedDonations.map((donation) => (
                  <TableRow key={donation._id}>
                    <TableCell className="px-3 py-3">
                      <img
                        src={donation.campaignSnapshot.image}
                        alt="Pet"
                        loading="lazy"
                        className="mx-auto h-14 w-14 rounded-xl object-cover"
                      />
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <p className="font-semibold text-secondary">
                        {donation.campaignSnapshot.petName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {donation.campaignSnapshot.title}
                      </p>
                    </TableCell>
                    <TableCell className="px-3 py-3 font-medium">
                      ${donation.amount}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-muted-foreground">
                      {formatDate(donation.createdAt)}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      {donation.isRefunded ? (
                        <Badge variant="destructive">Refunded</Badge>
                      ) : (
                        <Badge variant="success">Success</Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <div className="flex justify-center">
                        {refundButton(donation)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState
                      title="No donations yet"
                      description="You haven't made any donations yet. Supporting a campaign takes one click."
                    >
                      <Button size="sm" className="rounded-full" asChild>
                        <Link href="/campaigns">Browse campaigns</Link>
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
                className="flex gap-4 rounded-2xl border bg-card p-4 shadow-sm"
              >
                <Skeleton className="h-20 w-20 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-8 w-full rounded-full" />
                </div>
              </div>
            ))
          ) : paginatedDonations.length > 0 ? (
            paginatedDonations.map((donation) => (
              <div
                key={donation._id}
                className="rounded-2xl border bg-card p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <img
                    src={donation.campaignSnapshot.image}
                    alt="Pet"
                    loading="lazy"
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-secondary">
                          {donation.campaignSnapshot.petName}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {donation.campaignSnapshot.title}
                        </p>
                      </div>
                      {donation.isRefunded ? (
                        <Badge variant="destructive">Refunded</Badge>
                      ) : (
                        <Badge variant="success">Success</Badge>
                      )}
                    </div>
                    <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between gap-3">
                        <dt>Amount</dt>
                        <dd className="font-medium text-foreground">
                          ${donation.amount}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt>Date</dt>
                        <dd className="text-foreground">
                          {formatDate(donation.createdAt)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-3 flex justify-end">
                      {refundButton(donation)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No donations yet"
              description="You haven't made any donations yet."
            >
              <Button size="sm" className="rounded-full" asChild>
                <Link href="/campaigns">Browse campaigns</Link>
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
        open={Boolean(pendingRefund)}
        onOpenChange={(open) => !open && setPendingRefund(null)}
        title={`Request a refund of $${pendingRefund?.amount}?`}
        description="The campaign owner will be notified and the donation will be returned to you if approved."
        confirmLabel="Request refund"
        destructive={false}
        isLoading={refundMutation.isPending}
        onConfirm={() => {
          if (pendingRefund) refundMutation.mutate(pendingRefund._id);
        }}
      />
    </div>
  );
}
