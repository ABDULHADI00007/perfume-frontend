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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Link
            href="/admin/customers"
            className="hover:text-[#590B16] transition-colors font-medium"
          >
            Customers
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[#0C134F] font-semibold">{customer.email}</span>
        </div>

        <Link href="/admin/customers">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs h-8.5 px-3.5 font-medium shadow-2xs border-slate-200 bg-white hover:bg-[#FAF7EE] text-[#0C134F] hover:text-[#590B16] hover:border-[#590B16]/30 rounded-xl transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" /> Back to Customers
          </Button>
        </Link>
      </div>

      {/* Customer Hero Profile Header Card - 21st.dev Luxury Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FCFAF6] to-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(12,19,79,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#590B16]/5 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />
        <div className="relative flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#0C134F] to-[#590B16] text-[#FAF7EE] flex items-center justify-center font-serif text-2xl font-bold border border-[#590B16]/30 shadow-sm ring-4 ring-[#FAF7EE] shrink-0">
            {initials}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-sans text-2xl sm:text-3xl text-[#0C134F] font-bold tracking-tight">
                {displayName}
              </h1>
              <StatusBadge status={customer.status || "active"} />
            </div>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500 font-sans">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{customer.email}</span>
              </div>
              {customer.phone && (
                <>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{customer.phone}</span>
                  </div>
                </>
              )}
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joined {formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {hasPermission("customers.update") && (
          <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 relative">
            <Button
              variant={customer.status === "active" ? "tableActionDestructive" : "tableActionSuccess"}
              size="sm"
              onClick={handleToggleStatus}
              isLoading={isStatusToggling}
              className="text-xs font-semibold h-9 px-4 rounded-xl shadow-2xs gap-1.5"
            >
              {customer.status === "active" ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Block Customer
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Unblock Customer
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Overview Stat Cards - 21st.dev Luxury Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-slate-300 transition-all">
          <div>
            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-bold block mb-1">
              Total Spent
            </span>
            <span className="text-xl font-bold font-mono text-[#0C134F]">
              {formatCurrency(totalSpent, "USD")}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-slate-300 transition-all">
          <div>
            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-bold block mb-1">
              Total Orders
            </span>
            <span className="text-xl font-bold font-mono text-[#0C134F]">
              {orderCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF7EE] text-[#590B16] border border-[#590B16]/20 flex items-center justify-center shrink-0 shadow-2xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-slate-300 transition-all">
          <div>
            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-bold block mb-1">
              Avg Order Value
            </span>
            <span className="text-xl font-bold font-mono text-[#0C134F]">
              {formatCurrency(avgOrderValue, "USD")}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-slate-300 transition-all">
          <div>
            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-bold block mb-1">
              Account Status
            </span>
            <div className="mt-1">
              <StatusBadge status={customer.status || "active"} />
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2.5 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Details & Orders Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Edit Customer Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F] flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Customer Information & Private Notes
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">ID: {customer._id}</span>
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
                className="bg-slate-50 text-xs cursor-not-allowed opacity-90 font-mono"
              />
              <Input
                label="Phone Number"
                placeholder="e.g. +1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!hasPermission("customers.update")}
                className="text-xs font-mono"
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
              <p className="text-[11px] text-slate-400 mt-1.5 font-sans">
                * Private notes are strictly internal and never shown to the customer.
              </p>
            </div>

            {hasPermission("customers.update") && (
              <div className="pt-3 flex justify-end border-t border-slate-100">
                <Button
                  type="submit"
                  variant="brand"
                  size="sm"
                  isLoading={isSaving}
                  className="gap-2 text-xs font-bold uppercase tracking-wider px-6 h-10 rounded-xl shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Profile Changes
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Order History */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#0C134F] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              Order History
            </h3>
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {ordersList.length}
            </span>
          </div>

          {ordersList.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {ordersList.map((ord) => (
                <div
                  key={ord._id}
                  className="py-3.5 flex items-center justify-between gap-3 text-xs hover:bg-[#FAF7EE]/50 -mx-2 px-3 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${ord._id}`}
                        className="font-semibold hover:underline font-mono text-xs flex items-center gap-1 text-[#0C134F] hover:text-[#590B16]"
                      >
                        {ord.orderNumber}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </Link>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {formatDate(ord.createdAt)}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-bold font-mono text-[#0C134F] block">
                      {formatCurrency(ord.totalAmount, ord.currency || "USD")}
                    </span>
                    <StatusBadge status={ord.orderStatus} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">No order history available.</p>
              <p className="text-[11px] text-slate-400">
                This customer has not placed any orders yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

