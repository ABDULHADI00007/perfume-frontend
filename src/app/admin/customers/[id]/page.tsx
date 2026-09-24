"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/adminService";
import { AdminCustomer } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { formatDate, formatCurrency } from "@/lib/utils";



export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;
  const { hasPermission } = useAdminAuth();

  const [customer, setCustomer] = useState<AdminCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editable fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const loadCustomer = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getCustomerById(customerId);
      setCustomer(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setPhone(data.phone || "");
      setNotes(data.notes || "");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load customer profile");
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (hasPermission("customers.read")) {
      loadCustomer();
    }
  }, [loadCustomer, hasPermission]);

  if (!hasPermission("customers.read")) {
    return <AdminAccessDenied requiredPermission="customers.read" />;
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center font-sans">
        <Spinner size="lg" className="mx-auto mb-3 text-foreground-muted" />
        <p className="text-xs text-foreground-muted uppercase tracking-wider">Loading Customer Details...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-surface border border-border p-8 text-center max-w-md mx-auto my-12 font-sans">
        <p className="text-sm text-foreground-muted mb-4">{error || "Customer profile not found."}</p>
        <Link href="/admin/customers">
          <Button variant="outline" size="sm">
            Back to Customers
          </Button>
        </Link>
      </div>
    );
  }

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      const updated = await adminService.updateCustomer(customerId, {
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setCustomer(updated);
      setSuccessMessage("Customer profile updated successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update customer");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName =
    customer.name || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Customer Profile";

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-foreground-muted">
          <Link href="/admin/customers" className="hover:text-foreground">
            Customers
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{customer.email}</span>
        </div>

        <Link href="/admin/customers">
          <Button variant="outline" size="sm">
            ← Back to Customers
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface p-6 border border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl text-foreground font-normal">{displayName}</h1>
            <StatusBadge status={customer.status || "active"} />
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Registered on {formatDate(customer.createdAt)} • Email: {customer.email}
          </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Edit Customer Form */}
        <div className="lg:col-span-2 border border-border bg-surface p-6 space-y-4">
          <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground border-b border-border-subtle pb-3">
            Customer Profile & Notes
          </h3>

          <form onSubmit={handleSaveNotes} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!hasPermission("customers.update")}
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!hasPermission("customers.update")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                value={customer.email}
                disabled
                className="bg-surface-subtle"
              />
              <Input
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!hasPermission("customers.update")}
              />
            </div>

            <Textarea
              label="Administrative Private Notes"
              placeholder="Internal customer notes or preferences..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!hasPermission("customers.update")}
              rows={4}
            />

            {hasPermission("customers.update") && (
              <div className="pt-2">
                <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                  Save Profile Changes
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Order History if populated */}
        <div className="space-y-6">
          <div className="border border-border bg-surface p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground border-b border-border-subtle pb-3">
              Order History
            </h3>

            {customer.orders && customer.orders.length > 0 ? (
              <div className="divide-y divide-border-subtle">
                {customer.orders.map((ord) => (
                  <div key={ord._id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <Link
                        href={`/admin/orders/${ord._id}`}
                        className="font-medium text-foreground hover:underline font-mono"
                      >
                        {ord.orderNumber}
                      </Link>
                      <p className="text-[11px] text-foreground-muted">{formatDate(ord.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold font-mono">
                        {formatCurrency(ord.totalAmount, ord.currency || "USD")}
                      </span>
                      <div>
                        <StatusBadge status={ord.orderStatus} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-foreground-muted italic">
                No orders linked to this profile.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
