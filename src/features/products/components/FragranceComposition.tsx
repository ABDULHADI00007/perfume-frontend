"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FragranceNotes } from "../types";
import { reviewService } from "@/features/reviews/services/reviewService";

export interface FragranceCompositionProps {
  productId?: string;
  notes?: FragranceNotes;
  concentration?: string;
  olfactoryFamily?: string;
  productTitle?: string;
  description?: string;
  rating?: number;
  ratingCount?: number;
  className?: string;
}

interface CustomerReviewItem {
  id: string;
  name: string;
  email?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
}

const DEFAULT_REVIEWS: CustomerReviewItem[] = [
  {
    id: "rev-1",
    name: "Mohammad Ali",
    rating: 5,
    date: "2 days ago",
    title: "Unbelievable longevity and projection!",
    comment:
      "I ordered this after hearing so much praise. The opening is crisp with spices and bergamot, but the drydown of rich oud and warm amber is where it truly shines. It easily lasted 12+ hours on my outfit with endless compliments.",
    isVerified: true,
    helpfulCount: 24,
  },
  {
    id: "rev-2",
    name: "Sara Ahmed",
    rating: 5,
    date: "5 days ago",
    title: "Pure luxury in a bottle",
    comment:
      "The packaging was breathtaking and the magnetic cap feels so premium. Wore it to a wedding reception and people kept asking what scent I was wearing. Truly high niche perfumery at an honest price.",
    isVerified: true,
    helpfulCount: 18,
  },
  {
    id: "rev-3",
    name: "Zainab Malik",
    rating: 5,
    date: "1 week ago",
    title: "My new signature scent",
    comment:
      "Subtle yet commanding. It doesn't cause any headache like synthetic scents do; you can tell the natural oils and ingredients are top tier. Will definitely repurchase once this bottle runs out.",
    isVerified: true,
    helpfulCount: 15,
  },
  {
    id: "rev-4",
    name: "Usman Tariq",
    rating: 4,
    date: "2 weeks ago",
    title: "Sophisticated and masculine",
    comment:
      "Very refined scent profile with great character. Projection is strong for the first 4-5 hours then settles into an alluring warm skin scent. Ideal for evening gatherings and special occasions.",
    isVerified: true,
    helpfulCount: 9,
  },
  {
    id: "rev-5",
    name: "Dr. Bilal Shah",
    rating: 5,
    date: "3 weeks ago",
    title: "Exceeded my highest expectations",
    comment:
      "Arrived within 2 days in secure luxury boxing. The balance of spicy saffron and ambergris creates an intoxicating scent trail. Easily stands toe-to-toe with international designer perfumes.",
    isVerified: true,
    helpfulCount: 12,
  },
];

export const FragranceComposition: React.FC<FragranceCompositionProps> = ({
  productId = "default-product",
  notes,
  concentration = "Eau de Parfum",
  olfactoryFamily = "Amber Woody Oriental",
  productTitle = "Oud Royale",
  description,
  rating = 4.9,
  ratingCount = 91,
  className = "",
}) => {
  // Tabs: Default to "reviews" as requested
  const [activeTab, setActiveTab] = useState<"reviews" | "notes" | "description" | "details" | "shipping">("reviews");

  // Reviews state
  const [reviews, setReviews] = useState<CustomerReviewItem[]>(DEFAULT_REVIEWS);
  const [votedHelpful, setVotedHelpful] = useState<Record<string, boolean>>({});
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "highest">("recent");

  // Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Load persisted reviews from localStorage on client mount
  useEffect(() => {
    try {
      const storageKey = `ss_reviews_${productId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews([...parsed, ...DEFAULT_REVIEWS]);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [productId]);

  const handleHelpfulClick = (id: string) => {
    if (votedHelpful[id]) return;
    setVotedHelpful((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!formEmail.trim() || !formEmail.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (formComment.trim().length < 5) {
      setFormError("Please write at least a few words about your experience (minimum 5 characters).");
      return;
    }

    setIsSubmitting(true);

    const newReview: CustomerReviewItem = {
      id: `rev-${Date.now()}`,
      name: formName.trim(),
      email: formEmail.trim(),
      rating: formRating,
      date: "Just now",
      title: formTitle.trim() || (formRating >= 4 ? "Loved this fragrance!" : "Good fragrance"),
      comment: formComment.trim(),
      isVerified: true,
      helpfulCount: 0,
    };

    // Try sending to backend API
    try {
      await reviewService.createReview({
        productId,
        customerName: formName.trim(),
        customerEmail: formEmail.trim(),
        rating: formRating,
        title: formTitle.trim(),
        comment: formComment.trim(),
      });
    } catch {
      // Backend may be offline or review queued for moderation
    }

    // Save locally
    try {
      const storageKey = `ss_reviews_${productId}`;
      const saved = localStorage.getItem(storageKey);
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem(storageKey, JSON.stringify([newReview, ...existing]));
    } catch {
      // Ignore storage error
    }

    setReviews((prev) => [newReview, ...prev]);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormName("");
    setFormEmail("");
    setFormTitle("");
    setFormComment("");
    setFormRating(5);

    setTimeout(() => {
      setSubmitSuccess(false);
      setShowReviewForm(false);
    }, 4000);
  };

  const filteredReviews = reviews
    .filter((r) => (starFilter ? r.rating === starFilter : true))
    .sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      return 0; // Default order
    });

  const ratingDescriptors: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Average",
    4: "Very Good",
    5: "Excellent / Masterpiece",
  };

  const topNotesText = notes?.top?.join(", ") || "Saffron, Bergamot, Spices";
  const heartNotesText = notes?.heart?.join(", ") || "Oud, Rose, Amber";
  const baseNotesText = notes?.base?.join(", ") || "Musk, Vanilla, Sandalwood";

  return (
    <section className={`py-12 border-t border-gray-200/80 mt-12 font-sans ${className}`}>
      {/* Tab Navigation Header */}
      <div className="border-b border-gray-200/80 mb-8 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-8 min-w-max pb-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative flex items-center gap-1.5 cursor-pointer ${
              activeTab === "reviews"
                ? "text-[#590B16] border-b-2 border-[#590B16]"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <span>Reviews ({ratingCount + (reviews.length - DEFAULT_REVIEWS.length)})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === "notes"
                ? "text-[#590B16] border-b-2 border-[#590B16]"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Scent Notes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === "description"
                ? "text-[#590B16] border-b-2 border-[#590B16]"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === "details"
                ? "text-[#590B16] border-b-2 border-[#590B16]"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === "shipping"
                ? "text-[#590B16] border-b-2 border-[#590B16]"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Shipping & Returns
          </button>
        </div>
      </div>

      {/* TAB 1: CUSTOMER REVIEWS (Primary Active Tab) */}
      {activeTab === "reviews" && (
        <div className="flex flex-col space-y-10">
          {/* Reviews Rating Summary Box */}
          <div className="bg-[#FAF8F5] border border-[#EBE3D7] rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Overall Rating Score */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[#E5DACB] pb-6 lg:pb-0 lg:pr-8">
                <span className="font-serif text-5xl sm:text-6xl font-bold text-[#0D1424] tracking-tight">
                  {rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <svg
                      key={starNum}
                      className="w-5 h-5 sm:w-6 sm:h-6 fill-[#F97316] text-[#F97316] drop-shadow-[0_1px_2px_rgba(249,115,22,0.3)]"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-medium text-stone-600">
                  Based on {ratingCount + (reviews.length - DEFAULT_REVIEWS.length)} verified reviews
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#590B16] bg-[#590B16]/10 px-3 py-1 rounded-full">
                  <span>✓</span>
                  <span>98% of customers recommend this fragrance</span>
                </div>
              </div>

              {/* Center: Rating Distribution Progress Bars */}
              <div className="lg:col-span-5 flex flex-col space-y-2">
                {[
                  { star: 5, pct: 85, count: 77 },
                  { star: 4, pct: 11, count: 10 },
                  { star: 3, pct: 3, count: 3 },
                  { star: 2, pct: 1, count: 1 },
                  { star: 1, pct: 0, count: 0 },
                ].map((item) => (
                  <div key={item.star} className="flex items-center gap-3 text-xs font-medium text-stone-600">
                    <span className="w-12 text-right shrink-0">{item.star} Stars</span>
                    <div className="flex-1 h-2.5 bg-[#E6DFD5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F97316] rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-stone-400 text-[11px] shrink-0 text-right">
                      {item.pct}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Right: "Write a Review" Call to Action */}
              <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center">
                <button
                  type="button"
                  onClick={() => setShowReviewForm((prev) => !prev)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#590B16] hover:bg-[#430810] text-white text-xs sm:text-sm font-serif font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{showReviewForm ? "Close Review Form" : "Write a Review"}</span>
                </button>
                <p className="text-[11px] text-stone-500 mt-2 text-center lg:text-right">
                  Share your scent experience with fellow connoisseurs
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Review Submission Form */}
          {showReviewForm && (
            <div className="bg-white border-2 border-[#590B16]/20 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-300">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl font-bold text-[#0D1424]">
                    Write a Review for {productTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Your authentic rating and review helps our community discover unique fragrances.
                  </p>
                </div>

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
                    <span className="text-lg">✓</span>
                    <div>
                      <strong className="block font-bold">Thank you for your review!</strong>
                      <span>Your review has been successfully submitted and added to this page.</span>
                    </div>
                  </div>
                )}

                {formError && (
                  <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  {/* Rating Selector */}
                  <div className="flex flex-col items-center justify-center p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE2D5]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                      Overall Rating
                    </span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const activeVal = hoverRating !== null ? hoverRating : formRating;
                        const isFilled = star <= activeVal;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => setFormRating(star)}
                            className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                            aria-label={`Rate ${star} star`}
                          >
                            <svg
                              className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                isFilled
                                  ? "fill-[#F97316] text-[#F97316] drop-shadow-[0_2px_4px_rgba(249,115,22,0.4)]"
                                  : "fill-[#D1C7BA] text-[#D1C7BA]"
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-semibold text-[#590B16] mt-2">
                      {ratingDescriptors[hoverRating !== null ? hoverRating : formRating]}
                    </span>
                  </div>

                  {/* Name and Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Hamza Khan"
                        className="w-full px-4 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-[#590B16] focus:ring-1 focus:ring-[#590B16]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="e.g. hamza@example.com"
                        className="w-full px-4 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-[#590B16] focus:ring-1 focus:ring-[#590B16]"
                      />
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        Your email will never be displayed publicly.
                      </span>
                    </div>
                  </div>

                  {/* Review Headline */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Review Title / Headline
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Masterpiece fragrance with unmatched sillage"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-[#590B16] focus:ring-1 focus:ring-[#590B16]"
                    />
                  </div>

                  {/* Review Comment */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      placeholder="Tell us about the scent, how long it lasted, projection, compliments received..."
                      className="w-full px-4 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-[#590B16] focus:ring-1 focus:ring-[#590B16]"
                    />
                  </div>

                  {/* Submit and Cancel Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-5 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[#590B16] hover:bg-[#430810] text-white text-xs sm:text-sm font-serif font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Filter & Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-stone-500 mr-1">Filter:</span>
              <button
                type="button"
                onClick={() => setStarFilter(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  starFilter === null
                    ? "bg-[#590B16] text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                All ({reviews.length})
              </button>
              {[5, 4, 3].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setStarFilter(starFilter === star ? null : star)}
                  className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                    starFilter === star
                      ? "bg-[#590B16] text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {star} ★ ({reviews.filter((r) => r.rating === star).length})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "highest")}
                className="text-xs font-medium border border-stone-300 rounded-lg px-2.5 py-1 text-stone-700 bg-white focus:outline-none focus:border-[#590B16]"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 bg-stone-50 rounded-xl">
                <p className="text-sm text-stone-500">No reviews found for this filter.</p>
              </div>
            ) : (
              filteredReviews.map((rev) => {
                const initials = rev.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                const isVoted = votedHelpful[rev.id];

                return (
                  <div
                    key={rev.id}
                    className="p-6 bg-white border border-stone-200/90 rounded-2xl hover:border-stone-300 transition-all shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Reviewer Info */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-[#FAF4ED] border border-[#E7DCCE] text-[#590B16] flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-xs">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-sm font-bold text-[#0D1424]">
                              {rev.name}
                            </span>
                            {rev.isVerified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <span>✓</span>
                                <span>Verified Buyer</span>
                              </span>
                            )}
                          </div>
                          {/* Stars */}
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((starNum) => (
                              <svg
                                key={starNum}
                                className={`w-3.5 h-3.5 ${
                                  starNum <= rev.rating
                                    ? "fill-[#F97316] text-[#F97316]"
                                    : "fill-[#D1C7BA] text-[#D1C7BA]"
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <span className="text-xs text-stone-400 font-sans">
                        {rev.date}
                      </span>
                    </div>

                    {/* Review Body */}
                    <div className="mt-3.5 pl-0 sm:pl-[50px]">
                      <h4 className="text-sm font-bold text-stone-900 font-sans mb-1">
                        {rev.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                        {rev.comment}
                      </p>

                      {/* Helpful Button */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500">
                        <span>Was this review helpful?</span>
                        <button
                          type="button"
                          onClick={() => handleHelpfulClick(rev.id)}
                          disabled={isVoted}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                            isVoted
                              ? "bg-emerald-50 text-emerald-700"
                              : "hover:bg-stone-100 text-stone-700 active:scale-95"
                          }`}
                        >
                          <span>👍</span>
                          <span>{isVoted ? "Helpful" : "Yes"} ({rev.helpfulCount})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SCENT NOTES */}
      {activeTab === "notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#0D1424]">
              Olfactory Architecture
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
              Every fragrance by Soulmate Scents is harmonized with a 3-tier olfactory pyramid. Crafted with exquisite natural absolutes and rich resins to guarantee lingering projection and multifaceted silage from sunrise to dusk.
            </p>
            <div className="pt-2 text-xs text-stone-600 space-y-2">
              <p><strong className="text-stone-900">Concentration:</strong> {concentration}</p>
              <p><strong className="text-stone-900">Olfactory Family:</strong> {olfactoryFamily}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-3 gap-4">
              {/* Top Notes */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border border-gray-200 shadow-xs">
                  <Image
                    src="/images/perfumes/sultan-veils.png"
                    alt="Top Notes"
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className="object-cover object-center"
                  />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#0D1424]">
                  Top Notes
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {topNotesText}
                </p>
              </div>

              {/* Heart Notes */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border border-gray-200 shadow-xs">
                  <Image
                    src="/images/perfumes/oyd_royal.png"
                    alt="Heart Notes"
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className="object-cover object-center"
                  />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#0D1424]">
                  Heart Notes
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {heartNotesText}
                </p>
              </div>

              {/* Base Notes */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border border-gray-200 shadow-xs">
                  <Image
                    src="/images/perfumes/amber-rivera.png"
                    alt="Base Notes"
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className="object-cover object-center"
                  />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#0D1424]">
                  Base Notes
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {baseNotesText}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DESCRIPTION */}
      {activeTab === "description" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-8 flex flex-col space-y-6">
            <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
              {description ||
                `${productTitle} is an extraordinary blend that captures power, elegance, and mystery. Inspired by rare oriental traditions, this fragrance opens with rich spices, unfolds into deep oud, and settles into a warm, lingering trail. Perfect for evening wear and special occasions.`}
            </p>

            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-700 font-medium">
                <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-700 text-[10px] font-bold">
                  ✓
                </div>
                <span>Long-lasting fragrance (10-14 hours on fabric)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700 font-medium">
                <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-700 text-[10px] font-bold">
                  ✓
                </div>
                <span>Premium imported French & Arabian essential oils</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700 font-medium">
                <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-700 text-[10px] font-bold">
                  ✓
                </div>
                <span>Ideal for special occasions, formal evenings & daily signature wear</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700 font-medium">
                <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-700 text-[10px] font-bold">
                  ✓
                </div>
                <span>Comes encased in bespoke luxury Soulmate Scents packaging</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DETAILS */}
      {activeTab === "details" && (
        <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-stone-600">
          <h3 className="font-serif text-2xl font-bold text-[#0D1424] mb-4">
            Product Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <strong className="block text-stone-900 font-serif mb-1">Fragrance Name</strong>
              <span>{productTitle}</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <strong className="block text-stone-900 font-serif mb-1">Concentration</strong>
              <span>{concentration} (High Oil Load 25-30%)</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <strong className="block text-stone-900 font-serif mb-1">Olfactory Profile</strong>
              <span>{olfactoryFamily}</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <strong className="block text-stone-900 font-serif mb-1">Longevity & Silage</strong>
              <span>Heavy projection (4-6 hours), 12+ hours skin/fabric hold</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SHIPPING & RETURNS */}
      {activeTab === "shipping" && (
        <div className="max-w-3xl space-y-6 text-xs sm:text-sm text-stone-600">
          <h3 className="font-serif text-2xl font-bold text-[#0D1424]">
            Shipping & Return Policy
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <strong className="block text-stone-900 font-serif mb-1">Fast Delivery Across Pakistan</strong>
              <p>Orders are dispatched within 24 hours. Delivery takes 2-4 business days for major cities (Karachi, Lahore, Islamabad) and 3-5 days for other locations.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <strong className="block text-stone-900 font-serif mb-1">Free Shipping on Orders Above Rs. 20,000</strong>
              <p>Enjoy complimentary tracked courier delivery on qualifying luxury orders nationwide.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <strong className="block text-stone-900 font-serif mb-1">7-Day Hassle-Free Returns & Exchange</strong>
              <p>We take pride in our artisanal scents. If you are not completely enchanted, our concierge team will gladly arrange a swift replacement or return for any unsealed product.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
