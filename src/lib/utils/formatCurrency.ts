export function formatCurrency(
  amount: number,
  currency?: string,
  locale?: string
): string {
  if (currency && currency !== "PKR" && currency !== "Rs") {
    try {
      return new Intl.NumberFormat(locale || "en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // fallback
    }
  }
  return `Rs. ${amount.toLocaleString("en-US")}`;
}
