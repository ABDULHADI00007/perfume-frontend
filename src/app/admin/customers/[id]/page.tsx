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
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Save,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;
  const { hasPermission } = useAdminAuth();

  const [customer, setCustomer] = useState<AdminCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isStatusToggling, setIsStatusToggling] = useState(false);
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
      <div className="py-24 text-center font-sans">
        <Spinner size="lg" className="mx-auto mb-3 text-foreground-muted" />
        <p className="text-xs font-semibold text-foreground-muted uppercase tracking-[0.2em]">
          Loading Customer Profile...
        </p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center max-w-md mx-auto my-16 font-sans shadow-sm">
        <AlertCircle className="w-10 h-10 text-status-error mx-auto mb-3 opacity-80" />
        <p className="text-sm text-foreground-muted mb-5">
          {error || "Customer profile not found or has been removed."}
        </p>
        <Link href="/admin/customers">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Customers
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
      setError(err instanceof Error ? err.message : "Failed to update customer profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!customer) return;
    const nextStatus = customer.status === "active" ? "blocked" : "active";
    try {
      setIsStatusToggling(true);
      setError(null);
      setSuccessMessage(null);
      const updated = await adminService.updateCustomerStatus(customer._id, nextStatus);
      setCustomer(updated);
      setSuccessMessage(
        `Customer status changed to ${nextStatus === "active" ? "Active" : "Blocked"}.`
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setIsStatusToggling(false);
    }
  };

  const displayName =
    customer.name ||
    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
    customer.email.split("@")[0] ||
    "Customer";

  // Initials generation
  const initials = (() => {
    if (firstName || lastName) {
      return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
    }
    if (customer.name) {
      const parts = customer.name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    return customer.email.slice(0, 2).toUpperCase();
  })();

  // Order Metrics Calculations
  const ordersList = customer.orders || [];
  const orderCount = customer.totalOrders ?? ordersList.length;
  const totalSpent =
    customer.totalSpent ??
    ordersList.reduce((acc, ord) => acc + (Number(ord.totalAmount) || 0), 0);
  const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* Top Breadcrumbs & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-foreground-muted">
          <Link
            href="/admin/customers"
            className="hover:text-foreground transition-colors font-medium"
          >
            Customers
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-foreground-muted/60" />
          <span className="text-foreground font-semibold">{customer.email}</span>
        </div>

        <Link href="/admin/customers">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs h-9 font-medium shadow-xs border-border hover:bg-surface-subtle"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Customers
          </Button>
        </Link>
      </div>

      {/* Customer Hero Profile Header Card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0C134F] text-[#C5A880] flex items-center justify-center font-serif text-2xl font-semibold border-2 border-[#C5A880]/30 shadow-sm shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal tracking-tight">
                {displayName}
              </h1>
              <StatusBadge status={customer.status || "active"} />
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-foreground-muted mt-2">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-foreground-muted/80" />
                <span>{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-foreground-muted/80" />
                  <span>{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-foreground-muted/80" />
                <span>Joined {formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {hasPermission("customers.update") && (
          <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border">
            <Button
              variant={customer.status === "active" ? "ghost" : "outline"}
              size="sm"
              onClick={handleToggleStatus}
              isLoading={isStatusToggling}
              className={
                customer.status === "active"
                  ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-medium h-9"
                  : "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border border-emerald-300 text-xs font-medium h-9"
              }
            >
              {customer.status === "active" ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                  Block Customer
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Unblock Customer
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.14em] text-foreground-muted font-semibold block mb-1">
              Total Spent
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              {formatCurrency(totalSpent, "USD")}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.14em] text-foreground-muted font-semibold block mb-1">
              Total Orders
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              {orderCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.14em] text-foreground-muted font-semibold block mb-1">
              Average Order Value
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              {formatCurrency(avgOrderValue, "USD")}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.14em] text-foreground-muted font-semibold block mb-1">
              Account Status
            </span>
            <div className="mt-1">
              <StatusBadge status={customer.status || "active"} />
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Details & Orders Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Edit Customer Form */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-foreground-muted" />
              Customer Information & Private Notes
            </h3>
            <span className="text-[11px] text-foreground-muted">ID: {customer._id}</span>
          </div>

          <form onSubmit={handleSaveNotes} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!hasPermission("customers.update")}
                className="text-xs"
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!hasPermission("customers.update")}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                value={customer.email}
                disabled
                className="bg-surface-subtle text-xs cursor-not-allowed opacity-90"
              />
              <Input
                label="Phone Number"
                placeholder="e.g. +1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!hasPermission("customers.update")}
                className="text-xs"
              />
            </div>

            <div>
              <Textarea
                label="Administrative Private Notes"
                placeholder="Write internal customer notes, preferences, or VIP tags here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!hasPermission("customers.update")}
                rows={5}
                className="text-xs leading-relaxed resize-none"
              />
              <p className="text-[11px] text-foreground-muted mt-1.5">
                * Private notes are strictly internal and never shown to the customer.
              </p>
            </div>

            {hasPermission("customers.update") && (
              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSaving}
                  className="gap-2 text-xs font-semibold px-5 h-9"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Profile Changes
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Order History */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-foreground-muted" />
              Order History
            </h3>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground">
              {ordersList.length}
            </span>
          </div>

          {ordersList.length > 0 ? (
            <div className="divide-y divide-border/60">
              {ordersList.map((ord) => (
                <div
                  key={ord._id}
                  className="py-3.5 flex items-center justify-between gap-3 text-xs hover:bg-surface-subtle/50 px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${ord._id}`}
                        className="font-semibold text-foreground hover:underline font-mono text-xs flex items-center gap-1 text-[#0C134F] dark:text-blue-400"
                      >
                        {ord.orderNumber}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </Link>
                    </div>
                    <p className="text-[11px] text-foreground-muted">
                      {formatDate(ord.createdAt)}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-bold font-mono text-foreground block">
                      {formatCurrency(ord.totalAmount, ord.currency || "USD")}
                    </span>
                    <StatusBadge status={ord.orderStatus} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-foreground-muted space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto text-foreground-muted/40" />
              <p className="text-xs font-medium">No order history available.</p>
              <p className="text-[11px] text-foreground-muted/80">
                This customer has not placed any orders yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

