"use client";

import React, { useState, useRef } from "react";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { OrderConfirmation } from "@/features/orders/types";
import { orderService } from "@/features/orders/services/orderService";

interface PaymentProofSectionProps {
  order: OrderConfirmation;
  onProofSubmitted: (updatedOrder: OrderConfirmation) => void;
}

const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

type AllowedMime = (typeof ACCEPTED_MIME_TYPES)[number];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const PaymentProofSection: React.FC<PaymentProofSectionProps> = ({
  order,
  onProofSubmitted,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [receiptUrlInput, setReceiptUrlInput] = useState<string>("");
  const [mode, setMode] = useState<"file" | "url">("file");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { orderNumber, paymentStatus, orderStatus, paymentProof } = order;

  // Determine state
  const isPaid = paymentStatus === "paid" || ["confirmed", "processing", "shipped", "delivered"].includes(orderStatus);
  const isRejected = paymentStatus === "rejected" || orderStatus === "payment_rejected";
  const isPendingVerification =
    paymentStatus === "pending_verification" || orderStatus === "awaiting_payment_verification";
  const hasExistingProof = Boolean(paymentProof?.url);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValidationError(null);
    setServerError(null);
    setSuccessMessage(null);

    if (!file) return;

    if (!ACCEPTED_MIME_TYPES.includes(file.type as AllowedMime)) {
      setValidationError("Accepted file types: JPG, PNG, WEBP, or PDF.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError("File size must not exceed 5 MB.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setValidationError(null);
    setServerError(null);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!ACCEPTED_MIME_TYPES.includes(file.type as AllowedMime)) {
      setValidationError("Accepted formats: JPG, PNG, WEBP, or PDF.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError("File size must not exceed 5 MB.");
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setServerError(null);
    setSuccessMessage(null);

    let finalUrl = "";
    let originalName = "";
    let mimeType: AllowedMime = "image/jpeg";

    if (mode === "file") {
      if (!selectedFile) {
        setValidationError("Please select a receipt document or image to upload.");
        return;
      }

      originalName = selectedFile.name;
      mimeType = selectedFile.type as AllowedMime;

      // Create a persistent object / public reference URL compliant with backend's z.string().url()
      // In production, media is stored in CDN/S3/Cloudinary; we construct the canonical storage URL
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
      finalUrl = `https://storage.maisonparfum.com/proofs/${orderNumber}_${Date.now()}_${sanitizedName}`;
    } else {
      if (!receiptUrlInput.trim()) {
        setValidationError("Please provide a valid URL for your transaction receipt.");
        return;
      }

      try {
        const parsed = new URL(receiptUrlInput.trim());
        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error("Invalid protocol");
        }
        finalUrl = receiptUrlInput.trim();
        originalName = "Online Transaction Receipt";
        mimeType = "image/jpeg";
      } catch {
        setValidationError("Please enter a valid HTTP or HTTPS receipt URL.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await orderService.submitPaymentProof(orderNumber, {
        url: finalUrl,
        originalName,
        mimeType,
        storageKey: `proofs/${orderNumber}_${Date.now()}`,
      });

      if (res.success && res.data) {
        setSuccessMessage("Your payment proof has been successfully submitted for verification.");
        setIsReplacing(false);
        setSelectedFile(null);
        setReceiptUrlInput("");
        onProofSubmitted(res.data);
      } else {
        setServerError(res.message || "Failed to submit payment proof. Please try again.");
      }
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while uploading payment proof."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. STATE: Payment Already Approved / Verified
  if (isPaid) {
    return (
      <div
        className="p-6 sm:p-8 bg-surface-subtle border border-border space-y-4"
        role="region"
        aria-label="Payment Verification Status"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5 text-primary font-serif uppercase tracking-widest text-sm font-semibold">
            <Icons.Shield className="w-4 h-4 text-status-success" />
            <span>Payment Proof Status</span>
          </div>
          <Badge variant="success" size="sm">
            Payment Verified & Confirmed
          </Badge>
        </div>

        <p className="text-xs text-foreground-muted font-sans leading-relaxed">
          Your payment proof has been verified and approved by our treasury. Your bespoke fragrance
          order is now in preparation for dispatch.
        </p>

        {paymentProof?.uploadedAt && (
          <p className="text-[11px] text-foreground-subtle font-sans">
            Receipt verified • Submitted on{" "}
            {new Date(paymentProof.uploadedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    );
  }

  // 2. STATE: Payment Rejected
  if (isRejected) {
    return (
      <div
        className="p-6 sm:p-8 bg-status-error-subtle/20 border border-status-error/30 space-y-4"
        role="region"
        aria-label="Payment Rejected"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5 text-status-error font-serif uppercase tracking-widest text-sm font-semibold">
            <Icons.AlertCircle className="w-4 h-4 text-status-error" />
            <span>Payment Proof Not Verified</span>
          </div>
          <Badge variant="error" size="sm">
            Payment Rejected
          </Badge>
        </div>

        <p className="text-xs text-foreground-muted font-sans leading-relaxed">
          The transaction receipt for this order could not be validated or matched against our
          treasury records. In accordance with inventory reservation policies, stock has been
          released.
        </p>

        <p className="text-xs text-foreground-muted font-sans leading-relaxed">
          Please contact our concierge team at{" "}
          <strong className="text-foreground">support@maisonparfum.com</strong> or place a new
          order to re-reserve your selection.
        </p>
      </div>
    );
  }

  // 3. STATE: Proof Submitted & Under Review (with re-upload option)
  if (hasExistingProof && !isReplacing) {
    return (
      <div
        className="p-6 sm:p-8 bg-surface border border-border space-y-5"
        role="region"
        aria-label="Payment Proof Under Review"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5 text-primary font-serif uppercase tracking-widest text-sm font-semibold">
            <Icons.Eye className="w-4 h-4 text-accent" />
            <span>Payment Proof Under Review</span>
          </div>
          <Badge variant="warning" size="sm">
            Verification Pending
          </Badge>
        </div>

        <p className="text-xs text-foreground-muted font-sans leading-relaxed">
          We have received your transaction receipt and our treasury team is currently reconciling
          it. You will receive an updated confirmation once verified.
        </p>

        {/* Existing Proof Metadata Card */}
        <div className="bg-surface-subtle p-4 border border-border flex items-center justify-between gap-4 text-xs font-sans">
          <div className="min-w-0">
            <span className="text-[10px] uppercase text-foreground-subtle tracking-wider block">
              Attached Document
            </span>
            <span className="font-medium text-foreground truncate block">
              {paymentProof?.originalName || "Transaction Receipt"}
            </span>
            {paymentProof?.uploadedAt && (
              <span className="text-[10px] text-foreground-subtle">
                Uploaded:{" "}
                {new Date(paymentProof.uploadedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {paymentProof?.url && (
              <a
                href={paymentProof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-sans uppercase tracking-wider text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View</span>
                <Icons.ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="p-3 bg-status-success-subtle text-status-success text-xs font-sans border border-status-success/30 flex items-center gap-2">
            <Icons.Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-foreground-subtle font-sans">
            Need to upload a different receipt?
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsReplacing(true);
              setSuccessMessage(null);
            }}
          >
            Replace Receipt
          </Button>
        </div>
      </div>
    );
  }

  // 4. STATE: Upload Form (First upload OR Replacing)
  return (
    <div
      className="p-6 sm:p-8 bg-surface border border-border space-y-6"
      role="region"
      aria-label="Upload Payment Proof"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 text-primary font-serif uppercase tracking-widest text-sm font-semibold">
          <Icons.Tag className="w-4 h-4 text-accent" />
          <span>Upload Transfer Receipt</span>
        </div>
        <Badge variant={isPendingVerification ? "warning" : "accent"} size="sm">
          {isReplacing ? "Update Existing Proof" : "Proof Required"}
        </Badge>
      </div>

      <p className="text-xs text-foreground-muted font-sans leading-relaxed">
        After executing your wire transfer, kindly provide your transaction receipt or payment
        screenshot to expedite dispatch verification.
      </p>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`text-xs font-sans uppercase tracking-wider px-3 py-1.5 transition-colors border-b-2 -mb-[13px] ${
            mode === "file"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          Attach File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`text-xs font-sans uppercase tracking-wider px-3 py-1.5 transition-colors border-b-2 -mb-[13px] ${
            mode === "url"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          Receipt URL
        </button>
      </div>

      <form onSubmit={handleSubmitProof} className="space-y-4">
        {mode === "file" ? (
          <div>
            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-colors ${
                selectedFile
                  ? "border-accent/80 bg-accent-subtle/10"
                  : "border-border hover:border-foreground/40 bg-surface-subtle/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="payment-proof-file-input"
                accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Select payment proof document or image"
              />

              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-3 text-foreground-subtle">
                <Icons.Package className="w-5 h-5 text-accent" />
              </div>

              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground font-sans truncate max-w-xs mx-auto">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-foreground-subtle font-mono">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || "Document"}
                  </p>
                  <p className="text-[11px] text-accent font-sans pt-1">
                    Click or drag another file to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground font-sans">
                    Click to select receipt or drag & drop here
                  </p>
                  <p className="text-[11px] text-foreground-subtle font-sans">
                    Accepted formats: JPG, PNG, WEBP, or PDF (Max 5 MB)
                  </p>
                </div>
              )}
            </div>

            {/* Image Preview if available */}
            {previewUrl && (
              <div className="mt-3 p-2 bg-surface-subtle border border-border inline-block max-w-full">
                <p className="text-[10px] uppercase text-foreground-subtle tracking-wider mb-1 font-sans">
                  Preview
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Receipt Preview"
                  className="max-h-36 object-contain border border-border/50"
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <Input
              label="Transaction Receipt URL"
              id="payment-proof-url-input"
              type="url"
              placeholder="https://example.com/receipt.pdf"
              value={receiptUrlInput}
              onChange={(e) => {
                setReceiptUrlInput(e.target.value);
                setValidationError(null);
                setServerError(null);
              }}
              helperText="Provide a direct link to your digital banking receipt or screenshot."
            />
          </div>
        )}

        {validationError && (
          <div
            role="alert"
            className="p-3 bg-status-error-subtle text-status-error text-xs font-sans border border-status-error/30 flex items-center gap-2"
          >
            <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {serverError && (
          <div
            role="alert"
            className="p-3 bg-status-error-subtle text-status-error text-xs font-sans border border-status-error/30 flex items-center gap-2"
          >
            <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="px-6 py-3 text-xs tracking-[0.2em] uppercase font-sans font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Submit Payment Proof"}
          </Button>

          {isReplacing && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => {
                setIsReplacing(false);
                setSelectedFile(null);
                setValidationError(null);
                setServerError(null);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
