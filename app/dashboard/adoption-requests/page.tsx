"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PageHeader from "@/components/dashboard/shared/PageHeader";
import TableShell from "@/components/dashboard/shared/TableShell";
import QueryError from "@/components/dashboard/shared/QueryError";
import TableSkeleton from "@/components/dashboard/shared/TableSkeleton";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import Pagination from "@/components/dashboard/shared/Pagination";
import ConfirmDialog from "@/components/dashboard/shared/ConfirmDialog";
import {
  ACTION_DESTRUCTIVE,
  PAGE,
  TABLE_HEAD,
} from "@/components/dashboard/shared/styles";
import { AdoptionRequest } from "@/types";

const ROWS_PER_PAGE = 10;

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Approved"
      ? "success"
      : status === "Rejected"
      ? "destructive"
      : "default";
  return <Badge variant={variant}>{status}</Badge>;
}

export default function AdoptionRequestsPage() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingReject, setPendingReject] = useState<AdoptionRequest | null>(
    null
  );

  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<AdoptionRequest[]>({
    queryKey: ["adoption-requests"],
    enabled: Boolean(user?.uid),
    queryFn: () =>
      axios
        .get("/api/pets/adoption-requests", {
          params: { userId: user?.uid },
        })
        .then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: "Approved" | "Rejected";
    }) =>
      axios.patch(
        "/api/pets/adoption-requests",
        { status: action },
        { params: { id } }
      ),
    onSuccess: (_data, variables) => {
      setPendingReject(null);
      refetch();
      toast.success(
        `Request ${
          variables.action === "Approved" ? "accepted" : "rejected"
        }!`
      );
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const totalPages = Math.ceil(requests.length / ROWS_PER_PAGE);
  const paginatedRequests = requests.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const actions = (req: AdoptionRequest) => (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={req.status !== "Pending" || mutation.isPending}
        onClick={() => mutation.mutate({ id: req._id, action: "Approved" })}
      >
        Accept
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={ACTION_DESTRUCTIVE}
        disabled={req.status !== "Pending"}
        onClick={() => setPendingReject(req)}
      >
        Reject
      </Button>
    </div>
  );

  if (isError) {
    return (
      <div className={PAGE}>
        <PageHeader
          eyebrow="Adoption"
          title="Adoption requests"
          description="People who asked to adopt one of your pets. Accept or reject pending requests."
        />
        <QueryError
          message="Couldn't load adoption requests. The server may be unavailable."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className={PAGE}>
      <PageHeader
        eyebrow="Adoption"
        title="Adoption requests"
        description="People who asked to adopt one of your pets. Accept or reject pending requests."
      />

      <TableShell>
        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={TABLE_HEAD}>Pet</TableHead>
                <TableHead className={TABLE_HEAD}>Adopter</TableHead>
                <TableHead className={TABLE_HEAD}>Email</TableHead>
                <TableHead className={TABLE_HEAD}>Phone</TableHead>
                <TableHead className={TABLE_HEAD}>Location</TableHead>
                <TableHead className={TABLE_HEAD}>Status</TableHead>
                <TableHead className={`${TABLE_HEAD} text-center`}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={5} cols={7} />
              ) : paginatedRequests.length > 0 ? (
                paginatedRequests.map((req) => (
                  <TableRow
                    key={req._id}
                    className={
                      req.status !== "Pending"
                        ? "opacity-60 hover:bg-transparent"
                        : undefined
                    }
                  >
                    <TableCell className="px-3 py-3 font-semibold text-secondary">
                      {req.petName}
                    </TableCell>
                    <TableCell className="px-3 py-3">{req.userName}</TableCell>
                    <TableCell className="px-3 py-3 text-muted-foreground">
                      {req.userEmail}
                    </TableCell>
                    <TableCell className="px-3 py-3">{req.phone}</TableCell>
                    <TableCell className="px-3 py-3">{req.address}</TableCell>
                    <TableCell className="px-3 py-3">
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="px-3 py-3">{actions(req)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <EmptyState
                      title="No adoption requests yet"
                      description="When someone requests to adopt your pet, it will appear here."
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
                <div className="space-y-2">
                  <div className="h-4 w-1/2 rounded bg-accent" />
                  <div className="h-3 w-2/3 rounded bg-accent" />
                  <div className="h-3 w-1/3 rounded bg-accent" />
                </div>
              </div>
            ))
          ) : paginatedRequests.length > 0 ? (
            paginatedRequests.map((req) => (
              <div
                key={req._id}
                className={`rounded-2xl border bg-card p-4 shadow-sm ${
                  req.status !== "Pending" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-secondary">
                      {req.petName}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {req.userName} · {req.userEmail}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between gap-3">
                    <dt>Phone</dt>
                    <dd className="text-foreground">{req.phone}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Location</dt>
                    <dd className="text-foreground">{req.address}</dd>
                  </div>
                </dl>
                <div className="mt-3">{actions(req)}</div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No adoption requests yet"
              description="When someone requests to adopt your pet, it will appear here."
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
        open={Boolean(pendingReject)}
        onOpenChange={(open) => !open && setPendingReject(null)}
        title={`Reject ${pendingReject?.userName}'s request?`}
        description={`They asked to adopt ${pendingReject?.petName}. Rejecting lets them know the pet isn't available for them.`}
        confirmLabel="Reject request"
        isLoading={mutation.isPending}
        onConfirm={() => {
          if (pendingReject) {
            mutation.mutate({ id: pendingReject._id, action: "Rejected" });
          }
        }}
      />
    </div>
  );
}
