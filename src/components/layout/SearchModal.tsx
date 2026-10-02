"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
}

const popularSearchTerms = [
  "Extrait de Parfum",
  "Santal",
  "Private Reserve",
  "Woody Oriental",
  "Floral Amber",
  "Discovery Set",
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const handleSelectTerm = (term: string) => {
    setQuery(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      showCloseButton={true}
    >
      <div className="flex flex-col space-y-6">
        {/* Search Header */}
        <div className="border-b border-border pb-4">
          <p className="text-caption text-foreground-muted mb-2">Search Maison de Parfum</p>
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Icons.Search
              size={20}
              className="absolute left-0 text-foreground-muted pointer-events-none"
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by note, collection, or fragrance..."
              aria-label="Search fragrances"
              className="w-full bg-transparent pl-8 pr-10 py-2 text-base sm:text-lg font-serif placeholder:font-sans placeholder:text-sm placeholder:text-foreground-subtle text-foreground focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-0 p-1 text-foreground-subtle hover:text-foreground transition-colors"
              >
                <Icons.Close size={16} />
              </button>
            )}
          </form>
        </div>

        {/* Quick Suggestions / Popular Scent Searches */}
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.16em] font-medium text-foreground-muted mb-3 font-sans">
            Popular Searches
          </h4>
          <div className="flex flex-wrap gap-2">
            {popularSearchTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelectTerm(term)}
                className="text-xs font-sans px-3 py-1.5 border border-border bg-surface-subtle/50 text-foreground hover:border-navy hover:bg-navy hover:text-primary-foreground transition-all duration-150"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Informational Guidance */}
        <div className="bg-surface-subtle/40 border border-border-subtle p-4">
          <p className="text-xs text-foreground-muted font-sans leading-relaxed">
            Looking for a specific olfactory family or note consultation? Explore our{" "}
            <Link
              href="/perfumes"
              onClick={onClose}
              className="underline underline-offset-2 text-foreground font-medium hover:text-violet"
            >
              Perfumes Archive
            </Link>{" "}
            or visit our{" "}
            <Link
              href="/about"
              onClick={onClose}
              className="underline underline-offset-2 text-foreground font-medium hover:text-violet"
            >
              About Us
            </Link>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {query.trim() && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSearch && onSearch(query.trim())}
            >
              Search
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
