import { Product } from "./types";

export function getStartingPrice(product: Product): number {
  if (!product.variants || product.variants.length === 0) return 0;
  return Math.min(...product.variants.map((v) => v.price));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeProduct(raw: any): Product {
  if (!raw) return raw;

  const rawImages = Array.isArray(raw.images) ? raw.images : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const images = rawImages.map((img: any) =>
    typeof img === "string" ? img : img?.url || ""
  ).filter(Boolean);

  const rawVariants = Array.isArray(raw.variants) ? raw.variants : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants = rawVariants.map((v: any) => ({
    id: String(v._id || v.id || v.sku || "v-std"),
    size: v.size || "50ml",
    price: typeof v.price === "number" ? v.price : Number(raw.price || 0),
    compareAtPrice: v.compareAtPrice,
    stock: typeof v.stock === "number" ? v.stock : 10,
    sku: v.sku || raw.sku || "STD-50",
  }));

  if (variants.length === 0 && typeof raw.price === "number") {
    variants.push({
      id: "v-default",
      size: "50ml",
      price: raw.price,
      compareAtPrice: raw.compareAtPrice,
      stock: 10,
      sku: raw.sku || "STD-50",
    });
  }

  const notes = {
    top: Array.isArray(raw.fragrance?.topNotes)
      ? raw.fragrance.topNotes
      : Array.isArray(raw.notes?.top)
      ? raw.notes.top
      : [],
    heart: Array.isArray(raw.fragrance?.heartNotes)
      ? raw.fragrance.heartNotes
      : Array.isArray(raw.notes?.heart)
      ? raw.notes.heart
      : [],
    base: Array.isArray(raw.fragrance?.baseNotes)
      ? raw.fragrance.baseNotes
      : Array.isArray(raw.notes?.base)
      ? raw.notes.base
      : [],
  };

  const categoryId =
    typeof raw.category === "object" && raw.category
      ? String(raw.category._id || raw.category.id)
      : String(raw.category || raw.categoryId || "cat-1");

  const collectionId =
    Array.isArray(raw.collections) && raw.collections.length > 0
      ? typeof raw.collections[0] === "object"
        ? String(raw.collections[0]._id || raw.collections[0].id)
        : String(raw.collections[0])
      : raw.collectionId
      ? String(raw.collectionId)
      : undefined;

  return {
    id: String(raw._id || raw.id),
    title: raw.name || raw.title || "Untitled Fragrance",
    slug: raw.slug || "",
    shortDescription: raw.shortDescription || "",
    description: raw.description || raw.shortDescription || "",
    concentration:
      raw.fragrance?.concentration || raw.concentration || "Extrait de Parfum",
    olfactoryFamily:
      (Array.isArray(raw.scentFamily) && raw.scentFamily[0]) ||
      raw.olfactoryFamily ||
      "Woody Oriental",
    notes,
    variants,
    images: images.length > 0 ? images : ["/images/perfumes/oyd_royal.png"],
    featured: Boolean(raw.featured),
    isNewArrival: Boolean(raw.newArrival || raw.isNewArrival),
    isBestSeller: Boolean(raw.bestseller || raw.isBestSeller),
    isLimitedEdition: Boolean(raw.isLimitedEdition),
    gender: (raw.fragrance?.gender || raw.gender || "unisex").toLowerCase() as "men" | "women" | "unisex",
    categoryId,
    categoryName:
      typeof raw.category === "object" && raw.category ? raw.category.name : undefined,
    categorySlug:
      typeof raw.category === "object" && raw.category ? raw.category.slug : undefined,
    collectionId,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export interface FilterOptions {
  family?: string;
  concentration?: string;
  size?: string;
  gender?: string;
  collectionId?: string;
  collection?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "name" | "newest";
  page?: number;
  limit?: number;
}

export interface FilteredResult {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export function filterAndSortProducts(
  products: Product[],
  options: FilterOptions = {}
): FilteredResult {
  let result = [...products];

  // 1. Search Query
  if (options.q && options.q.trim()) {
    const query = options.q.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.shortDescription?.toLowerCase().includes(query) ||
        p.olfactoryFamily?.toLowerCase().includes(query) ||
        p.notesSummary?.toLowerCase().includes(query) ||
        p.notes.top.some((n) => n.toLowerCase().includes(query)) ||
        p.notes.heart.some((n) => n.toLowerCase().includes(query)) ||
        p.notes.base.some((n) => n.toLowerCase().includes(query))
    );
  }

  // 2. Gender (all, men, women, unisex)
  if (options.gender && options.gender !== "all") {
    result = result.filter((p) => p.gender?.toLowerCase() === options.gender?.toLowerCase());
  }

  // 3. Collection (ethereal, platinum, col-ethereal, col-platinum)
  const targetCollection = options.collectionId || options.collection;
  if (targetCollection && targetCollection !== "all") {
    result = result.filter((p) => {
      if (targetCollection === "col-platinum" || targetCollection === "platinum") {
        return p.isPlatinum || p.collectionId === "col-platinum";
      }
      if (targetCollection === "col-ethereal" || targetCollection === "ethereal") {
        return !p.isPlatinum || p.collectionId === "col-ethereal";
      }
      return p.collectionId === targetCollection;
    });
  }

  // 4. Olfactory Family
  if (options.family && options.family !== "all") {
    result = result.filter(
      (p) => p.olfactoryFamily?.toLowerCase() === options.family?.toLowerCase()
    );
  }

  // 5. Concentration
  if (options.concentration && options.concentration !== "all") {
    result = result.filter(
      (p) => p.concentration.toLowerCase() === options.concentration?.toLowerCase()
    );
  }

  // 6. Size (e.g. "50ml", "100ml")
  if (options.size && options.size !== "all") {
    result = result.filter((p) =>
      p.variants.some((v) => v.size.toLowerCase() === options.size?.toLowerCase())
    );
  }


  // 6. Price Range
  if (options.minPrice !== undefined) {
    result = result.filter((p) => getStartingPrice(p) >= (options.minPrice ?? 0));
  }
  if (options.maxPrice !== undefined) {
    result = result.filter((p) => getStartingPrice(p) <= (options.maxPrice ?? Infinity));
  }

  // 7. Sorting
  const sort = options.sort || "featured";
  switch (sort) {
    case "price-asc":
      result.sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
      break;
    case "price-desc":
      result.sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
      break;
    case "name":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "newest":
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      break;
    case "featured":
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  // 8. Pagination
  const total = result.length;
  const limit = options.limit || 8;
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.max(1, Math.min(options.page || 1, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const paginatedProducts = result.slice(startIndex, startIndex + limit);

  return {
    products: paginatedProducts,
    total,
    totalPages,
    currentPage,
  };
}
