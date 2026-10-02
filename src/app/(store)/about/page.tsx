import React from "react";
import Link from "next/link";
import Image from "next/image";
import { constructMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";

export const metadata = constructMetadata({
  title: "About Us — Soulmate Scents",
  description:
    "At Soulmate Scents, we believe a fragrance is more than just a scent — it's a feeling, a memory, and a part of your story.",
  canonical: "/about",
});

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen py-8 sm:py-12">
      <Container size="wide">
        {/* Breadcrumb */}
        <div className="text-xs font-sans text-[#8E95A2] mb-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#0B1938] transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#0B1938] font-medium">About</span>
        </div>

        {/* 1. Hero / Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-14">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-sans font-bold text-[#B89047] uppercase tracking-[0.2em] block">
              OUR STORY
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0B1938] leading-[1.1] tracking-tight">
              A Scent for Every Story
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-sans font-normal leading-relaxed max-w-xl pt-2">
              At Soulmate Scents, we believe a fragrance is more than just a scent &mdash; it&apos;s a feeling, a memory, and a part of your story. Our passion is to create authentic, premium fragrances that bring confidence, elegance, and connection to your everyday life.
            </p>
          </div>

          <div className="lg:col-span-6 relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(11,25,56,0.12)] border border-[#E2DED6]/90">
            <Image
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop"
              alt="Soulmate Scents Luxury Perfume"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* 2. Feature Highlights Floating Bar (3 Columns) */}
        <div className="bg-white border border-[#E2DED6]/90 rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(11,25,56,0.08)] hover:shadow-[0_15px_35px_-8px_rgba(11,25,56,0.12)] transition-all duration-300 my-8 sm:my-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#F0ECE1]">
            <div className="flex items-center gap-4 pt-4 md:pt-0 first:pt-0 md:px-4 first:px-0">
              <div className="w-12 h-12 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938]">
                <Icons.ShieldCheck className="w-6 h-6 text-[#0B1938]" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#0B1938]">
                  Authentic & Premium
                </h3>
                <p className="text-xs text-[#64748B] font-sans mt-0.5">
                  Carefully crafted fragrances you can trust.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-6">
              <div className="w-12 h-12 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938]">
                <Icons.Sparkles className="w-6 h-6 text-[#0B1938]" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#0B1938]">
                  Inspired by You
                </h3>
                <p className="text-xs text-[#64748B] font-sans mt-0.5">
                  Scents for every mood and every moment.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938]">
                <Icons.Heart className="w-6 h-6 text-[#0B1938]" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#0B1938]">
                  A Lasting Impression
                </h3>
                <p className="text-xs text-[#64748B] font-sans mt-0.5">
                  Because the right scent stays with you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Our Mission Section */}
        <div className="my-12 sm:my-16 text-center max-w-3xl mx-auto">
          <span className="text-xs font-sans font-bold text-[#B89047] uppercase tracking-[0.2em] block mb-2">
            OUR MISSION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1938] tracking-tight leading-tight mb-4">
            To Make Every Moment More Meaningful
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] font-sans font-normal leading-relaxed">
            We are dedicated to bringing you high-quality, long-lasting fragrances that inspire confidence and elevate your everyday moments. Our goal is to make luxury scents accessible to everyone who values authenticity and elegance.
          </p>
        </div>

        {/* 4. Our Values Section (4 Grid Card) */}
        <div className="bg-white border border-[#E2DED6]/90 rounded-2xl p-6 sm:p-10 text-center shadow-[0_10px_30px_-10px_rgba(11,25,56,0.08)] hover:shadow-[0_15px_35px_-8px_rgba(11,25,56,0.12)] transition-all duration-300 my-12 sm:my-16">
          <span className="text-xs font-sans font-bold text-[#B89047] uppercase tracking-[0.2em] block mb-8">
            OUR VALUES
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center mx-auto shadow-xs text-[#0B1938]">
                <Icons.ShieldCheck className="w-5 h-5 text-[#0B1938]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0B1938]">
                Quality First
              </h3>
              <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                We prioritize premium ingredients and authentic formulations.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center mx-auto shadow-xs text-[#0B1938]">
                <Icons.User className="w-5 h-5 text-[#0B1938]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0B1938]">
                Customer Focused
              </h3>
              <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                Your satisfaction and trust are at the heart of everything we do.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center mx-auto shadow-xs text-[#0B1938]">
                <Icons.Sparkles className="w-5 h-5 text-[#0B1938]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0B1938]">
                Timeless Scents
              </h3>
              <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                Fragrances designed for every personality and occasion.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center mx-auto shadow-xs text-[#0B1938]">
                <Icons.Star className="w-5 h-5 text-[#0B1938]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0B1938]">
                Accessible Luxury
              </h3>
              <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                High-end fragrances made for everyone who loves to smell exceptional.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Why Choose Soulmate Scents Section (3 Columns Grid) */}
        <div className="my-12 sm:my-16 text-center">
          <span className="text-xs font-sans font-bold text-[#B89047] uppercase tracking-[0.2em] block mb-2">
            WHY CHOOSE SOULMATE SCENTS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1938] tracking-tight mb-8">
            More Than Just a Fragrance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#EFECE6] max-w-5xl mx-auto">
            <div className="pt-4 md:pt-0 md:px-4">
              <h3 className="font-serif text-base font-bold text-[#0B1938] mb-1">
                Wide Selection
              </h3>
              <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                A curated range of scents for every mood and occasion.
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:px-4">
              <h3 className="font-serif text-base font-bold text-[#0B1938] mb-1">
                Trusted by Customers
              </h3>
              <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                Loved by fragrance enthusiasts across the globe.
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:px-4">
              <h3 className="font-serif text-base font-bold text-[#0B1938] mb-1">
                Dedicated Support
              </h3>
              <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                We&apos;re always here to help you find your perfect scent.
              </p>
            </div>
          </div>
        </div>

        {/* 6. Our Promise Section (Bottom CTA Banner Card) */}
        <div className="bg-[#FAF6F0] rounded-2xl p-8 sm:p-12 text-center border border-[#EFECE6] shadow-[0_10px_30px_-10px_rgba(11,25,56,0.08)] my-12">
          <span className="text-xs font-sans font-bold text-[#B89047] uppercase tracking-[0.2em] block mb-2">
            OUR PROMISE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1938] tracking-tight mb-3">
            A Scent for Every Story
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] font-sans max-w-xl mx-auto mb-6 leading-relaxed">
            Whether it&apos;s a new beginning, a special occasion, or simply an everyday moment, Soulmate Scents is here to be part of your journey.
          </p>

          <Link
            href="/perfumes"
            className="inline-flex items-center gap-2 bg-[#131F37] hover:bg-[#0B1938] text-white font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-xl shadow-md transition-all cursor-pointer min-h-[48px]"
          >
            <span>Explore Our Collection</span>
            <Icons.ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
