"use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/services/adminService";
import { AdminSettings } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/components/ui/icons";

export default function AdminSettingsPage() {
  const { hasPermission } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Store Identity
  const [storeName, setStoreName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [address, setAddress] = useState("");

  // Currency
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [currencySymbol, setCurrencySymbol] = useState("$");

  // Shipping
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<string>("150");
  const [flatRateFee, setFlatRateFee] = useState<string>("15");
  const [defaultCarrier, setDefaultCarrier] = useState("DHL Express");

  // Tax
  const [enableTax, setEnableTax] = useState(false);
  const [defaultTaxPercentage, setDefaultTaxPercentage] = useState<string>("0");
  const [taxIncludedInPrice, setTaxIncludedInPrice] = useState(false);

  // Payment Methods: COD & Bank Transfer
  const [codEnabled, setCodEnabled] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);
  const [bankName, setBankName] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [bankInstructions, setBankInstructions] = useState("");

  // Social Links
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getSettings();

      if (data.store) {
        setStoreName(data.store.name || "Maison de Parfum");
        setSlogan(data.store.slogan || "");
        setSupportEmail(data.store.supportEmail || "");
        setSupportPhone(data.store.supportPhone || "");
        setAddress(data.store.address || "");
      }
      if (data.currency) {
        setCurrencyCode(data.currency.code || "USD");
        setCurrencySymbol(data.currency.symbol || "$");
      }
      if (data.shipping) {
        setFreeShippingThreshold(String(data.shipping.freeShippingThreshold ?? 150));
        setFlatRateFee(String(data.shipping.flatRateFee ?? 15));
        setDefaultCarrier(data.shipping.defaultCarrier || "DHL Express");
      }
      if (data.tax) {
        setEnableTax(Boolean(data.tax.enableTax));
        setDefaultTaxPercentage(String(data.tax.defaultTaxPercentage ?? 0));
        setTaxIncludedInPrice(Boolean(data.tax.taxIncludedInPrice));
      }
      if (data.payment) {
        if (data.payment.cod) {
          setCodEnabled(Boolean(data.payment.cod.enabled));
        }
        if (data.payment.bankTransfer) {
          setBankTransferEnabled(Boolean(data.payment.bankTransfer.enabled));
          setBankName(data.payment.bankTransfer.bankName || "");
          setAccountTitle(data.payment.bankTransfer.accountTitle || "");
          setAccountNumber(data.payment.bankTransfer.accountNumber || "");
          setIban(data.payment.bankTransfer.iban || "");
          setBankInstructions(data.payment.bankTransfer.instructions || "");
        }
      }
      if (data.socialLinks) {
        setInstagram(data.socialLinks.instagram || "");
        setFacebook(data.socialLinks.facebook || "");
        setTwitter(data.socialLinks.twitter || "");
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
        name: storeName.trim() || undefined,
        slogan: slogan.trim() || undefined,
        supportEmail: supportEmail.trim() || undefined,
        supportPhone: supportPhone.trim() || undefined,
        address: address.trim() || undefined,
      },
      currency: {
        code: currencyCode.trim().toUpperCase() || "USD",
        symbol: currencySymbol.trim() || "$",
      },
      shipping: {
        freeShippingThreshold: freeShippingThreshold ? Number(freeShippingThreshold) : 0,
        flatRateFee: flatRateFee ? Number(flatRateFee) : 0,
        defaultCarrier: defaultCarrier.trim() || undefined,
      },
      tax: {
        enableTax,
        defaultTaxPercentage: defaultTaxPercentage ? Number(defaultTaxPercentage) : 0,
        taxIncludedInPrice,
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
        facebook: facebook.trim() || undefined,
        twitter: twitter.trim() || undefined,
      },
    };

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      await adminService.updateSettings(payload);
      setSuccessMessage("Storefront configuration saved successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center font-sans">
        <Spinner size="lg" className="mx-auto mb-3 text-foreground-muted" />
        <p className="text-xs text-foreground-muted uppercase tracking-wider">Loading Configuration...</p>
      </div>
    );
  }

  const canEdit = hasPermission("settings.update");

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-medium block">
            System & Operations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
            Storefront Settings
          </h1>
        </div>

        {!canEdit && (
          <span className="text-xs px-2.5 py-1 bg-status-warning/10 border border-status-warning/20 text-status-warning font-medium">
            Read-Only (Superadmin required to modify)
          </span>
        )}
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Store Identity */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <Icons.Package size={16} className="text-foreground-muted" />
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground">
              Store Profile & Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Tagline / Slogan"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Support Email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Support Phone"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <Input
            label="Flagship Physical Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={!canEdit}
          />
        </div>

        {/* 2. Bank Transfer Payment Configuration */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <Icons.ShieldCheck size={16} className="text-foreground-muted" />
              <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground">
                Bank Transfer & Manual Checkout Configuration
              </h3>
            </div>
            <Checkbox
              label="Enable Bank Transfer at Checkout"
              checked={bankTransferEnabled}
              onChange={(e) => setBankTransferEnabled(e.target.checked)}
              disabled={!canEdit}
            />
          </div>

          <p className="text-xs text-foreground-muted">
            These banking credentials are displayed to customers on the Bank Transfer confirmation screen and checkout review.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bank Name"
              placeholder="e.g. Banque Privée de France"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Account Title / Beneficiary"
              placeholder="e.g. Maison de Parfum SARL"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Account Number"
              placeholder="1234567890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="IBAN / Swift Code"
              placeholder="FR76 3000 4000 5000 6000 7000 800"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <Textarea
            label="Payment Instructions for Customers"
            placeholder="Please quote your Order Reference # when making wire transfer. Upload proof upon completion."
            value={bankInstructions}
            onChange={(e) => setBankInstructions(e.target.value)}
            disabled={!canEdit}
            rows={3}
          />
        </div>

        {/* 3. Cash on Delivery */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <Icons.Delivery size={16} className="text-foreground-muted" />
              <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground">
                Cash on Delivery (COD)
              </h3>
            </div>
            <Checkbox
              label="Enable COD at Checkout"
              checked={codEnabled}
              onChange={(e) => setCodEnabled(e.target.checked)}
              disabled={!canEdit}
            />
          </div>
          <p className="text-xs text-foreground-muted">
            Allow customers to pay in cash upon courier delivery.
          </p>
        </div>

        {/* 4. Shipping & Rates */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <Icons.Delivery size={16} className="text-foreground-muted" />
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground">
              Shipping Rates & Carriers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Free Shipping Minimum ($)"
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Flat Rate Shipping Fee ($)"
              type="number"
              value={flatRateFee}
              onChange={(e) => setFlatRateFee(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Default Carrier"
              value={defaultCarrier}
              onChange={(e) => setDefaultCarrier(e.target.value)}
              disabled={!canEdit}
            />
          </div>
        </div>

        {/* 5. Tax Configuration */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <Icons.Dollar size={16} className="text-foreground-muted" />
              <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground">
                Tax Calculation
              </h3>
            </div>
            <Checkbox
              label="Enable Tax Calculation"
              checked={enableTax}
              onChange={(e) => setEnableTax(e.target.checked)}
              disabled={!canEdit}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Default Tax Rate (%)"
              type="number"
              step="0.1"
              value={defaultTaxPercentage}
              onChange={(e) => setDefaultTaxPercentage(e.target.value)}
              disabled={!canEdit || !enableTax}
            />
            <div className="flex items-center pt-6">
              <Checkbox
                label="Prices Already Include Tax"
                checked={taxIncludedInPrice}
                onChange={(e) => setTaxIncludedInPrice(e.target.checked)}
                disabled={!canEdit || !enableTax}
              />
            </div>
          </div>
        </div>

        {/* 6. Social Links */}
        <div className="border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <Icons.ExternalLink size={16} className="text-foreground-muted" />
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground">
              Social Media Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Instagram URL"
              placeholder="https://instagram.com/..."
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Facebook URL"
              placeholder="https://facebook.com/..."
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Twitter / X URL"
              placeholder="https://x.com/..."
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              disabled={!canEdit}
            />
          </div>
        </div>

        {/* Submit Actions */}
        {canEdit && (
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
            >
              Save Storefront Settings
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
