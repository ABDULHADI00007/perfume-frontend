"use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/services/adminService";
import { AdminReview } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { TableActionButton, TableActionGroup } from "@/components/admin/TableAction";
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
        <TableActionGroup>
          {hasPermission("reviews.moderate") && (
            <>
              {row.status !== "approved" && (
                <TableActionButton
                  variant="success"
                  onClick={() => handleModerate(row._id, "approved")}
                >
                  Approve
                </TableActionButton>
              )}
              {row.status !== "rejected" && (
                <TableActionButton
                  variant="ghost"
                  onClick={() => handleModerate(row._id, "rejected")}
                >
                  Reject
                </TableActionButton>
              )}
              <TableActionButton
                variant="destructive"
                onClick={() => setReviewToDelete(row)}
              >
                Delete
              </TableActionButton>
            </>
          )}
        </TableActionGroup>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="CUSTOMER INTELLIGENCE"
        title="Reviews Moderation"
        description="Verify testimonials from authentic perfume connoisseurs, approve star ratings, and filter spam."
        count={reviews.length}
        breadcrumbs={[{ label: "Reviews" }]}
        actions={
          <div className="w-52">
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
        }
      />

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
