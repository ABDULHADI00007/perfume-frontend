"use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/services/adminService";
import { AdminReview } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";


export default function AdminReviewsPage() {
  const { hasPermission } = useAdminAuth();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [reviewToDelete, setReviewToDelete] = useState<AdminReview | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getAdminReviews();
      setReviews(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasPermission("reviews.read")) {
      fetchReviews();
    }
  }, [fetchReviews, hasPermission]);

  if (!hasPermission("reviews.read")) {
    return <AdminAccessDenied requiredPermission="reviews.read" />;
  }

  const handleModerate = async (reviewId: string, nextStatus: "approved" | "rejected") => {
    try {
      setIsLoading(true);
      setError(null);
      await adminService.moderateReview(reviewId, nextStatus);
      setSuccessMessage(`Review ${nextStatus} successfully.`);
      fetchReviews();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Failed to ${nextStatus} review`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeleteLoading(true);
      setError(null);
      await adminService.deleteReview(reviewToDelete._id);
      setSuccessMessage("Review permanently deleted.");
      setReviewToDelete(null);
      fetchReviews();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
      setReviewToDelete(null);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (!statusFilter) return true;
    return r.status === statusFilter;
  });

  const columns: Column<AdminReview>[] = [
    {
      header: "Product",
      cell: (row) => (
        <span className="font-semibold text-xs text-foreground">
          {row.product?.name || "Product Review"}
        </span>
      ),
    },
    {
      header: "Customer",
      cell: (row) => (
        <div>
          <span className="font-medium text-xs text-foreground">{row.customerName}</span>
          <p className="text-[11px] text-foreground-muted">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      header: "Rating",
      cell: (row) => (
        <div className="flex items-center space-x-1 text-primary">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icons.Star
              key={i}
              size={12}
              className={i < row.rating ? "fill-primary text-primary" : "text-border"}
            />
          ))}
          <span className="text-xs font-mono ml-1 text-foreground font-semibold">
            {row.rating}/5
          </span>
        </div>
      ),
    },
    {
      header: "Comment",
      cell: (row) => (
        <div className="max-w-xs sm:max-w-md">
          {row.title && <p className="font-semibold text-xs text-foreground">{row.title}</p>}
          <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed font-serif italic">
            &ldquo;{row.comment}&rdquo;
          </p>
        </div>
      ),
    },
    {
      header: "Date",
      cell: (row) => (
        <span className="text-xs text-foreground-muted">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {hasPermission("reviews.moderate") && (
            <>
              {row.status !== "approved" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleModerate(row._id, "approved")}
                  className="text-status-success hover:bg-status-success/10"
                >
                  Approve
                </Button>
              )}
              {row.status !== "rejected" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleModerate(row._id, "rejected")}
                  className="text-status-warning hover:bg-status-warning/10"
                >
                  Reject
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReviewToDelete(row)}
                className="text-status-error hover:bg-status-error/10"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-medium block">
            Customer Feedback & Verification
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
            Reviews Moderation
          </h1>
        </div>

        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: "All Reviews", value: "" },
              { label: "Pending Verification", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ]}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-status-success/10 border border-status-success/20 text-status-success text-xs font-medium">
          {successMessage}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredReviews}
        isLoading={isLoading}
        emptyMessage="No customer reviews found."
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        message={`Are you sure you want to permanently remove this review from ${reviewToDelete?.customerName}?`}
        confirmLabel="Delete Review"
        isDestructive
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
