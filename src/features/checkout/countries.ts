export interface CountryConfig {
  country: string;
  dialCode: string;
  flag: string;
  maxDigits: number;
  minDigits: number;
  placeholder: string;
  formatHelp: string;
}

export const COUNTRIES: CountryConfig[] = [
  {
    country: "Pakistan",
    dialCode: "+92",
    flag: "🇵🇰",
    maxDigits: 11,
    minDigits: 10,
    placeholder: "0300 1234567",
    formatHelp: "Max 11 digits (e.g. 03001234567)",
  },
  {
    country: "United Arab Emirates",
    dialCode: "+971",
    flag: "🇦🇪",
    maxDigits: 10,
    minDigits: 9,
    placeholder: "50 123 4567",
    formatHelp: "9-10 digits (e.g. 501234567)",
  },
  {
    country: "Saudi Arabia",
    dialCode: "+966",
    flag: "🇸🇦",
    maxDigits: 10,
    minDigits: 9,
    placeholder: "50 123 4567",
    formatHelp: "9-10 digits (e.g. 501234567)",
  },
  {
    country: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
    maxDigits: 11,
    minDigits: 10,
    placeholder: "07123 456789",
    formatHelp: "10-11 digits (e.g. 07123456789)",
  },
  {
    country: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
    maxDigits: 10,
    minDigits: 10,
    placeholder: "555 123 4567",
    formatHelp: "10 digits (e.g. 5551234567)",
  },
  {
    country: "Canada",
    dialCode: "+1",
    flag: "🇨🇦",
    maxDigits: 10,
    minDigits: 10,
    placeholder: "555 123 4567",
    formatHelp: "10 digits (e.g. 5551234567)",
  },
];

export function getCountryConfig(countryNameOrCode: string): CountryConfig {
  const match = COUNTRIES.find(
    (c) =>
      c.country.toLowerCase() === countryNameOrCode.toLowerCase() ||
      c.dialCode === countryNameOrCode
  );
  return match || COUNTRIES[0]; // Default to Pakistan
}

