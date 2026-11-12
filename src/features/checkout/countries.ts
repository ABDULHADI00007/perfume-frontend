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
    flag: "",
    maxDigits: 11,
    minDigits: 10,
    placeholder: "0300 1234567",
    formatHelp: "Max 11 digits (e.g. 03001234567)",
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

