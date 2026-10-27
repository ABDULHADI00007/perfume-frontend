export function formatCurrency(
  amount?: number | null,
  currency?: string,
  locale?: string
): string {
  const numericAmount =
    typeof amount === "number" && !Number.isNaN(amount) ? amount : 0;

  if (currency && currency !== "PKR" && currency !== "Rs") {
    try {
      return new Intl.NumberFormat(locale || "en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(numericAmount);
    } catch {
      // fallback
    }
  }
  return `Rs. ${numericAmount.toLocaleString("en-US")}`;
}
