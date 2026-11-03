"use client";

import React, { useEffect, useState, useCallback } from "react";
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

export default function AdminSettingsPage() {
  const { hasPermission } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await adminService.updateSettings(payload);
      setSuccessMessage("Settings saved successfully. All changes are active on the storefront.");
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
    <div className="space-y-6 font-sans max-w-5xl">
      <AdminPageHeader
        category="CONFIGURATION"
        title="Storefront Settings"
        description="Manage store identity, concierge contact details, nationwide shipping rules, and checkout payment methods."
        breadcrumbs={[{ label: "Settings" }]}
        actions={
          !canEdit ? (
            <span className="text-xs px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-semibold rounded-full">
              Read-Only (Superadmin Required)
            </span>
          ) : undefined
        }
      />

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium rounded-xl flex items-center gap-2">
          <Icons.AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-status-success/10 border border-status-success/20 text-status-success text-xs font-medium rounded-xl flex items-center gap-2">
          <Icons.Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Store Identity & Concierge Details */}
        <Card className="bg-white rounded-2xl border border-[#E6E2EA] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-[#EFECE6] pb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] text-[#0C134F] flex items-center justify-center border border-[#EFECE6]">
              <Icons.Package className="w-4.5 h-4.5 text-[#0C134F]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F]">
                Store Profile & Brand Contacts
              </h3>
              <p className="text-[12px] text-[#64748B]">
                Public brand identity and concierge support information shown on footer and contact pages
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Store / Brand Name"
              placeholder="Soulmate Scents"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Brand Tagline / Slogan"
              placeholder="Artisanal Fragrance House & Haute Parfumerie"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Concierge Support Email"
              type="email"
              placeholder="soulmatescents@gmail.com"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="WhatsApp / Support Phone"
              placeholder="+92 333 7615355"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Flagship Physical Studio / City"
              placeholder="Karachi, Pakistan"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Official Instagram Link"
              placeholder="https://instagram.com/soulmatescents"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              disabled={!canEdit}
            />
          </div>
        </Card>

        {/* 2. Shipping & Delivery Rates (PKR) */}
        <Card className="bg-white rounded-2xl border border-[#E6E2EA] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-[#EFECE6] pb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] text-[#0C134F] flex items-center justify-center border border-[#EFECE6]">
              <Icons.Truck className="w-4.5 h-4.5 text-[#0C134F]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F]">
                Nationwide Delivery & Shipping Rules (PKR)
              </h3>
              <p className="text-[12px] text-[#64748B]">
                Configure flat courier charges and free delivery threshold for orders across Pakistan
              </p>
            </div>
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
            />
            <Input
              label="Standard Nationwide Delivery Fee (Rs.)"
              type="number"
              placeholder="250"
              value={flatRateFee}
              onChange={(e) => setFlatRateFee(e.target.value)}
              helperText="Flat courier fee charged for orders below the free shipping minimum."
              disabled={!canEdit}
            />
          </div>

          <div className="p-3.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl flex items-center gap-3 text-xs text-[#52525B]">
            <Icons.Sparkles className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>
              <strong>Smart Checkout Automation:</strong> Customers ordering Rs. {Number(freeShippingThreshold || 0).toLocaleString()} or more automatically receive <strong>Free Delivery</strong>.
            </span>
          </div>
        </Card>

        {/* 3. Payment Methods: COD & Bank Wire Transfer */}
        <Card className="bg-white rounded-2xl border border-[#E6E2EA] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-[#EFECE6] pb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] text-[#0C134F] flex items-center justify-center border border-[#EFECE6]">
              <Icons.ShieldCheck className="w-4.5 h-4.5 text-[#0C134F]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F]">
                Payment Methods & Checkout Configuration
              </h3>
              <p className="text-[12px] text-[#64748B]">
                Enable payment methods and customize bank deposit instructions shown to customers
              </p>
            </div>
          </div>

          {/* Method A: Cash on Delivery */}
          <div className="p-4 rounded-xl border border-[#EFECE6] bg-[#FAF8F5]/50 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#0B1938] uppercase tracking-wider block">
                Cash on Delivery (COD)
              </span>
              <p className="text-[11px] text-[#64748B]">
                Permit customers to settle order payment in cash upon courier doorstep delivery
              </p>
            </div>
            <Checkbox
              label="Active"
              checked={codEnabled}
              onChange={(e) => setCodEnabled(e.target.checked)}
              disabled={!canEdit}
            />
          </div>

          {/* Method B: Direct Bank Wire Transfer */}
          <div className="p-4 rounded-xl border border-[#EFECE6] bg-[#FAF8F5]/50 space-y-4">
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#EFECE6]">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#0B1938] uppercase tracking-wider block">
                  Direct Bank Wire Transfer / Mobile Banking
                </span>
                <p className="text-[11px] text-[#64748B]">
                  Display official banking details at checkout for direct IBFT / mobile transfer
                </p>
              </div>
              <Checkbox
                label="Active"
                checked={bankTransferEnabled}
                onChange={(e) => setBankTransferEnabled(e.target.checked)}
                disabled={!canEdit}
              />
            </div>

            {bankTransferEnabled && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Bank Name"
                    placeholder="e.g. Meezan Bank / HBL / Bank Alfalah"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    disabled={!canEdit}
                  />
                  <Input
                    label="Account Title / Beneficiary"
                    placeholder="e.g. Soulmate Scents"
                    value={accountTitle}
                    onChange={(e) => setAccountTitle(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Account Number"
                    placeholder="e.g. 02010101234567"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    disabled={!canEdit}
                  />
                  <Input
                    label="IBAN / Swift Code"
                    placeholder="e.g. PK36MEZN0000000000000000"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    disabled={!canEdit}
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

        {/* Submit Actions */}
        {canEdit && (
          <div className="flex flex-col sm:flex-row justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
              className="w-full sm:w-auto bg-[#0C134F] hover:bg-[#121A4B] text-white rounded-xl px-9 py-3.5 text-xs font-bold tracking-[0.18em] uppercase shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Save Storefront Settings
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
