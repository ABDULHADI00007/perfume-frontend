import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      {/* Decorative */}
      <div className="inline-flex items-center justify-center space-x-3 mb-8">
        <span className="w-8 h-[1px] bg-accent" />
        <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted font-sans">
          404 — Not Found
        </span>
        <span className="w-8 h-[1px] bg-accent" />
      </div>

      {/* Headline */}
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-foreground leading-[1.1] tracking-tight mb-6 max-w-xl">
        This Page Has Retired to the Archives
      </h1>

      <p className="text-sm sm:text-base text-foreground-muted font-sans font-light leading-relaxed mb-10 max-w-md">
        The page or fragrance you are looking for could not be found. Perhaps it has been discontinued, or the link has changed.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center font-sans font-medium uppercase px-8 py-4 text-xs tracking-[0.2em] bg-primary text-primary-foreground hover:bg-primary-hover border border-primary transition-all duration-200 cursor-pointer"
        >
          Return Home
        </Link>
        <Link
          href="/perfumes"
          className="inline-flex items-center justify-center font-sans font-medium uppercase px-8 py-4 text-xs tracking-[0.2em] bg-transparent text-foreground border border-border-strong hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer"
        >
          Explore Fragrances
        </Link>
      </div>
    </div>
  );
}
