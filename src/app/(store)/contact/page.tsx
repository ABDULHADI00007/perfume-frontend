"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How can I track my order?",
    answer: "You can track your order using the tracking number sent in your confirmation email, or by logging into your account dashboard.",
  },
  {
    question: "Do you offer gift packaging?",
    answer: "Yes, every order includes complimentary signature Maison packaging, a travel pouch, and handwritten gift notes upon request.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "We ship worldwide via white-glove express courier. Delivery timelines and rates are calculated at checkout.",
  },
  {
    question: "Can you help me choose a fragrance?",
    answer: "Our expert scent concierges are available via Live Chat or phone to provide personalized olfactory recommendations.",
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns of un-opened sealed fragrances within 14 days of delivery. Sample vials included with orders allow test before opening.",
  },
  {
    question: "Do you offer bulk or corporate orders?",
    answer: "Yes, we specialize in luxury corporate gifting and custom event favors. Contact our concierge for bespoke pricing.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name || !form.message || !form.subject) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="bg-white min-h-screen py-10 sm:py-16">
      <Container size="wide">
        {/* Header Section */}
        <div className="mb-10 sm:mb-14">
          <span className="text-[11px] font-sans font-semibold text-[#8E95A2] uppercase tracking-[0.2em] block mb-2">
            CONTACT US
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1938] tracking-tight leading-tight">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-sans font-normal mt-2 max-w-2xl leading-relaxed">
            Have a question about our fragrances, need help with an order, or looking for a personalized recommendation? Our team is here to assist you.
          </p>
        </div>

        {/* 2-Column Main Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Card: Send Us a Message (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-[24px] p-7 sm:p-10 lg:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)] transition-all duration-300">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1938] leading-snug">
              Send Us a Message
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] font-sans font-normal mt-1 mb-8">
              Fill out the form below and we&apos;ll get back to you shortly.
            </p>

            {status === "success" ? (
              <div className="p-8 sm:p-10 bg-[#FAF4E8] rounded-2xl border border-[#F5EAD4] text-center space-y-3">
                <div className="w-14 h-14 bg-[#0B1938] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Icons.Check className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B1938]">
                  Message Sent Successfully
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5A3E] font-sans leading-relaxed max-w-md mx-auto">
                  Thank you for reaching out to Maison de Parfum. Our concierge team will review your inquiry and respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#0B1938] underline hover:text-amber-900 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#0B1938] mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full bg-[#F8F6F0]/40 text-[#0B1938] text-xs sm:text-sm px-4 py-3.5 rounded-xl border border-[#E2DED6] hover:border-[#CBD5E1] focus:border-[#0B1938] focus:bg-white focus:ring-2 focus:ring-[#0B1938]/10 focus:outline-none transition-all placeholder:text-[#94A3B8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#0B1938] mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-[#F8F6F0]/40 text-[#0B1938] text-xs sm:text-sm px-4 py-3.5 rounded-xl border border-[#E2DED6] hover:border-[#CBD5E1] focus:border-[#0B1938] focus:bg-white focus:ring-2 focus:ring-[#0B1938]/10 focus:outline-none transition-all placeholder:text-[#94A3B8]"
                    />
                  </div>
                </div>

                {/* Row 2: Phone Number & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#0B1938] mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2 bg-[#F8F6F0]/40 rounded-xl border border-[#E2DED6] focus-within:border-[#0B1938] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0B1938]/10 px-3 py-2 transition-all">
                      <div className="flex items-center gap-1 text-xs font-sans text-[#0B1938] font-semibold border-r border-[#E2DED6] pr-2 flex-shrink-0">
                        <span className="text-base">🇵🇰</span>
                        <Icons.ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className="w-full bg-transparent text-[#0B1938] text-xs sm:text-sm py-1 focus:outline-none placeholder:text-[#94A3B8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#0B1938] mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#F8F6F0]/40 text-[#0B1938] text-xs sm:text-sm px-4 py-3.5 rounded-xl border border-[#E2DED6] hover:border-[#CBD5E1] focus:border-[#0B1938] focus:bg-white focus:ring-2 focus:ring-[#0B1938]/10 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Fragrance Recommendation">Fragrance Recommendation</option>
                      <option value="Order Support">Order Support</option>
                      <option value="Bespoke Gifting">Bespoke Gifting</option>
                      <option value="Wholesale">Wholesale & Corporate</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Message Textarea */}
                <div className="relative">
                  <label className="block text-xs font-sans font-semibold text-[#0B1938] mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    maxLength={500}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    required
                    className="w-full bg-[#F8F6F0]/40 text-[#0B1938] text-xs sm:text-sm px-4 py-3.5 pb-8 rounded-xl border border-[#E2DED6] hover:border-[#CBD5E1] focus:border-[#0B1938] focus:bg-white focus:ring-2 focus:ring-[#0B1938]/10 focus:outline-none transition-all resize-none placeholder:text-[#94A3B8]"
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] text-[#94A3B8] font-sans font-medium">
                    {form.message.length}/500
                  </span>
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-600 font-sans">
                    Please fill out all required fields before submitting.
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 text-xs font-bold tracking-[0.18em] uppercase bg-[#131F37] hover:bg-[#0B1938] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
                >
                  {status === "loading" ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Icons.ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Card: Contact Information (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-gray-200/80 rounded-[24px] p-7 sm:p-9 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)] transition-all duration-300 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0B1938] leading-snug">
                Contact Information
              </h2>
              <p className="text-xs text-[#64748B] font-sans font-normal mt-1">
                You can also reach us directly through the following channels.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {/* 1. Email Us */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#F0ECE1] last:border-b-0 last:pb-0">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938] shadow-sm">
                  <Icons.Mail className="w-5 h-5 text-[#0B1938]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0B1938]">
                    Email Us
                  </h3>
                  <p className="text-xs font-semibold text-[#0B1938] mt-0.5">
                    support@soulmatescents.com
                  </p>
                  <p className="text-[11px] text-[#64748B] font-sans mt-0.5">
                    We typically reply within 24 hours
                  </p>
                </div>
              </div>

              {/* 2. Call Us */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#F0ECE1] last:border-b-0 last:pb-0">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938] shadow-sm">
                  <Icons.Phone className="w-5 h-5 text-[#0B1938]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0B1938]">
                    Call Us
                  </h3>
                  <p className="text-xs font-semibold text-[#0B1938] mt-0.5">
                    +92 300 1234567
                  </p>
                  <p className="text-[11px] text-[#64748B] font-sans mt-0.5">
                    Mon – Sat, 10:00 AM – 7:00 PM (PKT)
                  </p>
                </div>
              </div>

              {/* 3. Visit Our Studio */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#F0ECE1] last:border-b-0 last:pb-0">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938] shadow-sm">
                  <Icons.MapPin className="w-5 h-5 text-[#0B1938]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0B1938]">
                    Visit Our Studio
                  </h3>
                  <p className="text-xs font-semibold text-[#0B1938] mt-0.5">
                    Lahore, Pakistan
                  </p>
                  <p className="text-[11px] text-[#64748B] font-sans mt-0.5">
                    By appointment only
                  </p>
                </div>
              </div>

              {/* 4. Live Chat */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938] shadow-sm">
                  <Icons.MessageSquare className="w-5 h-5 text-[#0B1938]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0B1938]">
                    Live Chat
                  </h3>
                  <p className="text-xs font-semibold text-[#0B1938] mt-0.5">
                    Chat with our team instantly
                  </p>
                  <p className="text-[11px] text-[#64748B] font-sans mt-0.5">
                    Available on our website
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Frequently Asked Questions Card */}
        <div className="bg-white border border-gray-200/80 rounded-[24px] p-7 sm:p-10 lg:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)] transition-all duration-300 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#F0ECE1] gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0B1938] leading-snug">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-[#64748B] font-sans font-normal mt-0.5">
                Find quick answers to the most common questions.
              </p>
            </div>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EFECE6] hover:bg-[#F8F6F0] text-[#0B1938] font-sans font-semibold text-xs transition-colors self-start sm:self-auto"
            >
              <span>View All FAQs</span>
              <Icons.ArrowRight className="w-3.5 h-3.5 text-[#0B1938]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <div key={idx} className="border-b border-[#F0ECE1] pb-3.5 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer py-1"
                >
                  <span className="font-sans text-xs sm:text-sm font-semibold text-[#0B1938] group-hover:text-amber-900 transition-colors pr-2">
                    {faq.question}
                  </span>
                  <Icons.ChevronDown
                    className={`w-4 h-4 text-[#64748B] transition-transform duration-200 flex-shrink-0 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="text-xs text-[#64748B] font-sans mt-2 leading-relaxed font-normal">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
