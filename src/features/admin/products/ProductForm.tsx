"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "../services/adminService";
import { AdminProduct, AdminCategory } from "../types";
import { FolderImagePickerModal } from "./FolderImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Check,
  Upload,
  FolderOpen,
  Loader2,
  ArrowLeft,
  Flame,
  Star,
  Eye,
  X,
  Layers,
  Plus,
} from "lucide-react";

export interface ProductFormProps {
  initialProduct?: AdminProduct;
  isEdit?: boolean;
}

const GENDER_OPTIONS = [
  { value: "Unisex", label: "Unisex" },
  { value: "Men", label: "Men" },
  { value: "Women", label: "Women" },
];

interface VariantRow {
  size: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  isEdit = false,
}) => {
  const router = useRouter();
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"card" | number>("card");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  // ── 1. COLLECTION CARD STATE ──
  const [name, setName] = useState(initialProduct?.name || "");
  const [category, setCategory] = useState<string>(
    typeof initialProduct?.category === "object" && initialProduct.category !== null
      ? initialProduct.category._id
      : (initialProduct?.category as string) || ""
  );
  const [cardImage, setCardImage] = useState<string>(() => {
    if (!initialProduct?.images || initialProduct.images.length === 0) return "";
    const primary = initialProduct.images.find((img) => img.isPrimary);
    return primary ? primary.url : initialProduct.images[0].url || "";
  });
  const [cardPrice, setCardPrice] = useState<number>(
    initialProduct?.price ? Number(initialProduct.price) : 13500
  );
  const [cardComparePrice, setCardComparePrice] = useState<number | undefined>(
    initialProduct?.compareAtPrice ? Number(initialProduct.compareAtPrice) : 15500
  );
  const [cardStock, setCardStock] = useState<number>(
    initialProduct?.variants?.[0]?.stock !== undefined
      ? initialProduct.variants[0].stock
      : 25
  );
  const [cardSize, setCardSize] = useState<string>(
    initialProduct?.variants?.[0]?.size || "50ml"
  );
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || ""
  );
  const [bestseller, setBestseller] = useState<boolean>(
    initialProduct?.bestseller ?? true
  );
  const [newArrival, setNewArrival] = useState<boolean>(
    initialProduct?.newArrival ?? false
  );
  const [featured, setFeatured] = useState<boolean>(
    initialProduct?.featured ?? true
  );
  const [status, setStatus] = useState<"active" | "draft" | "archived">(
    initialProduct?.status || "active"
  );

  // ── 2. PRODUCT DETAIL PAGE STATE ──
  // 3 to 4 detail gallery pictures
  const [detailImages, setDetailImages] = useState<string[]>(() => {
    if (!initialProduct?.images || initialProduct.images.length === 0) return [];
    return initialProduct.images.map((img) => img.url).filter(Boolean).slice(0, 4);
  });

  // Olfactory Pyramid notes
  const [topNotes, setTopNotes] = useState(
    initialProduct?.fragrance?.topNotes?.join(", ") || ""
  );
  const [heartNotes, setHeartNotes] = useState(
    initialProduct?.fragrance?.heartNotes?.join(", ") || ""
  );
  const [baseNotes, setBaseNotes] = useState(
    initialProduct?.fragrance?.baseNotes?.join(", ") || ""
  );

  // Fragrance profile & narrative (Extrait de Parfum is the Soulmate Scents luxury standard)
  const concentration = initialProduct?.fragrance?.concentration || "Extrait de Parfum";
  const [gender, setGender] = useState<"Men" | "Women" | "Unisex">(
    initialProduct?.fragrance?.gender || "Unisex"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rating, setRating] = useState<number>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (initialProduct as any)?.ratingAverage !== undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? Number((initialProduct as any).ratingAverage)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (initialProduct as any)?.rating !== undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? Number((initialProduct as any).rating)
      : 4.9
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ratingCount, setRatingCount] = useState<number>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (initialProduct as any)?.reviewCount !== undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? Number((initialProduct as any).reviewCount)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (initialProduct as any)?.ratingCount !== undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? Number((initialProduct as any).ratingCount)
      : 128
  );
  const scentFamily = initialProduct?.scentFamily?.[0] || "Woody Amber";
  const [description, setDescription] = useState(
    initialProduct?.description || ""
  );

  // Secondary bottle sizes (e.g. 100ml, 30ml)
  const [extraVariants, setExtraVariants] = useState<VariantRow[]>(() => {
    if (initialProduct?.variants && initialProduct.variants.length > 1) {
      return initialProduct.variants.slice(1).map((v) => ({
        size: v.size || "100ml",
        price: v.price || Math.round(Number(initialProduct.price || 13500) * 1.65),
        compareAtPrice: v.compareAtPrice,
        stock: v.stock !== undefined ? v.stock : 15,
      }));
    }
    return [];
  });

  // Load Categories (for background schema compatibility)
  useEffect(() => {
    async function loadMeta() {
      try {
        const cats = await adminService.getCategories(true);
        setCategories(cats);
        if (!category && cats.length > 0) {
          setCategory(cats[0]._id);
        }
      } catch {
        // Fallback
      }
    }
    loadMeta();
  }, [category]);

  // Upload handler for Computer Files
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          throw new Error(data.message || "Failed to upload image");
        }
      }

      if (uploadedUrls.length > 0) {
        if (pickerTarget === "card") {
          // Set collection card image
          setCardImage(uploadedUrls[0]);
          // If detail images is empty, auto-add as first detail view as well
          if (detailImages.length === 0) {
            setDetailImages([uploadedUrls[0]]);
          }
        } else {
          // Setting a specific slot or multiple detail slots
          const slotIndex = Number(pickerTarget);
          const next = [...detailImages];
          if (uploadedUrls.length === 1) {
            next[slotIndex] = uploadedUrls[0];
          } else {
            // Multiple images uploaded
            for (let i = 0; i < uploadedUrls.length && slotIndex + i < 4; i++) {
              next[slotIndex + i] = uploadedUrls[i];
            }
          }
          setDetailImages(next.slice(0, 4));
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error uploading picture");
    } finally {
      setIsUploadingImage(false);
      if (fileUploadInputRef.current) {
        fileUploadInputRef.current.value = "";
      }
    }
  };

  // Select image from Folder Modal
  const handleSelectFromFolder = (selected: { url: string }) => {
    if (pickerTarget === "card") {
      setCardImage(selected.url);
      if (detailImages.length === 0) {
        setDetailImages([selected.url]);
      }
    } else {
      const slotIndex = Number(pickerTarget);
      const next = [...detailImages];
      next[slotIndex] = selected.url;
      setDetailImages(next.slice(0, 4));
    }
    setIsFolderModalOpen(false);
  };

  const openPicker = (target: "card" | number, mode: "upload" | "browse") => {
    setPickerTarget(target);
    if (mode === "upload") {
      fileUploadInputRef.current?.click();
    } else {
      setIsFolderModalOpen(true);
    }
  };

  const handleRemoveDetailImage = (index: number) => {
    const next = detailImages.filter((_, i) => i !== index);
    setDetailImages(next);
  };

  const handleAddExtraVariant = (sizeToAdd = "100ml") => {
    if (extraVariants.some((v) => v.size.toLowerCase() === sizeToAdd.toLowerCase())) return;
    const isLarger = sizeToAdd.includes("100");
    const newPrice = isLarger ? Math.round(cardPrice * 1.65) : Math.round(cardPrice * 0.7);
    const newCompare = isLarger ? Math.round(newPrice * 1.15) : undefined;
    setExtraVariants([
      ...extraVariants,
      {
        size: sizeToAdd,
        price: newPrice,
        compareAtPrice: newCompare,
        stock: 15,
      },
    ]);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Fragrance name is required.");
      return;
    }

    const finalCategory =
      category ||
      (typeof initialProduct?.category === "object" && initialProduct.category !== null
        ? initialProduct.category._id
        : (initialProduct?.category as string)) ||
      categories[0]?._id ||
      "64fa00000000000000000001";

    // Determine final card cover image
    const finalCardCover = cardImage || detailImages[0];
    if (!finalCardCover) {
      setError("Please upload at least one photo for the Collection Card.");
      return;
    }

    // Combine Card Cover + Detail Gallery Photos (up to 4)
    const combinedUrls: string[] = [finalCardCover];
    for (const dUrl of detailImages) {
      if (dUrl && !combinedUrls.includes(dUrl)) {
        combinedUrls.push(dUrl);
      }
    }

    const validImages = combinedUrls.map((url, idx) => ({
      url,
      altText: `${name.trim()} - View ${idx + 1}`,
      isPrimary: idx === 0,
    }));

    // Auto-generate slug and SKU
    const initials =
      name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase() || "SS";
    const autoSku = `SS-${initials}`;
    const autoSlug =
      initialProduct?.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Primary size variant (from Collection Card) + Extra sizes (from Detail Page)
    const allVariants = [
      {
        size: cardSize.trim() || "50ml",
        price: Number(cardPrice) || 13500,
        compareAtPrice: cardComparePrice ? Number(cardComparePrice) : undefined,
        sku: `${autoSku}-${cardSize.trim().toUpperCase()}`,
        stock: Number(cardStock) || 0,
        status: "active" as const,
      },
      ...extraVariants.map((v) => ({
        size: v.size.trim(),
        price: Number(v.price) || Math.round(Number(cardPrice) * 1.65),
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
        sku: `${autoSku}-${v.size.trim().replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`,
        stock: Number(v.stock) || 0,
        status: "active" as const,
      })),
    ];

    const payload: Partial<AdminProduct> = {
      name: name.trim(),
      slug: autoSlug,
      sku: `${autoSku}-MAIN`,
      brand: "Soulmate Scents",
      price: Number(cardPrice) || 13500,
      compareAtPrice: cardComparePrice ? Number(cardComparePrice) : undefined,
      currency: "PKR",
      shortDescription: shortDescription.trim() || undefined,
      description: description.trim() || undefined,
      status,
      category: finalCategory,
      collections: [],
      fragrance: {
        concentration,
        gender,
        longevity: "10-14 Hours (Extrait hold)",
        sillage: "Strong radiating trail",
        topNotes: topNotes
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean),
        heartNotes: heartNotes
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean),
        baseNotes: baseNotes
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean),
      },
      scentFamily: scentFamily ? [scentFamily] : ["Woody Amber"],
      images: validImages,
      variants: allVariants,
      featured,
      bestseller,
      newArrival,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...({ ratingAverage: Number(rating) || 4.9, reviewCount: Number(ratingCount) || 128, rating: Number(rating) || 4.9, ratingCount: Number(ratingCount) || 128 } as any),
      seo: {
        metaTitle: `${name.trim()} | Soulmate Scents`,
        metaDescription: shortDescription.trim() || `${name.trim()} - Luxury Fragrance`,
      },
    };

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      setJustSaved(false);
      if (isEdit && initialProduct?._id) {
        await adminService.updateProduct(initialProduct._id, payload);
        setSuccessMessage(`"${name.trim()}" has been updated successfully! All changes are live on the storefront.`);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 4000);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        await adminService.createProduct(payload);
        setSuccessMessage(`"${name.trim()}" published successfully! Redirecting to catalog...`);
        setJustSaved(true);
        setTimeout(() => {
          router.push("/admin/products");
        }, 1200);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculated discount percentage for card preview
  const discountPct =
    cardComparePrice && cardComparePrice > cardPrice
      ? Math.round(((cardComparePrice - cardPrice) / cardComparePrice) * 100)
      : null;

  return (
    <>
      {/* Folder Image Picker Modal */}
      <FolderImagePickerModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSelectImage={handleSelectFromFolder}
        selectedUrls={
          pickerTarget === "card"
            ? cardImage ? [cardImage] : []
            : detailImages
        }
      />

      {/* Hidden File Input */}
      <input
        ref={fileUploadInputRef}
        type="file"
        accept="image/*"
        multiple={pickerTarget !== "card"}
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Floating Viewport Toast for Immediate Visibility in empty space below header */}
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
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 pr-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                {isEdit ? "Fragrance Updated Successfully" : "Fragrance Published Successfully"}
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
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8 w-full pb-20 font-sans">
        {/* Top Header & Sticky Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0C134F] font-medium transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Catalog
            </Link>
            <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
              {isEdit ? "Edit Fragrance" : "Add New Fragrance"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Organized into Collection Card Settings & Product Detail Page Experience.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/products"
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
            >
              Discard
            </Link>
            <Button
              type="submit"
              variant="brand"
              isLoading={isSubmitting}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider h-10 rounded-xl bg-[#0C134F] hover:bg-[#0C134F]/90 text-white shadow-xs cursor-pointer gap-2"
            >
              <Check className="w-4 h-4" />
              {isEdit ? "Update Fragrance" : "Publish Fragrance"}
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-medium flex items-center justify-between shadow-2xs animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-600 hover:text-emerald-800 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-medium flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* 🎴 CARD A: COLLECTION CARD SETTINGS (STOREFRONT LISTING CARD)        */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="bg-white border-2 border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-[#0C134F] text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">
                <Layers className="w-3 h-3 text-indigo-600" />
                Storefront Collection Card
              </div>
              <h2 className="text-lg font-serif font-bold text-slate-900">
                1. Collection Card Setup
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Controls the main bottle picture, title, price, discount ribbon, and teaser shown in collections.
              </p>
            </div>

            {/* Catalog Status Switch */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatus("active")}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  status === "active"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                ● Live on Store
              </button>
              <button
                type="button"
                onClick={() => setStatus("draft")}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  status === "draft"
                    ? "bg-amber-50 border-amber-300 text-amber-800 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Draft (Hidden)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Card Cover Image Upload & Mini Preview */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-serif">
                Collection Card Picture (Cover Photo) *
              </label>

              {cardImage ? (
                <div className="space-y-2">
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/5] max-h-[360px] sm:max-h-[460px] max-w-xs sm:max-w-md mx-auto sm:mx-0 flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cardImage}
                      alt={name || "Card Cover Picture"}
                      className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Overlay Badges preview */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                      {bestseller && (
                        <span className="bg-[#590B16] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                          Best Seller
                        </span>
                      )}
                      {newArrival && (
                        <span className="bg-[#0C134F] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                          New
                        </span>
                      )}
                    </div>

                    {discountPct && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm pointer-events-none">
                        {discountPct}% OFF
                      </div>
                    )}

                    {/* Hover Change / Remove Actions (Desktop) */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex flex-col items-center justify-center gap-2 p-4">
                      <p className="text-white text-xs font-semibold mb-1">
                        Change Card Cover Picture
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => openPicker("card", "upload")}
                          disabled={isUploadingImage}
                          className="bg-white text-slate-900 hover:bg-slate-100 text-xs h-8 px-3 rounded-xl cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 mr-1" />
                          From Computer
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => openPicker("card", "browse")}
                          className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs h-8 px-3 rounded-xl cursor-pointer"
                        >
                          <FolderOpen className="w-3.5 h-3.5 mr-1" />
                          From Folder
                        </Button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCardImage("")}
                        className="text-xs text-rose-300 hover:text-rose-100 underline mt-1 cursor-pointer"
                      >
                        Remove Picture
                      </button>
                    </div>
                  </div>

                  {/* Mobile Touch Action Buttons */}
                  <div className="flex sm:hidden items-center justify-between gap-2 max-w-xs mx-auto">
                    <div className="flex gap-2 flex-1">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => openPicker("card", "upload")}
                        disabled={isUploadingImage}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] h-8.5 rounded-xl cursor-pointer"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Computer
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => openPicker("card", "browse")}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] h-8.5 rounded-xl cursor-pointer"
                      >
                        <FolderOpen className="w-3 h-3 mr-1" />
                        Folder
                      </Button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCardImage("")}
                      className="text-xs text-rose-500 font-semibold px-2 py-1 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 hover:border-[#0C134F]/40 rounded-2xl p-6 text-center bg-slate-50/70 hover:bg-slate-50 transition-colors aspect-[4/5] flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-3">
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 mb-1">
                    Upload Card Picture
                  </p>
                  <p className="text-[11px] text-slate-400 mb-4 max-w-[200px]">
                    This is the main flacon photo that appears on collection cards
                  </p>
                  <div className="flex flex-col gap-2 w-full max-w-[220px]">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => openPicker("card", "upload")}
                      disabled={isUploadingImage}
                      className="w-full bg-[#0C134F] hover:bg-[#0C134F]/90 text-white text-xs h-8.5 rounded-xl cursor-pointer gap-1.5 shadow-2xs font-semibold"
                    >
                      {isUploadingImage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      Upload from Computer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openPicker("card", "browse")}
                      className="w-full border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs h-8.5 rounded-xl cursor-pointer gap-1.5 font-semibold"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Pick from Perfumes Folder
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Card Content & Details */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <div>
                <Input
                  label="Fragrance Name *"
                  placeholder="e.g. Crown Legacy, Elite Fusion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-sm font-semibold"
                />
              </div>

              {/* Pricing & Stock Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Selling Price (Rs.) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="13500"
                    value={cardPrice}
                    onChange={(e) => setCardPrice(Number(e.target.value) || 0)}
                    className="text-xs bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Original Price (Rs.)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="15500"
                    value={cardComparePrice || ""}
                    onChange={(e) =>
                      setCardComparePrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-xs bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Primary Size
                  </label>
                  <Input
                    placeholder="50ml"
                    value={cardSize}
                    onChange={(e) => setCardSize(e.target.value)}
                    className="text-xs bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Stock Badge
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="25"
                    value={cardStock}
                    onChange={(e) => setCardStock(Number(e.target.value) || 0)}
                    className="text-xs bg-white font-mono"
                  />
                </div>
              </div>

              {/* Card Short Sensory Teaser */}
              <Textarea
                label="Short Sensory Teaser (Shown on Collection Card Overview)"
                placeholder="e.g. Bold, magnetic, and built for modern leaders."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                className="text-xs leading-relaxed resize-none bg-white"
              />

              {/* Card Merchandising Ribbons */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 block mb-2 font-serif">
                  Card Ribbons & Badges:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setBestseller(!bestseller)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      bestseller
                        ? "bg-[#590B16]/5 border-[#590B16]/30 text-[#590B16]"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Flame className={`w-3.5 h-3.5 ${bestseller ? "text-[#590B16]" : "text-slate-400"}`} />
                      <span className="text-xs font-bold">Best Seller</span>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${bestseller ? "bg-[#590B16] border-[#590B16] text-white" : "border-slate-300 bg-white"}`}>
                      {bestseller && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setNewArrival(!newArrival)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      newArrival
                        ? "bg-indigo-50/60 border-indigo-200 text-[#0C134F]"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Star className={`w-3.5 h-3.5 ${newArrival ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className="text-xs font-bold">New Arrival</span>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${newArrival ? "bg-[#0C134F] border-[#0C134F] text-white" : "border-slate-300 bg-white"}`}>
                      {newArrival && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setFeatured(!featured)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      featured
                        ? "bg-amber-50/70 border-amber-200 text-amber-900"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className={`w-3.5 h-3.5 ${featured ? "text-amber-600" : "text-slate-400"}`} />
                      <span className="text-xs font-bold">Featured</span>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${featured ? "bg-amber-600 border-amber-600 text-white" : "border-slate-300 bg-white"}`}>
                      {featured && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* 📖 CARD B: PRODUCT DETAIL PAGE EXPERIENCE                           */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div className="bg-white border-2 border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-800 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">
              <Eye className="w-3 h-3 text-rose-700" />
              Product Detail Page Experience
            </div>
            <h2 className="text-lg font-serif font-bold text-slate-900">
              2. Detail Page Showcase & Composition
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload 3 to 4 gallery photos, set the 3 Olfactory Pyramid notes, and configure full fragrance narrative.
            </p>
          </div>

          {/* ── B.1: DETAIL PAGE GALLERY (3 to 4 Photos) ── */}
          <div className="space-y-3 p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-800 flex items-center gap-2 font-serif">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  Detail Page Gallery Photos (3 to 4 Pictures)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Customers view these angles in the thumbnail carousel and full-screen gallery.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openPicker(detailImages.length < 4 ? detailImages.length : 0, "upload")}
                  disabled={isUploadingImage}
                  className="gap-1.5 text-xs h-8 rounded-xl border-slate-200 bg-white hover:bg-slate-100 text-[#0C134F] font-semibold cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload from Computer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openPicker(detailImages.length < 4 ? detailImages.length : 0, "browse")}
                  className="gap-1.5 text-xs h-8 rounded-xl border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-900 font-semibold cursor-pointer shadow-2xs"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Pick from Folder
                </Button>
              </div>
            </div>

            {/* 4 Gallery Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
              {[0, 1, 2, 3].map((slotIdx) => {
                const imgUrl = detailImages[slotIdx];
                const slotLabels = [
                  "1. Front Flacon",
                  "2. Angle / Cap",
                  "3. Box / Packaging",
                  "4. Lifestyle Scene",
                ];

                return (
                  <div
                    key={slotIdx}
                    className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col items-center text-center relative group"
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                      {slotLabels[slotIdx]}
                    </span>

                    {imgUrl ? (
                      <div className="w-full space-y-1.5">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-50 border border-slate-100 p-2 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={`Detail view ${slotIdx + 1}`}
                            className="w-full h-full object-contain drop-shadow-xs"
                          />
                          {/* Hover Overlay (Desktop) */}
                          <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex flex-col items-center justify-center gap-1.5 p-2">
                            <button
                              type="button"
                              onClick={() => openPicker(slotIdx, "upload")}
                              className="px-2 py-1 bg-white text-slate-900 rounded text-[10px] font-bold hover:bg-slate-100 cursor-pointer"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDetailImage(slotIdx)}
                              className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Mobile visible action buttons */}
                        <div className="flex sm:hidden items-center justify-center gap-1 w-full pt-1">
                          <button
                            type="button"
                            onClick={() => openPicker(slotIdx, "upload")}
                            className="flex-1 py-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-[9.5px] font-semibold"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveDetailImage(slotIdx)}
                            className="py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md text-[9.5px] font-semibold"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => openPicker(slotIdx, "upload")}
                        className="w-full aspect-square rounded-lg border-2 border-dashed border-slate-200 hover:border-[#0C134F]/40 bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-all p-2"
                      >
                        <Plus className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[10.5px] font-semibold text-slate-600">Add View {slotIdx + 1}</span>
                        <span className="text-[9px] text-slate-400">Upload or Pick</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── B.2: OLFACTORY PYRAMID (The 3 Scent Circles) ── */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-800 flex items-center gap-2 font-serif">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Olfactory Pyramid (Shown in 3 Circular Badges on Detail Page)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Each section directly populates the Top, Heart, and Base note cards under the fragrance composition.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 font-serif">🌸 Top Notes</span>
                  <span className="text-[10px] text-slate-400 font-mono">Opening 15m</span>
                </div>
                <Input
                  placeholder="Bergamot, Saffron, Pink Pepper"
                  value={topNotes}
                  onChange={(e) => setTopNotes(e.target.value)}
                  className="text-xs bg-white"
                />
                <p className="text-[10px] text-slate-400">Comma-separated opening accord</p>
              </div>

              <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 font-serif">🪵 Heart Notes</span>
                  <span className="text-[10px] text-slate-400 font-mono">Core 2-4h</span>
                </div>
                <Input
                  placeholder="Damascus Rose, Rich Oud, Amber"
                  value={heartNotes}
                  onChange={(e) => setHeartNotes(e.target.value)}
                  className="text-xs bg-white"
                />
                <p className="text-[10px] text-slate-400">Comma-separated mid accord</p>
              </div>

              <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 font-serif">🍂 Base Notes</span>
                  <span className="text-[10px] text-slate-400 font-mono">Drydown 8-14h</span>
                </div>
                <Input
                  placeholder="Sandalwood, Bourbon Vanilla, Musk"
                  value={baseNotes}
                  onChange={(e) => setBaseNotes(e.target.value)}
                  className="text-xs bg-white"
                />
                <p className="text-[10px] text-slate-400">Comma-separated foundation</p>
              </div>
            </div>
          </div>

          {/* ── B.3: GENDER, REVIEWS & FULL NARRATIVE ── */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Gender Suitability"
                value={gender}
                onChange={(e) => setGender(e.target.value as "Unisex" | "Men" | "Women")}
                options={GENDER_OPTIONS}
              />

              <Input
                label="Customer Rating (Stars ⭐)"
                type="number"
                step="0.1"
                min="1"
                max="5"
                placeholder="4.9"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value) || 5)}
                className="text-xs bg-white font-mono"
              />

              <Input
                label="Total Reviews Count"
                type="number"
                min="0"
                placeholder="128"
                value={ratingCount}
                onChange={(e) => setRatingCount(Number(e.target.value) || 0)}
                className="text-xs bg-white font-mono"
              />
            </div>

            {/* Full Narrative Textarea */}
            <Textarea
              label="Full Olfactory Narrative (Shown in Detail Page Description Tab)"
              placeholder="A captivating, regal scent crafted with rare essences..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="text-xs leading-relaxed resize-none bg-white"
            />
          </div>

          {/* ── B.4: OPTIONAL SECONDARY SIZES ── */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 font-serif">
                  Additional Flacon Sizes (Optional for Detail Page)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Allow customers to switch between 50ml, 100ml, or discovery travel bottles.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Add:</span>
                {["100ml", "30ml", "10ml"].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleAddExtraVariant(sz)}
                    className="text-[11px] h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer shadow-2xs transition-all hover:border-[#0C134F]/30"
                  >
                    +{sz}
                  </button>
                ))}
              </div>
            </div>

            {extraVariants.length > 0 && (
              <div className="space-y-2.5">
                {extraVariants.map((v, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 items-end"
                  >
                    <div>
                      <label className="text-[10.5px] font-semibold text-slate-600 block mb-1">
                        Size
                      </label>
                      <Input
                        value={v.size}
                        onChange={(e) => {
                          const next = [...extraVariants];
                          next[idx].size = e.target.value;
                          setExtraVariants(next);
                        }}
                        className="text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-semibold text-slate-600 block mb-1">
                        Price (Rs.)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={v.price}
                        onChange={(e) => {
                          const next = [...extraVariants];
                          next[idx].price = Number(e.target.value) || 0;
                          setExtraVariants(next);
                        }}
                        className="text-xs bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-semibold text-slate-600 block mb-1">
                        Compare Price (Rs.)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={v.compareAtPrice || ""}
                        onChange={(e) => {
                          const next = [...extraVariants];
                          next[idx].compareAtPrice = e.target.value ? Number(e.target.value) : undefined;
                          setExtraVariants(next);
                        }}
                        className="text-xs bg-white font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10.5px] font-semibold text-slate-600 block mb-1">
                          Stock
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => {
                            const next = [...extraVariants];
                            next[idx].stock = Number(e.target.value) || 0;
                            setExtraVariants(next);
                          }}
                          className="text-xs bg-white font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setExtraVariants(extraVariants.filter((_, i) => i !== idx))
                        }
                        className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0 mt-auto"
                        title="Remove size"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Floating / Sticky Save Action Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-3 flex-wrap">
            <span className="text-xs font-serif font-bold text-slate-900 hidden sm:inline truncate max-w-[200px]">
              {name ? name : "Untitled Fragrance"}
            </span>
            <span className="text-[11px] text-slate-400">
              Status: <strong className={status === "active" ? "text-emerald-700" : "text-amber-700"}>{status === "active" ? "Live on Storefront" : "Draft (Hidden)"}</strong>
            </span>
            <AnimatePresence>
              {justSaved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -8 }}
                  className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  <span>Changes Published Live!</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-end gap-2.5 w-full sm:w-auto">
            <Link
              href="/admin/products"
              className="flex-1 sm:flex-initial text-center px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              variant="brand"
              isLoading={isSubmitting}
              className={cn(
                "flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-wider h-10 rounded-xl text-white shadow-xs cursor-pointer gap-2 transition-all duration-300",
                justSaved
                  ? "!bg-emerald-600 hover:!bg-emerald-700 !text-white shadow-emerald-600/25"
                  : "bg-[#0C134F] hover:bg-[#0C134F]/90"
              )}
            >
              {justSaved ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isEdit ? "Fragrance Updated!" : "Fragrance Published!"}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEdit ? "Update Fragrance" : "Publish Fragrance"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
