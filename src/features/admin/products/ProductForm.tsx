"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "../services/adminService";
import { AdminProduct, AdminCategory, AdminCollection } from "../types";
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
} from "lucide-react";

export interface ProductFormProps {
  initialProduct?: AdminProduct;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  isEdit = false,
}) => {
  const router = useRouter();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [brand, setBrand] = useState(initialProduct?.brand || "Soulmate Scents");
  const [price, setPrice] = useState<string>(
    initialProduct?.price ? String(initialProduct.price) : ""
  );
  const [compareAtPrice, setCompareAtPrice] = useState<string>(
    initialProduct?.compareAtPrice ? String(initialProduct.compareAtPrice) : ""
  );
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || ""
  );
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [status, setStatus] = useState<"active" | "draft" | "archived">(
    initialProduct?.status || "draft"
  );
  const [category, setCategory] = useState<string>(
    typeof initialProduct?.category === "object" && initialProduct.category !== null
      ? initialProduct.category._id
      : (initialProduct?.category as string) || ""
  );
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialProduct?.collections?.map((c) => (typeof c === "object" ? c._id : c)) || []
  );

  // Fragrance Composition
  const [concentration, setConcentration] = useState(
    initialProduct?.fragrance?.concentration || "Eau de Parfum"
  );
  const [gender, setGender] = useState<"Men" | "Women" | "Unisex">(
    initialProduct?.fragrance?.gender || "Unisex"
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

  // Images
  const [images, setImages] = useState<
    Array<{ url: string; altText?: string; isPrimary?: boolean }>
  >(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images
      : [{ url: "", altText: "", isPrimary: true }]
  );

  // Variants
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
      : [{ size: "100ml", price: 0, sku: "", stock: 10, status: "active" }]
  );

  // Flags
  const [featured, setFeatured] = useState(initialProduct?.featured || false);
  const [bestseller, setBestseller] = useState(initialProduct?.bestseller || false);
  const [newArrival, setNewArrival] = useState(initialProduct?.newArrival || false);

  // SEO
  const [metaTitle, setMetaTitle] = useState(initialProduct?.seo?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialProduct?.seo?.metaDescription || ""
  );

  useEffect(() => {
    async function loadMetadata() {
      try {
        setIsLoadingMeta(true);
        const [cats, cols] = await Promise.all([
          adminService.getCategories(),
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

  const handleAddVariant = () => {
    const baseSku = sku ? `${sku}-${variants.length + 1}` : `SKU-VAR-${variants.length + 1}`;
    setVariants([
      ...variants,
      { size: "50ml", price: Number(price) || 0, sku: baseSku, stock: 10, status: "active" },
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
      setError("Please select a valid category.");
      return;
    }

    const payload: Partial<AdminProduct> = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      sku: sku.trim(),
      brand: brand.trim() || "House Perfume",
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      shortDescription: shortDescription.trim() || undefined,
      description: description.trim() || undefined,
      status,
      category,
      collections: selectedCollections,
      fragrance: {
        concentration,
        gender,
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
      images: images
        .filter((img) => img.url && img.url.trim().length > 0)
        .map((img) => ({
          url: img.url.trim(),
          altText: img.altText?.trim() || undefined,
          isPrimary: Boolean(img.isPrimary),
        })),
      variants: variants.map((v) => ({
        size: v.size.trim(),
        price: Number(v.price) || 0,
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
        sku: v.sku.trim() || `${sku.trim()}-${v.size.trim()}`,
        stock: Number(v.stock) || 0,
        status: v.status || "active",
      })),
      featured,
      bestseller,
      newArrival,
      seo: {
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
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
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Core Info & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-400" />
              General Product Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Product Name *"
                placeholder="e.g. Noir Éternel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs"
              />
              <Input
                label="Custom Slug (optional)"
                placeholder="noir-eternel"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="SKU *"
                placeholder="MDP-NOIR-100"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="text-xs font-mono"
              />
              <Input
                label="Brand"
                placeholder="Soulmate Scents"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Price ($) *"
                type="number"
                step="0.01"
                min="0"
                placeholder="180.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="text-xs font-mono"
              />
              <Input
                label="Compare at Price ($)"
                type="number"
                step="0.01"
                min="0"
                placeholder="220.00"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                className="text-xs font-mono"
              />
            </div>

            <Textarea
              label="Short Teaser Description"
              placeholder="Brief sensory summary..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={2}
              className="text-xs leading-relaxed resize-none"
            />

            <Textarea
              label="Full Story & Product Details"
              placeholder="Comprehensive olfactory narrative and formulation notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="text-xs leading-relaxed resize-none"
            />
          </div>

          {/* Fragrance Composition Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-400" />
              Olfactory Architecture & Notes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Concentration"
                value={concentration}
                onChange={(e) => setConcentration(e.target.value)}
                options={[
                  { label: "Eau de Parfum", value: "Eau de Parfum" },
                  { label: "Extrait de Parfum", value: "Extrait de Parfum" },
                  { label: "Eau de Toilette", value: "Eau de Toilette" },
                  { label: "Eau de Cologne", value: "Eau de Cologne" },
                  { label: "Parfum Oil", value: "Parfum Oil" },
                ]}
              />

              <Select
                label="Gender Character"
                value={gender}
                onChange={(e) => setGender(e.target.value as "Men" | "Women" | "Unisex")}
                options={[
                  { label: "Unisex", value: "Unisex" },
                  { label: "Women", value: "Women" },
                  { label: "Men", value: "Men" },
                ]}
              />
            </div>

            <Input
              label="Top Notes (comma-separated)"
              placeholder="Bergamot, Cardamom, Pink Pepper"
              value={topNotes}
              onChange={(e) => setTopNotes(e.target.value)}
              className="text-xs"
            />

            <Input
              label="Heart Notes (comma-separated)"
              placeholder="Damask Rose, Iris, Nutmeg"
              value={heartNotes}
              onChange={(e) => setHeartNotes(e.target.value)}
              className="text-xs"
            />

            <Input
              label="Base Notes (comma-separated)"
              placeholder="Oud, Amber, Sandalwood, Vanilla"
              value={baseNotes}
              onChange={(e) => setBaseNotes(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* Product Images Card */}
          {/* Imagery Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Product Imagery (URLs)
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImage}
                className="gap-1.5 text-xs h-8 rounded-xl border-slate-200 bg-white hover:bg-[#FAF7EE] text-[#0C134F] hover:text-[#590B16] hover:border-[#590B16]/30 shadow-2xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Image URL
              </Button>
            </div>

            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 transition-all hover:border-slate-300">
                  <div className="w-12 h-12 bg-white border border-slate-200/80 rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {img.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt={img.altText || "Preview"} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="https://images.unsplash.com/..."
                      value={img.url}
                      onChange={(e) => {
                        const next = [...images];
                        next[idx].url = e.target.value;
                        setImages(next);
                      }}
                      className="text-xs bg-white"
                    />
                    <Input
                      placeholder="Alt text (e.g. Bottle angle)"
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
                      onClick={() => {
                        const next = images.map((item, i) => ({
                          ...item,
                          isPrimary: i === idx,
                        }));
                        setImages(next);
                      }}
                      title="Set as Primary"
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider border transition-all cursor-pointer ${
                        img.isPrimary
                          ? "bg-[#590B16] text-[#FAF7EE] border-[#590B16] shadow-xs"
                          : "bg-white text-slate-500 border-slate-200 hover:border-[#590B16]/30 hover:text-[#590B16] hover:bg-[#FAF7EE]"
                      }`}
                    >
                      {img.isPrimary ? "Primary" : "Set Primary"}
                    </button>

                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Variants Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                Sizes & Product Variants
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVariant}
                className="gap-1.5 text-xs h-8 rounded-xl border-slate-200 bg-white hover:bg-[#FAF7EE] text-[#0C134F] hover:text-[#590B16] hover:border-[#590B16]/30 shadow-2xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Size
              </Button>
            </div>

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 items-end transition-all hover:border-slate-300">
                  <Input
                    label="Size"
                    placeholder="100ml"
                    value={v.size}
                    onChange={(e) => {
                      const next = [...variants];
                      next[idx].size = e.target.value;
                      setVariants(next);
                    }}
                    className="text-xs bg-white"
                  />
                  <Input
                    label="Price ($)"
                    type="number"
                    step="0.01"
                    value={v.price}
                    onChange={(e) => {
                      const next = [...variants];
                      next[idx].price = Number(e.target.value);
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
                  <div className="flex items-center justify-end pb-1">
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="px-2.5 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Taxonomy, Status & Publishing */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
            <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              Status & Visibility
            </h3>

            <Select
              label="Publication Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "draft" | "archived")}
              options={[
                { label: "Draft (Hidden)", value: "draft" },
                { label: "Active (Published)", value: "active" },
                { label: "Archived", value: "archived" },
              ]}
            />

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-[#0C134F] block">Badges & Highlights</label>
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

            <div className="pt-4 border-t border-slate-100">
              <Button
                type="submit"
                variant="brand"
                size="lg"
                className="w-full gap-2 text-xs font-bold uppercase tracking-wider h-11 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                isLoading={isSubmitting}
              >
                <Check className="w-4 h-4" />
                {isEdit ? "Update Fragrance" : "Publish Fragrance"}
              </Button>
            </div>
          </div>

          {/* Categories & Collections Taxonomy */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              Category & Collections
            </h3>

            <Select
              label="Primary Category *"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoadingMeta}
              options={
                categories.length > 0
                  ? categories.map((c) => ({ label: c.name, value: c._id }))
                  : [{ label: "Loading...", value: "" }]
              }
            />

            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-[#0C134F] block">
                Assign to Collections
              </label>
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

          {/* SEO Metadata */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0C134F] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              SEO & Metadata
            </h3>

            <Input
              label="Meta Title"
              placeholder="e.g. Noir Éternel Eau de Parfum | Soulmate Scents"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="text-xs"
            />

            <Textarea
              label="Meta Description"
              placeholder="Compelling 150-character summary for Google search..."
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="text-xs leading-relaxed resize-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

