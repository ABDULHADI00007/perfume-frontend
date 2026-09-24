export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};
