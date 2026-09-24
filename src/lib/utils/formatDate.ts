export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
