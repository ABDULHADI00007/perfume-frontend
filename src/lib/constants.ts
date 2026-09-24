export const CURRENCY_DEFAULT = "USD";

export const PER_PAGE_DEFAULT = 12;

export const FRAGRANCE_CONCENTRATIONS = [
  "Eau de Parfum",
  "Extrait de Parfum",
  "Parfum",
  "Eau de Toilette",
] as const;

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
