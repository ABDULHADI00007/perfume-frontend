"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "@/features/admin/services/adminService";
import { AdminSettings } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminDetailSkeleton } from "@/components/admin/AdminDetailSkeleton";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { hasPermission } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Store Identity & Concierge Contacts
  const [storeName, setStoreName] = useState("Soulmate Scents");
  const [slogan, setSlogan] = useState("Artisanal Fragrance House & Haute Parfumerie");
  const [supportEmail, setSupportEmail] = useState("soulmatescents@gmail.com");
  const [supportPhone, setSupportPhone] = useState("+92 333 7615355");
  const [address, setAddress] = useState("Karachi, Pakistan");
  const [instagram, setInstagram] = useState("https://instagram.com/soulmatescents");

  // 2. Shipping & Delivery Rates (PKR)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<string>("20000");
  const [flatRateFee, setFlatRateFee] = useState<string>("250");

  // 3. Payment Methods: COD & Bank Transfer
  const [codEnabled, setCodEnabled] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);
  const [bankName, setBankName] = useState("Meezan Bank");
  const [accountTitle, setAccountTitle] = useState("Soulmate Scents");
  const [accountNumber, setAccountNumber] = useState("02010101234567");
  const [iban, setIban] = useState("PK36MEZN0000000000000000");
  const [bankInstructions, setBankInstructions] = useState(
    "Please transfer the exact amount via your mobile banking app or ATM and quote your Order Reference # in the remarks. Upload transfer screenshot confirmation upon checkout."
  );

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getSettings();

      if (data.store) {
        setStoreName(data.store.name || "Soulmate Scents");
        setSlogan(data.store.slogan || "Artisanal Fragrance House & Haute Parfumerie");
        setSupportEmail(data.store.supportEmail || "soulmatescents@gmail.com");
        setSupportPhone(data.store.supportPhone || "+92 333 7615355");
        setAddress(data.store.address || "Karachi, Pakistan");
      }
      if (data.shipping) {
        setFreeShippingThreshold(String(data.shipping.freeShippingThreshold ?? 20000));
        setFlatRateFee(String(data.shipping.flatRateFee ?? 250));
      }
      if (data.payment) {
        if (data.payment.cod) {
          setCodEnabled(data.payment.cod.enabled !== false);
        }
        if (data.payment.bankTransfer) {
          setBankTransferEnabled(data.payment.bankTransfer.enabled !== false);
          setBankName(data.payment.bankTransfer.bankName || "Meezan Bank");
          setAccountTitle(data.payment.bankTransfer.accountTitle || "Soulmate Scents");
          setAccountNumber(data.payment.bankTransfer.accountNumber || "02010101234567");
          setIban(data.payment.bankTransfer.iban || "PK36MEZN0000000000000000");
          setBankInstructions(
            data.payment.bankTransfer.instructions ||
              "Please transfer the exact amount via your mobile banking app or ATM and quote your Order Reference # in the remarks. Upload transfer screenshot confirmation upon checkout."
          );
        }
      }
      if (data.socialLinks?.instagram) {
        setInstagram(data.socialLinks.instagram);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load store settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasPermission("settings.read") || hasPermission("settings.update")) {
      loadSettings();
    }
  }, [loadSettings, hasPermission]);

  if (!hasPermission("settings.read") && !hasPermission("settings.update")) {
    return <AdminAccessDenied requiredPermission="settings.read" />;
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!hasPermission("settings.update")) {
      setError("Permission denied: Updating settings requires superadmin privileges.");
      return;
    }

    const payload: Partial<AdminSettings> = {
      store: {
        name: storeName.trim() || "Soulmate Scents",
        slogan: slogan.trim() || undefined,
        supportEmail: supportEmail.trim() || undefined,
        supportPhone: supportPhone.trim() || undefined,
        address: address.trim() || undefined,
      },
      currency: {
        code: "PKR",
        symbol: "Rs.",
        format: "Rs. {amount}",
      },
      shipping: {
        freeShippingThreshold: freeShippingThreshold ? Number(freeShippingThreshold) : 20000,
        flatRateFee: flatRateFee ? Number(flatRateFee) : 250,
        defaultCarrier: "Express Courier Logistics (Nationwide)",
      },
      tax: {
        enableTax: false,
        defaultTaxPercentage: 0,
        taxIncludedInPrice: true,
      },
      payment: {
        cod: {
          enabled: codEnabled,
        },
        bankTransfer: {
          enabled: bankTransferEnabled,
          bankName: bankName.trim() || undefined,
          accountTitle: accountTitle.trim() || undefined,
          accountNumber: accountNumber.trim() || undefined,
          iban: iban.trim() || undefined,
          instructions: bankInstructions.trim() || undefined,
        },
      },
      socialLinks: {
        instagram: instagram.trim() || undefined,
      },
    };

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      setJustSaved(false);
      await adminService.updateSettings(payload);
      setSuccessMessage("Storefront settings updated successfully. All changes are active on the storefront.");
      setJustSaved(true);
      setTimeout(() => {
        setJustSaved(false);
      }, 4000);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AdminDetailSkeleton category="CONFIGURATION" hasSidebar={false} />;
  }

  const canEdit = hasPermission("settings.update");

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-sans relative">
      {/* Floating Viewport Toast for Immediate Visibility */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-20 right-4 sm:right-8 z-[99999] max-w-md bg-white border border-emerald-500/40 text-stone-900 shadow-[0_16px_40px_rgba(0,0,0,0.18)] rounded-2xl p-4 flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <Icons.Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 pr-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Settings Updated Successfully
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                {successMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <Icons.Close size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header with Breadcrumb and Desktop Action Button */}
      <AdminPageHeader
        category="CONFIGURATION"
        title="Storefront Settings"
        description="Manage store identity, concierge contact details, nationwide shipping rules, and checkout payment methods."
        breadcrumbs={[{ label: "Settings" }]}
        actions={
          <div className="flex items-center gap-3">
            {!canEdit ? (
              <span className="text-xs px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 font-semibold rounded-xl">
                Read-Only (Superadmin Required)
              </span>
            ) : (
              <Button
                type="button"
                onClick={() => handleSave()}
                isLoading={isSaving}
                className={cn(
                  "hidden sm:flex rounded-xl px-5 h-9 text-xs font-bold tracking-wider uppercase shadow-2xs transition-all cursor-pointer items-center gap-2",
                  justSaved
                    ? "!bg-emerald-600 hover:!bg-emerald-700 !text-white shadow-emerald-600/25"
                    : "bg-[#0C134F] hover:bg-[#121A4B] text-white"
                )}
              >
                {justSaved ? (
                  <>
                    <Icons.Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Icons.Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            )}
          </div>
        }
      />

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Icons.AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-status-error hover:opacity-75 text-xs font-bold px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Desktop 12-Column Balanced Layout */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Settings Column (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Store Identity & Concierge Details */}
          <Card
            id="brand-profile"
            className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs space-y-6 transition-all hover:border-slate-300/80"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#0C134F] flex items-center justify-center border border-[#EFECE6] shrink-0 shadow-2xs">
                  <Icons.Package className="w-5 h-5 text-[#0C134F]" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F]">
                    Store Profile & Brand Contacts
                  </h3>
                  <p className="text-[12px] text-[#64748B] mt-0.5">
                    Public brand identity and concierge support information shown on footer and contact touchpoints
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                Identity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Store / Brand Name"
                placeholder="Soulmate Scents"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                disabled={!canEdit}
                leftIcon={<Icons.Package size={14} className="text-slate-400" />}
              />
              <Input
                label="Brand Tagline / Slogan"
                placeholder="Artisanal Fragrance House & Haute Parfumerie"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                disabled={!canEdit}
                leftIcon={<Icons.Sparkles size={14} className="text-[#C5A880]" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Concierge Support Email"
                type="email"
                placeholder="soulmatescents@gmail.com"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                disabled={!canEdit}
                leftIcon={<Icons.Mail size={14} className="text-slate-400" />}
              />
              <Input
                label="WhatsApp / Support Phone"
                placeholder="+92 333 7615355"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                disabled={!canEdit}
                leftIcon={<Icons.Phone size={14} className="text-slate-400" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Flagship Physical Studio / City"
                placeholder="Karachi, Pakistan"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!canEdit}
                leftIcon={<Icons.MapPin size={14} className="text-slate-400" />}
              />
              <Input
                label="Official Instagram Link"
                placeholder="https://instagram.com/soulmatescents"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                disabled={!canEdit}
                leftIcon={<Icons.ExternalLink size={14} className="text-slate-400" />}
              />
            </div>

            <div className="p-3.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl flex items-center gap-3 text-xs text-[#52525B]">
              <Icons.Info className="w-4 h-4 text-[#0C134F] shrink-0" />
              <span>
                These verified details are automatically displayed in the storefront navigation drawer, footer concierge bar, and automated order receipts.
              </span>
            </div>
          </Card>

          {/* 2. Shipping & Delivery Rates (PKR) */}
          <Card
            id="shipping-rules"
            className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs space-y-6 transition-all hover:border-slate-300/80"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#0C134F] flex items-center justify-center border border-[#EFECE6] shrink-0 shadow-2xs">
                  <Icons.Truck className="w-5 h-5 text-[#0C134F]" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F]">
                    Nationwide Delivery & Shipping Rules (PKR)
                  </h3>
                  <p className="text-[12px] text-[#64748B] mt-0.5">
                    Configure flat courier charges and free delivery threshold for orders across Pakistan
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                PKR Logistics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Free Delivery Order Minimum (Rs.)"
                type="number"
                placeholder="20000"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                helperText="Orders equal to or above this cart value receive 100% complimentary delivery."
                disabled={!canEdit}
                leftIcon={<span className="text-[11px] font-bold font-mono text-slate-500">Rs.</span>}
              />
              <Input
                label="Standard Nationwide Delivery Fee (Rs.)"
                type="number"
                placeholder="250"
                value={flatRateFee}
                onChange={(e) => setFlatRateFee(e.target.value)}
                helperText="Flat courier fee charged for orders below the free shipping minimum."
                disabled={!canEdit}
                leftIcon={<span className="text-[11px] font-bold font-mono text-slate-500">Rs.</span>}
              />
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl flex items-start gap-3.5 text-xs text-[#52525B]">
              <Icons.Sparkles className="w-4.5 h-4.5 text-[#C5A880] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-[#0C134F]">Smart Automated Checkout Policy:</p>
                <p className="leading-relaxed text-slate-600">
                  Customers ordering <strong className="text-[#0C134F]">Rs. {Number(freeShippingThreshold || 0).toLocaleString()}</strong> or more automatically receive <strong className="text-emerald-700 font-semibold">Free Delivery</strong> nationwide. Orders below incur the standard flat rate of <strong className="text-[#0C134F]">Rs. {Number(flatRateFee || 0).toLocaleString()}</strong>.
                </p>
              </div>
            </div>
          </Card>

          {/* 3. Payment Methods: COD & Bank Wire Transfer */}
          <Card
            id="payment-gateways"
            className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs space-y-6 transition-all hover:border-slate-300/80"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#0C134F] flex items-center justify-center border border-[#EFECE6] shrink-0 shadow-2xs">
                  <Icons.ShieldCheck className="w-5 h-5 text-[#0C134F]" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F]">
                    Payment Methods & Checkout Configuration
                  </h3>
                  <p className="text-[12px] text-[#64748B] mt-0.5">
                    Enable payment methods and customize bank deposit instructions shown to customers
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                Gateways
              </span>
            </div>

            {/* Method A: Cash on Delivery */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-[#0B1938] uppercase tracking-wider">
                    Cash on Delivery (COD)
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                      codEnabled
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    )}
                  >
                    {codEnabled ? "ACTIVE" : "DISABLED"}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#64748B]">
                  Permit customers to settle order payment in cash upon courier doorstep delivery across Pakistan
                </p>
              </div>
              <Checkbox
                label="Enable COD"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                disabled={!canEdit}
              />
            </div>

            {/* Method B: Direct Bank Wire Transfer */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-[#0B1938] uppercase tracking-wider">
                      Direct Bank Wire Transfer / IBFT
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                        bankTransferEnabled
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      )}
                    >
                      {bankTransferEnabled ? "ACTIVE" : "DISABLED"}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#64748B]">
                    Display official banking details at checkout for direct IBFT / mobile banking transfer with receipt upload
                  </p>
                </div>
                <Checkbox
                  label="Enable Bank Wire"
                  checked={bankTransferEnabled}
                  onChange={(e) => setBankTransferEnabled(e.target.checked)}
                  disabled={!canEdit}
                />
              </div>

              {bankTransferEnabled && (
                <div className="space-y-5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Bank Name"
                      placeholder="e.g. Meezan Bank / HBL / Bank Alfalah"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      disabled={!canEdit}
                      leftIcon={<Icons.Bank size={14} className="text-slate-400" />}
                    />
                    <Input
                      label="Account Title / Beneficiary"
                      placeholder="e.g. Soulmate Scents"
                      value={accountTitle}
                      onChange={(e) => setAccountTitle(e.target.value)}
                      disabled={!canEdit}
                      leftIcon={<Icons.User size={14} className="text-slate-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Account Number"
                      placeholder="e.g. 02010101234567"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      disabled={!canEdit}
                      leftIcon={<Icons.Cash size={14} className="text-slate-400" />}
                    />
                    <Input
                      label="IBAN / Swift Code"
                      placeholder="e.g. PK36MEZN0000000000000000"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      disabled={!canEdit}
                      leftIcon={<Icons.Lock size={14} className="text-slate-400" />}
                    />
                  </div>

                  <Textarea
                    label="Customer Payment Instructions (shown on checkout confirmation)"
                    placeholder="Please transfer the exact amount via your mobile banking app or ATM and quote your Order Reference # in the remarks. Upload transfer screenshot confirmation upon checkout."
                    value={bankInstructions}
                    onChange={(e) => setBankInstructions(e.target.value)}
                    disabled={!canEdit}
                    rows={3}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Bottom Save Action Bar for Mobile & Tablet view */}
          {canEdit && (
            <div className="flex lg:hidden flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {justSaved && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs"
                    >
                      <Icons.Check className="w-4 h-4 stroke-[2.5] text-emerald-600" />
                      <span>Settings published live!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSaving}
                className={cn(
                  "w-full sm:w-auto rounded-xl px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2",
                  justSaved
                    ? "!bg-emerald-600 hover:!bg-emerald-700 !text-white shadow-emerald-600/25"
                    : "bg-[#0C134F] hover:bg-[#121A4B] text-white"
                )}
              >
                {justSaved ? (
                  <>
                    <Icons.Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Settings Saved!</span>
                  </>
                ) : isSaving ? (
                  <span>Saving Settings...</span>
                ) : (
                  <span>Save Storefront Settings</span>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          {/* Card A: Publish & Action Hub */}
          <Card className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#0C134F]">
                  Publish Status
                </h4>
              </div>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                LIVE
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Modifications saved here reflect immediately across the customer catalog, checkout flow, and concierge channels.
            </p>

            {canEdit ? (
              <div className="space-y-3 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSaving}
                  className={cn(
                    "w-full rounded-xl py-3 text-xs font-bold tracking-[0.16em] uppercase shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2",
                    justSaved
                      ? "!bg-emerald-600 hover:!bg-emerald-700 !text-white shadow-emerald-600/25"
                      : "bg-[#0C134F] hover:bg-[#121A4B] text-white"
                  )}
                >
                  {justSaved ? (
                    <>
                      <Icons.Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Settings Saved!</span>
                    </>
                  ) : isSaving ? (
                    <span>Saving Settings...</span>
                  ) : (
                    <>
                      <Icons.Check className="w-3.5 h-3.5" />
                      <span>Save Settings</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadSettings()}
                  disabled={isSaving}
                  className="w-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200 rounded-xl h-9 text-xs font-semibold shadow-2xs transition-all gap-1.5 justify-center cursor-pointer"
                >
                  <Icons.Returns className="w-3.5 h-3.5 text-slate-400" />
                  <span>Discard & Reload</span>
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                You currently have read-only view. Elevated superadmin role required to commit modifications.
              </div>
            )}
          </Card>

          {/* Card B: Live Storefront Snapshot */}
          <Card className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#0C134F]">
                Storefront Summary
              </h4>
              <span className="text-[11px] font-mono font-semibold text-slate-400">
                PKR
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Brand Name:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                  {storeName || "Soulmate Scents"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Free Shipping Min:</span>
                <span className="font-mono font-semibold text-emerald-700">
                  Rs. {Number(freeShippingThreshold || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Flat Courier Fee:</span>
                <span className="font-mono font-semibold text-slate-800">
                  Rs. {Number(flatRateFee || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Active Gateways:</span>
                <div className="flex items-center gap-1">
                  {codEnabled && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold">
                      COD
                    </span>
                  )}
                  {bankTransferEnabled && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[10px] font-bold">
                      Bank Wire
                    </span>
                  )}
                  {!codEnabled && !bankTransferEnabled && (
                    <span className="text-rose-600 font-mono text-[10px]">None</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Concierge WhatsApp:</span>
                <span className="font-mono text-slate-700 text-[11px] truncate max-w-[150px]">
                  {supportPhone}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#EFECE6] text-xs font-semibold text-[#0C134F] transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Icons.ExternalLink className="w-3.5 h-3.5 text-[#0C134F]" />
                  <span>Preview Live Storefront</span>
                </div>
                <Icons.ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>

          {/* Card C: Quick Section Navigation */}
          <Card className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              Quick Navigation
            </h4>
            <div className="space-y-1.5 text-xs">
              <a
                href="#brand-profile"
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#0C134F] hover:bg-slate-50 transition-colors"
              >
                <span>Store Profile & Brand Contacts</span>
                <Icons.ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="#shipping-rules"
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#0C134F] hover:bg-slate-50 transition-colors"
              >
                <span>Nationwide Shipping Rules</span>
                <Icons.ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="#payment-gateways"
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#0C134F] hover:bg-slate-50 transition-colors"
              >
                <span>Payment Gateways & Wire Details</span>
                <Icons.ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
