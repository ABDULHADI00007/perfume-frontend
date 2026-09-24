"use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/services/adminService";
import { AdminSubscriber } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { formatDate } from "@/lib/utils";


export default function AdminNewsletterPage() {
  const { hasPermission } = useAdminAuth();
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Delete State
  const [subscriberToDelete, setSubscriberToDelete] = useState<AdminSubscriber | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminService.getSubscribers({
        page,
        limit: 15,
        search: search.trim() || undefined,
      });
      setSubscribers(res.subscribers);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalCount(res.meta.total || res.subscribers.length);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load newsletter subscribers");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (hasPermission("newsletter.manage")) {
      fetchSubscribers();
    }
  }, [fetchSubscribers, hasPermission]);

  if (!hasPermission("newsletter.manage")) {
    return <AdminAccessDenied requiredPermission="newsletter.manage" />;
  }

  const handleToggleStatus = async (s: AdminSubscriber) => {
    const nextStatus = s.status === "subscribed" ? "unsubscribed" : "subscribed";
    try {
      setIsLoading(true);
      setError(null);
      await adminService.updateSubscriberStatus(s._id, nextStatus);
      setSuccessMessage(`Subscriber ${s.email} marked as ${nextStatus}.`);
      fetchSubscribers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update subscriber status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!subscriberToDelete) return;
    try {
      setIsDeleteLoading(true);
      setError(null);
      await adminService.deleteSubscriber(subscriberToDelete._id);
      setSuccessMessage(`Subscriber ${subscriberToDelete.email} removed.`);
      setSubscriberToDelete(null);
      fetchSubscribers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete subscriber");
      setSubscriberToDelete(null);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const columns: Column<AdminSubscriber>[] = [
    {
      header: "Subscriber Email",
      cell: (row) => (
        <span className="font-semibold text-xs text-foreground font-mono">{row.email}</span>
      ),
    },
    {
      header: "Source",
      cell: (row) => (
        <span className="text-xs text-foreground-muted">{row.source || "Storefront Footer"}</span>
      ),
    },
    {
      header: "Date Subscribed",
      cell: (row) => (
        <span className="text-xs text-foreground-muted">
          {formatDate(row.subscribedAt || row.createdAt)}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const norm = row.status === "subscribed" ? "active" : "inactive";
        return <StatusBadge status={norm} />;
      },
    },
    {
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(row)}
            className="text-foreground-muted"
          >
            {row.status === "subscribed"
              ? "Unsubscribe"
              : "Re-subscribe"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSubscriberToDelete(row)}
            className="text-status-error hover:bg-status-error/10"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-medium block">
            Audience & Subscriptions
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
            Newsletter Subscribers
          </h1>
        </div>

        <div className="text-xs text-foreground-muted">
          Total subscribers: <span className="font-semibold text-foreground">{totalCount}</span>
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

      {/* Search Bar */}
      <div className="bg-surface p-4 border border-border flex items-center gap-3">
        <Input
          placeholder="Search subscriber email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="text-xs max-w-md"
        />

        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setSearch("");
            setPage(1);
          }}
        >
          Reset Search
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={subscribers}
        isLoading={isLoading}
        emptyMessage="No newsletter subscribers found."
      />

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(subscriberToDelete)}
        onClose={() => setSubscriberToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Subscriber"
        message={`Are you sure you want to remove "${subscriberToDelete?.email}" from the newsletter list?`}
        confirmLabel="Remove"
        isDestructive
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
