"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "../services/adminService";
import { AdminProduct, AdminCategory, AdminCollection } from "../types";
import { FolderImagePickerModal } from "./FolderImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Package,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Eye,
  Tag,
  Search,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  Upload,
  FolderOpen,
  Loader2,
  Sun,
  Calendar,
  Sliders,
  ChevronDown,
  X,
} from "lucide-react";

export interface ProductFormProps {
  initialProduct?: AdminProduct;
  isEdit?: boolean;
}

const COMMON_SCENT_FAMILIES = [
  "Woody Amber",
  "Royal Spiced Leather",
  "Floral Oriental",
  "Fresh Aquatic",
  "Citrus Amber",
  "Smoky Oud",
  "Gourmand Vanilla",
  "Chypre Fruity",
];

const SEASONS_LIST = ["Spring", "Summer", "Autumn", "Winter"];

const OCCASIONS_LIST = [
  "Evening",
  "Daily Wear",
  "Formal",
  "Special Occasions",
  "Date Night",
  "Office",
];

const STANDARD_SIZES = ["50ml", "100ml", "30ml", "10ml"];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  isEdit = false,
}) => {
  const router = useRouter();
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields - 1. Basic Info
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [category, setCategory] = useState<string>(
    typeof initialProduct?.category === "object" && initialProduct.category !== null
      ? initialProduct.category._id
      : (initialProduct?.category as string) || ""
  );
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || ""
  );
  const [description, setDescription] = useState(initialProduct?.description || "");

  // Form Fields - 2. Pricing & Inventory
  const [price, setPrice] = useState<string>(
    initialProduct?.price ? String(initialProduct.price) : "13500"
  );
  const [compareAtPrice, setCompareAtPrice] = useState<string>(
    initialProduct?.compareAtPrice ? String(initialProduct.compareAtPrice) : ""
  );
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [currency] = useState<string>(initialProduct?.currency || "PKR");
  const [variants, setVariants] = useState<
    Array<{
      size: string;
      price: number;
      compareAtPrice?: number;
      sku: string;
      stock: number;
      status: "active" | "inactive";
    }>
  >(
    initialProduct?.variants && initialProduct.variants.length > 0
      ? initialProduct.variants.map((v) => ({
          size: v.size,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          sku: v.sku,
          stock: v.stock || 0,
          status: v.status || "active",
        }))
      : [{ size: "50ml", price: 13500, sku: "SS-01-50", stock: 25, status: "active" }]
  );

  // Form Fields - 3. Fragrance Details & Notes
  const [brand, setBrand] = useState(initialProduct?.brand || "Soulmate Scents");
  const [concentration, setConcentration] = useState(
    initialProduct?.fragrance?.concentration || "Extrait de Parfum"
  );
  const [gender, setGender] = useState<"Men" | "Women" | "Unisex">(
    initialProduct?.fragrance?.gender || "Unisex"
  );
  const [scentFamily, setScentFamily] = useState<string>(
    initialProduct?.scentFamily?.join(", ") || "Woody Amber"
  );
  const [topNotes, setTopNotes] = useState(
    initialProduct?.fragrance?.topNotes?.join(", ") || ""
  );
  const [heartNotes, setHeartNotes] = useState(
    initialProduct?.fragrance?.heartNotes?.join(", ") || ""
  );
  const [baseNotes, setBaseNotes] = useState(
    initialProduct?.fragrance?.baseNotes?.join(", ") || ""
  );

  // Form Fields - 4. Images
  const [images, setImages] = useState<
    Array<{ url: string; altText?: string; isPrimary?: boolean }>
  >(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images
      : [{ url: "/images/perfumes/elite-fusion.png", altText: "Fragrance Bottle", isPrimary: true }]
  );

  // Form Fields - 5. Advanced & Merchandising Options
  const [longevity, setLongevity] = useState(
    initialProduct?.fragrance?.longevity || "8-10 Hours"
  );
  const [sillage, setSillage] = useState(
    initialProduct?.fragrance?.sillage || "Strong"
  );
  const [seasons, setSeasons] = useState<string[]>(
    initialProduct?.season || ["Autumn", "Winter"]
  );
  const [occasions, setOccasions] = useState<string[]>(
    initialProduct?.occasions || ["Evening", "Special Occasions", "Daily Wear"]
  );
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialProduct?.collections?.map((c) => (typeof c === "object" ? c._id : c)) || []
  );
  const [metaTitle, setMetaTitle] = useState(
    initialProduct?.seo?.metaTitle || ""
  );
  const [metaDescription, setMetaDescription] = useState(
    initialProduct?.seo?.metaDescription || ""
  );

  // Publication Status & Badges
  const [status, setStatus] = useState<"active" | "draft" | "archived">(
    initialProduct?.status || "active"
  );
  const [featured, setFeatured] = useState<boolean>(initialProduct?.featured ?? true);
  const [bestseller, setBestseller] = useState<boolean>(initialProduct?.bestseller ?? true);
  const [newArrival, setNewArrival] = useState<boolean>(initialProduct?.newArrival ?? false);

  useEffect(() => {
    async function loadMetadata() {
      try {
        setIsLoadingMeta(true);
        const [cats, cols] = await Promise.all([
          adminService.getCategories(true),
          adminService.getCollections(),
        ]);
        setCategories(cats);
        setCollections(cols);
        if (!category && cats.length > 0) {
          setCategory(cats[0]._id);
        }
      } catch {
        // Best effort
      } finally {
        setIsLoadingMeta(false);
      }
    }
    loadMetadata();
  }, [category]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit && (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""))) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
    if (!isEdit && !sku && val) {
      const initials = val
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase();
      setSku(`SS-${initials || "PERF"}-MAIN`);
    }
  };

  const handleAddImage = () => {
    setImages([...images, { url: "", altText: "", isPrimary: images.length === 0 }]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleAddVariant = (customSize?: string) => {
    const sizeToAdd = customSize || "50ml";
    const baseSku = sku ? `${sku.replace(/-MAIN$/, "")}-${sizeToAdd}` : `SS-VAR-${sizeToAdd}`;
    setVariants([
      ...variants,
      {
        size: sizeToAdd,
        price: Number(price) || 13500,
        sku: baseSku,
        stock: 20,
        status: "active",
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleCollectionToggle = (colId: string) => {
    if (selectedCollections.includes(colId)) {
      setSelectedCollections(selectedCollections.filter((id) => id !== colId));
    } else {
      setSelectedCollections([...selectedCollections, colId]);
    }
  };

  const handleSeasonToggle = (seasonName: string) => {
    if (seasons.includes(seasonName)) {
      setSeasons(seasons.filter((s) => s !== seasonName));
    } else {
      setSeasons([...seasons, seasonName]);
    }
  };

  const handleOccasionToggle = (occ: string) => {
    if (occasions.includes(occ)) {
      setOccasions(occasions.filter((o) => o !== occ));
    } else {
      setOccasions([...occasions, occ]);
    }
  };

  const handleLocalFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          const newImg = {
            url: data.url,
            altText: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            isPrimary: images.length === 0,
          };
          setImages((prev) => {
            const filtered = prev.filter((im) => im.url.trim().length > 0);
            return [...filtered, newImg];
          });
        } else {
          throw new Error(data.message || "Failed to upload file");
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

  const handleSelectFromFolderModal = (selected: { url: string; altText: string }) => {
    setImages((prev) => {
      const alreadyHas = prev.some((im) => im.url === selected.url);
      if (alreadyHas) return prev;
      const cleanPrev = prev.filter((im) => im.url.trim().length > 0);
      return [
        ...cleanPrev,
        {
          url: selected.url,
          altText: selected.altText || name || "Perfume bottle",
          isPrimary: cleanPrev.length === 0,
        },
      ];
    });
  };

  const handleCancel = () => {
    if (
      name.trim() !== (initialProduct?.name || "") ||
      price !== String(initialProduct?.price || "13500") ||
      sku !== (initialProduct?.sku || "")
    ) {
      if (window.confirm("Discard unsaved changes? Your edits will not be saved.")) {
        router.push("/admin/products");
      }
    } else {
      router.push("/admin/products");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!sku.trim()) {
      setError("Product SKU is required.");
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      setError("Valid product price is required.");
      return;
    }
    if (!category) {
      setError("Please select a valid category (Premium or Gold).");
      return;
    }

    const validImages = images
      .filter((img) => img.url && img.url.trim().length > 0)
      .map((img) => ({
        url: img.url.trim(),
        altText: img.altText?.trim() || undefined,
        isPrimary: Boolean(img.isPrimary),
      }));

    if (validImages.length === 0) {
      setError("At least one product image is required.");
      return;
    }

    if (!validImages.some((img) => img.isPrimary)) {
      validImages[0].isPrimary = true;
    }

    const payload: Partial<AdminProduct> = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      sku: sku.trim(),
      brand: brand.trim() || "Soulmate Scents",
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      currency: currency || "PKR",
      shortDescription: shortDescription.trim() || undefined,
      description: description.trim() || undefined,
      status,
      category:
        typeof category === "object" && category !== null && "_id" in category
          ? (category as { _id: string })._id
          : String(category),
      collections: selectedCollections.map((c) =>
        typeof c === "object" && c !== null && "_id" in c
          ? (c as { _id: string })._id
          : String(c)
      ),
      fragrance: {
        concentration,
        gender,
        longevity: longevity.trim() || undefined,
        sillage: sillage.trim() || undefined,
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
      scentFamily: scentFamily
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      season: seasons,
      occasions: occasions,
      images: validImages,
      variants: variants.map((v) => ({
        size: v.size.trim(),
        price: Number(v.price) || Number(price),
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
        sku: v.sku.trim() || `${sku.trim()}-${v.size.trim()}`,
        stock: Number(v.stock) || 0,
        status: v.status || "active",
      })),
      featured,
      bestseller,
      newArrival,
      seo: {
        metaTitle: metaTitle.trim() || `${name.trim()} | Soulmate Scents`,
        metaDescription:
          metaDescription.trim() || shortDescription.trim() || undefined,
      },
    };

    try {
      setIsSubmitting(true);
      if (isEdit && initialProduct?._id) {
        await adminService.updateProduct(initialProduct._id, payload);
      } else {
        await adminService.createProduct(payload);
      }
      router.push("/admin/products");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Folder Image Picker Modal */}
      <FolderImagePickerModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSelectImage={handleSelectFromFolderModal}
        selectedUrls={images.map((img) => img.url)}
      />

      {/* Hidden File Input for Device Folder Upload */}
      <input
        ref={fileUploadInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleLocalFolderUpload}
      />

      <form onSubmit={handleSubmit} className="space-y-6 font-sans">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-medium flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-700 p-1 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main 2 Columns: 4 Primary Cards + Advanced Collapsible */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ── CARD 1: BASIC INFORMATION ── */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  1. Basic Information
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">* Required fields</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Product Name *"
                  placeholder="e.g. Elite Fusion, Crown Legacy"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="text-xs"
                />
                <Input
                  label="Custom Slug"
                  placeholder="e.g. elite-fusion"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Primary Category *"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isLoadingMeta}
                  options={
                    categories.length > 0
                      ? categories.map((c) => ({ label: `${c.name} Collection`, value: c._id }))
                      : [{ label: "Loading categories...", value: "" }]
                  }
                />

                <Input
                  label="Brand"
                  placeholder="Soulmate Scents"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="text-xs font-medium"
                />
              </div>

              <Textarea
                label="Short Sensory Teaser"
                placeholder="e.g. Bold, magnetic, and built for modern leaders."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                className="text-xs leading-relaxed resize-none"
              />

              <Textarea
                label="Full Olfactory Narrative & Storytelling"
                placeholder="Comprehensive storytelling, sensory breakdown, and wearer impression..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="text-xs leading-relaxed resize-none"
              />
            </div>

            {/* ── CARD 2: PRICING & INVENTORY ── */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  2. Pricing & Bottle Sizes (PKR)
                </h3>
                <span className="text-[10.5px] font-mono text-slate-400">All prices in PKR (Rs.)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Base Price (Rs.) *"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="13500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="text-xs font-mono"
                />
                <Input
                  label="Compare-at Price (Rs.)"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="15000"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  className="text-xs font-mono"
                />
                <Input
                  label="Master SKU *"
                  placeholder="e.g. SS-EF-MAIN"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                  className="text-xs font-mono"
                />
              </div>

              {/* Variants Section */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold text-[#0C134F] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      Flacon Sizes & Variant Stock
                    </label>
                    <p className="text-[10.5px] text-slate-400">
                      Standard size is 50ml. Add discovery travel sets (10ml) or 100ml editions.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Add Size:</span>
                    {STANDARD_SIZES.map((sz) => (
                      <Button
                        key={sz}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddVariant(sz)}
                        className="text-[11px] h-7 px-2.5 rounded-lg border-slate-200 bg-white hover:bg-slate-100 text-[#0C134F] font-semibold cursor-pointer"
                      >
                        +{sz}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 items-end transition-all hover:border-slate-300"
                    >
                      <Input
                        label="Size"
                        placeholder="50ml"
                        value={v.size}
                        onChange={(e) => {
                          const next = [...variants];
                          next[idx].size = e.target.value;
                          setVariants(next);
                        }}
                        className="text-xs bg-white font-medium"
                      />
                      <Input
                        label="Price (Rs.)"
                        type="number"
                        step="1"
                        value={v.price}
                        onChange={(e) => {
                          const next = [...variants];
                          next[idx].price = Number(e.target.value);
                          setVariants(next);
                        }}
                        className="text-xs font-mono bg-white"
                      />
                      <Input
                        label="Compare Price"
                        type="number"
                        step="1"
                        value={v.compareAtPrice || ""}
                        onChange={(e) => {
                          const next = [...variants];
                          next[idx].compareAtPrice = e.target.value ? Number(e.target.value) : undefined;
                          setVariants(next);
                        }}
                        className="text-xs font-mono bg-white"
                      />
                      <Input
                        label="Variant SKU"
                        value={v.sku}
                        onChange={(e) => {
                          const next = [...variants];
                          next[idx].sku = e.target.value;
                          setVariants(next);
                        }}
                        className="text-xs font-mono bg-white"
                      />
                      <Input
                        label="Stock"
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => {
                          const next = [...variants];
                          next[idx].stock = Number(e.target.value);
                          setVariants(next);
                        }}
                        className="text-xs font-mono bg-white"
                      />
                      <div className="flex items-center justify-end pb-1 col-span-2 sm:col-span-1">
                        {variants.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="px-2.5 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">Primary</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── CARD 3: FRAGRANCE DETAILS & NOTES ── */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  3. Fragrance Details & Olfactory Pyramid
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Concentration"
                  value={concentration}
                  onChange={(e) => setConcentration(e.target.value)}
                  options={[
                    { label: "Extrait de Parfum (30%+ Luxury)", value: "Extrait de Parfum" },
                    { label: "Eau de Parfum (15-20%)", value: "Eau de Parfum" },
                    { label: "Eau de Toilette (5-15%)", value: "Eau de Toilette" },
                    { label: "Parfum Oil / Pure Attar", value: "Parfum Oil" },
                  ]}
                />

                <Select
                  label="Gender Character"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "Men" | "Women" | "Unisex")}
                  options={[
                    { label: "Unisex", value: "Unisex" },
                    { label: "Men", value: "Men" },
                    { label: "Women", value: "Women" },
                  ]}
                />
              </div>

              <div>
                <Input
                  label="Scent Family / Olfactory Chord"
                  placeholder="e.g. Woody Amber, Royal Spiced Leather"
                  value={scentFamily}
                  onChange={(e) => setScentFamily(e.target.value)}
                  className="text-xs"
                />

                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Quick Select:</span>
                  {COMMON_SCENT_FAMILIES.map((fam) => (
                    <button
                      key={fam}
                      type="button"
                      onClick={() => setScentFamily(fam)}
                      className={`text-[10.5px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        scentFamily === fam
                          ? "bg-[#0C134F] text-white border-[#0C134F] shadow-2xs font-semibold"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-[#0C134F]"
                      }`}
                    >
                      {fam}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <Input
                  label="Top Notes (Opening Accord, comma-separated)"
                  placeholder="e.g. Bergamot, Ambroxan, Orris Root"
                  value={topNotes}
                  onChange={(e) => setTopNotes(e.target.value)}
                  className="text-xs"
                />

                <Input
                  label="Heart Notes (Mid Accord, comma-separated)"
                  placeholder="e.g. Woody Notes, Ambergris, Jasmine"
                  value={heartNotes}
                  onChange={(e) => setHeartNotes(e.target.value)}
                  className="text-xs"
                />

                <Input
                  label="Base Notes (Foundation, comma-separated)"
                  placeholder="e.g. Patchouli, Woody Notes, Musk"
                  value={baseNotes}
                  onChange={(e) => setBaseNotes(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            {/* ── CARD 4: PRODUCT IMAGES ── */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    4. Product Images & Gallery
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Browse the 64 bottle pictures in the perfumes folder or upload from your computer
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFolderModalOpen(true)}
                    className="gap-1.5 text-xs h-8 rounded-xl border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-[#0C134F] font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                    Browse Perfumes Folder
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileUploadInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="gap-1.5 text-xs h-8 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-[#0C134F] shadow-2xs transition-all cursor-pointer font-medium"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0C134F]" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#0C134F]" />
                    )}
                    Upload from Folder
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImage}
                    className="gap-1 text-xs h-8 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all cursor-pointer"
                    title="Add manual URL input"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add URL
                  </Button>
                </div>
              </div>

              {/* Fast dropzone banner */}
              <div
                onClick={() => fileUploadInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#0C134F]/40 rounded-xl p-3.5 text-center bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-2xs group-hover:scale-105 transition-transform">
                    <Upload className="w-4 h-4 text-[#0C134F]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-[#0C134F]">
                      Click to choose picture from your computer
                    </p>
                    <p className="text-[10.5px] text-slate-400">
                      Saves automatically to <span className="font-mono text-slate-600">/public/images/perfumes/</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Images List */}
              <div className="space-y-3 pt-1">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      img.isPrimary
                        ? "bg-slate-50/90 border-[#0C134F]/40 ring-1 ring-[#0C134F]/20"
                        : "bg-white border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-13 h-13 bg-white border border-slate-200/90 rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative">
                      {img.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img.url}
                          alt={img.altText || "Fragrance thumbnail"}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        placeholder="/images/perfumes/elite-fusion.png"
                        value={img.url}
                        onChange={(e) => {
                          const next = [...images];
                          next[idx].url = e.target.value;
                          setImages(next);
                        }}
                        className="text-xs bg-white font-mono"
                      />
                      <Input
                        placeholder="Alt description (e.g. Front flacon)"
                        value={img.altText || ""}
                        onChange={(e) => {
                          const next = [...images];
                          next[idx].altText = e.target.value;
                          setImages(next);
                        }}
                        className="text-xs bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        title="Set as Main Cover Photo"
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider border transition-all cursor-pointer ${
                          img.isPrimary
                            ? "bg-[#0C134F] text-white border-[#0C134F] shadow-xs"
                            : "bg-white text-slate-600 border-slate-200 hover:border-[#0C134F]/30 hover:text-[#0C134F] hover:bg-slate-100"
                        }`}
                      >
                        {img.isPrimary ? "★ Primary" : "Set Primary"}
                      </button>

                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ADVANCED OPTIONS & SEO COLLAPSIBLE ACCORDION ── */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 text-[#0C134F]">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F]">
                      Advanced Attributes & SEO (Optional)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Longevity, projection, seasonal compatibility, curated collections, and Google search metadata
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-400">
                    {isAdvancedOpen ? "Collapse" : "Expand"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isAdvancedOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isAdvancedOpen && (
                <div className="p-6 pt-2 border-t border-slate-100 space-y-5 bg-slate-50/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Longevity Rating"
                      value={longevity}
                      onChange={(e) => setLongevity(e.target.value)}
                      options={[
                        { label: "8-10 Hours (Standard)", value: "8-10 Hours" },
                        { label: "10-12 Hours (High)", value: "10-12 Hours" },
                        { label: "12+ Hours (Beast Mode)", value: "12+ Hours" },
                        { label: "6-8 Hours (Moderate)", value: "6-8 Hours" },
                        { label: "4-6 Hours (Fresh/Light)", value: "4-6 Hours" },
                      ]}
                    />

                    <Select
                      label="Sillage / Projection"
                      value={sillage}
                      onChange={(e) => setSillage(e.target.value)}
                      options={[
                        { label: "Strong (Room Filler)", value: "Strong" },
                        { label: "Moderate (Arms Length)", value: "Moderate" },
                        { label: "Enormous (Heavy Trail)", value: "Enormous" },
                        { label: "Intimate (Skin Scent)", value: "Intimate" },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#0C134F] flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        Seasonal Compatibility
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {SEASONS_LIST.map((s) => {
                          const active = seasons.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleSeasonToggle(s)}
                              className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                                active
                                  ? "bg-amber-50 border-amber-300 text-amber-900 shadow-2xs font-semibold"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {active ? "✓ " : ""}{s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#0C134F] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        Recommended Occasions
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {OCCASIONS_LIST.map((occ) => {
                          const active = occasions.includes(occ);
                          return (
                            <button
                              key={occ}
                              type="button"
                              onClick={() => handleOccasionToggle(occ)}
                              className={`text-xs px-2.5 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                                active
                                  ? "bg-indigo-50 border-indigo-300 text-indigo-900 shadow-2xs font-semibold"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {active ? "✓ " : ""}{occ}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Curated Collections */}
                  {collections.length > 0 && (
                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      <label className="text-xs font-semibold text-[#0C134F] block">
                        Assign to Curated Collections
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {collections.map((col) => (
                          <Checkbox
                            key={col._id}
                            label={col.name}
                            checked={selectedCollections.includes(col._id)}
                            onChange={() => handleCollectionToggle(col._id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SEO Metadata */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-xs font-semibold text-[#0C134F] flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      Search Engine Optimization (SEO)
                    </label>

                    <Input
                      label="Meta Title"
                      placeholder="e.g. Elite Fusion Extrait de Parfum | Soulmate Scents"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="text-xs"
                    />

                    <Textarea
                      label="Meta Description"
                      placeholder="150-160 character sensory synopsis for Google search results..."
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={2}
                      className="text-xs leading-relaxed resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Publication, Visibility & Sticky Actions */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
              <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] border-b border-slate-100 pb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-400" />
                Publication & Visibility
              </h3>

              <Select
                label="Catalog Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "draft" | "archived")}
                options={[
                  { label: "Active (Published on Storefront)", value: "active" },
                  { label: "Draft (Hidden / Unlisted)", value: "draft" },
                  { label: "Archived (Discontinued)", value: "archived" },
                ]}
              />

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-[#0C134F] block">
                  Merchandising Badges
                </label>
                <Checkbox
                  label="Featured on Homepage"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <Checkbox
                  label="Bestseller Badge"
                  checked={bestseller}
                  onChange={(e) => setBestseller(e.target.checked)}
                />
                <Checkbox
                  label="New Arrival Highlight"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <Button
                  type="submit"
                  variant="brand"
                  size="lg"
                  className="w-full gap-2 text-xs font-bold uppercase tracking-wider h-11 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer bg-[#0C134F] hover:bg-[#0C134F]/90 text-white"
                  isLoading={isSubmitting}
                >
                  <Check className="w-4 h-4" />
                  {isEdit ? "Update Fragrance" : "Publish Fragrance"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full text-xs font-semibold text-slate-600 hover:text-[#0C134F] hover:bg-slate-50 border-slate-200 rounded-xl h-10 transition-all cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
