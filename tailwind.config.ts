import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: {
          DEFAULT: "var(--color-surface)",
          subtle: "var(--color-surface-subtle)",
          muted: "var(--color-surface-muted)",
        },
        foreground: {
          DEFAULT: "var(--color-foreground)",
          muted: "var(--color-foreground-muted)",
          subtle: "var(--color-foreground-subtle)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          subtle: "var(--color-border-subtle)",
          strong: "var(--color-border-strong)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
          foreground: "var(--color-secondary-foreground)",
          subtle: "var(--color-secondary-subtle)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          foreground: "var(--color-accent-foreground)",
          subtle: "var(--color-accent-subtle)",
        },
        navy: "var(--color-navy)",
        violet: "var(--color-violet)",
        champagne: "var(--color-champagne)",
        status: {
          success: "var(--color-success)",
          "success-subtle": "var(--color-success-subtle)",
          "success-foreground": "var(--color-success-foreground)",
          warning: "var(--color-warning)",
          "warning-subtle": "var(--color-warning-subtle)",
          "warning-foreground": "var(--color-warning-foreground)",
          error: "var(--color-error)",
          "error-subtle": "var(--color-error-subtle)",
          "error-foreground": "var(--color-error-foreground)",
          info: "var(--color-info)",
          "info-subtle": "var(--color-info-subtle)",
          "info-foreground": "var(--color-info-foreground)",
        },
        admin: {
          bg: "var(--color-admin-bg)",
          surface: "var(--color-admin-surface)",
          sidebar: "var(--color-admin-sidebar)",
          border: "var(--color-admin-border)",
        },
        card: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-surface-muted)",
          foreground: "var(--color-foreground-muted)",
        },
        destructive: {
          DEFAULT: "var(--color-error)",
          foreground: "#FFFFFF",
        },
        ring: "var(--color-primary)",
        input: "var(--color-border)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-sans)", "Inter", "sans-serif"],
        outfit: ["var(--font-outfit)", "var(--font-sans)", "sans-serif"],
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
        "5xl": "var(--space-5xl)",
      },
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        card: "var(--shadow-card)",
        dropdown: "var(--shadow-dropdown)",
        modal: "var(--shadow-modal)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
      },
      transitionTimingFunction: {
        luxury: "var(--ease-luxury)",
        editorial: "var(--ease-editorial)",
      },
      zIndex: {
        base: "0",
        dropdown: "20",
        sticky: "30",
        drawer: "50",
        modal: "60",
        popover: "70",
        toast: "80",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

