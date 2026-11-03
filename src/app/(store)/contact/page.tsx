"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ContactSkeleton } from "./ContactSkeleton";

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
    answer: "Yes, every order includes complimentary signature Soulmate Scents packaging, a travel pouch, and handwritten gift notes upon request.",
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

const SUBJECT_OPTIONS = [
  { label: "Select a subject", value: "" },
  { label: "General Inquiry", value: "General Inquiry" },
  { label: "Fragrance Recommendation", value: "Fragrance Recommendation" },
  { label: "Order Support", value: "Order Support" },
  { label: "Bespoke Gifting", value: "Bespoke Gifting" },
  { label: "Wholesale & Corporate", value: "Wholesale" },
];

export default function ContactPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return <ContactSkeleton />;
  }

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
    <main className="bg-[#FAF9F6] text-black min-h-screen py-8 sm:py-14 font-sans selection:bg-[#590B16]/20">
      <Container size="wide">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs font-sans text-stone-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
            <span>Home</span>
          </Link>
          <span className="text-[#C5A880]">&gt;</span>
          <span className="text-black font-semibold">Contact Us</span>
        </nav>

        {/* Header Section */}
        <div className="mb-10 sm:mb-14">
          <Badge variant="accent" className="mb-3 bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20">
            <Icons.Mail className="w-3 h-3 mr-1.5 text-[#590B16]" />
            CONCIERGE & SUPPORT
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-xs sm:text-sm text-black/80 font-sans font-normal mt-2 max-w-2xl leading-relaxed">
            Have a question about our fragrances, need help with an order, or looking for a personalized recommendation? Our concierge team is here to assist you.
          </p>
        </div>

        {/* 2-Column Main Contact Grid using shadcn Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Card: Send Us a Message (8 cols) */}
          <Card variant="default" className="lg:col-span-8 border border-[#E2DED6] bg-white p-2 sm:p-4">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-2xl sm:text-3xl font-bold text-black">
                Send Us a Message
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-black/70">
                Fill out the form below and our scent concierges will respond within 24 hours.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {status === "success" ? (
                <div className="p-8 sm:p-10 bg-[#FAF4E8] rounded-2xl border border-[#F5EAD4] text-center space-y-4">
                  <div className="w-14 h-14 bg-[#590B16] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Icons.Check className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-black">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-black/80 font-sans leading-relaxed max-w-md mx-auto">
                    Thank you for reaching out to Soulmate Scents. Our team will review your inquiry and get back to you shortly.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-xs font-bold"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name *"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />

                    <Input
                      label="Email Address *"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  {/* Row 2: Phone Number & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+92 333 7615355"
                    />

                    <Select
                      label="Subject *"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      options={SUBJECT_OPTIONS}
                      required
                    />
                  </div>

                  {/* Row 3: Message Textarea */}
                  <div className="relative">
                    <Textarea
                      label="Your Message *"
                      name="message"
                      rows={5}
                      maxLength={500}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      required
                    />
                    <span className="absolute bottom-3 right-3 text-[10px] text-[#94A3B8] font-sans font-medium pointer-events-none">
                      {form.message.length}/500
                    </span>
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-red-600 font-sans font-medium">
                      Please fill out all required fields before submitting.
                    </p>
                  )}

                  {/* Submit Button using shadcn Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={status === "loading"}
                    rightIcon={!status && <Icons.ArrowRight className="w-4 h-4" />}
                    className="w-full min-h-[48px] shadow-md bg-[#590B16] hover:bg-[#3E060E] text-white font-serif uppercase tracking-[0.18em] text-xs font-bold"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Right Card: Contact Information (4 cols) using shadcn Card */}
          <Card variant="default" className="lg:col-span-4 border border-[#E2DED6] bg-white p-2 sm:p-4">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-2xl font-bold text-black">
                Contact Channels
              </CardTitle>
              <CardDescription className="text-xs text-black/70">
                Reach our team directly through your preferred channel.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* 1. Email Us */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#F0ECE1]">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#590B16]">
                  <Icons.Mail className="w-5 h-5 text-[#590B16]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-black">Email Concierge</h3>
                  <a href="mailto:soulmatescents@gmail.com" className="text-xs font-semibold text-black hover:text-[#590B16] transition-colors mt-0.5 block">
                    soulmatescents@gmail.com
                  </a>
                  <p className="text-[11px] text-stone-500 font-sans mt-0.5">Replies within 24 hours</p>
                </div>
              </div>

              {/* 2. Call Us */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#F0ECE1]">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#590B16]">
                  <Icons.Phone className="w-5 h-5 text-[#590B16]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-black">Call Us</h3>
                  <a href="tel:+923337615355" className="text-xs font-semibold text-black hover:text-[#590B16] transition-colors mt-0.5 block">
                    +92 333 7615355
                  </a>
                  <p className="text-[11px] text-stone-500 font-sans mt-0.5">Mon – Sat, 10:00 AM – 7:00 PM</p>
                </div>
              </div>

              {/* 3. Visit Our Studio */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#F0ECE1]">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#590B16]">
                  <Icons.MapPin className="w-5 h-5 text-[#590B16]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-black">Soulmate Scents Studio</h3>
                  <p className="text-xs font-semibold text-black mt-0.5">Karachi, Pakistan</p>
                  <p className="text-[11px] text-stone-500 font-sans mt-0.5">By appointment only</p>
                </div>
              </div>

              {/* 4. Live Chat */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#590B16]">
                  <svg className="w-5 h-5 text-[#590B16]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.39C16.32 14.27 15.1 13.67 14.87 13.58C14.65 13.5 14.48 13.46 14.32 13.71C14.15 13.96 13.67 14.52 13.52 14.69C13.38 14.85 13.23 14.88 12.98 14.75C12.73 14.63 11.93 14.36 10.98 13.52C10.24 12.86 9.74 12.05 9.6 11.8C9.45 11.55 9.58 11.42 9.71 11.29C9.82 11.18 9.96 11 10.08 10.86C10.21 10.72 10.25 10.62 10.33 10.45C10.41 10.29 10.37 10.14 10.31 10.02C10.25 9.9 9.75 8.68 9.55 8.17C9.35 7.68 9.14 7.74 8.99 7.73C8.84 7.72 8.67 7.72 8.51 7.72C8.34 7.72 8.07 7.78 7.84 8.03C7.62 8.28 6.98 8.87 6.98 10.08C6.98 11.29 7.86 12.46 7.99 12.62C8.11 12.79 9.73 15.28 12.21 16.35C12.8 16.61 13.26 16.76 13.62 16.87C14.21 17.06 14.75 17.03 15.18 16.97C15.66 16.9 16.65 16.37 16.86 15.79C17.06 15.2 17.06 14.71 17 14.6C16.94 14.49 16.82 14.42 16.57 14.39Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-black">Instant Live Chat</h3>
                  <a
                    href="https://wa.me/923337615355"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-black hover:text-[#590B16] transition-colors mt-0.5 block"
                  >
                    Available on WhatsApp
                  </a>
                  <p className="text-[11px] text-stone-500 font-sans mt-0.5">Instant olfactory assistance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Frequently Asked Questions Card using shadcn Card */}
        <Card variant="default" className="border border-[#E2DED6] bg-white mt-10 p-2 sm:p-4">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0ECE1] gap-4">
            <div>
              <CardTitle className="font-serif text-2xl font-bold text-black">
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className="text-xs text-black/70 mt-0.5">
                Quick answers to the most common queries about our scents & delivery.
              </CardDescription>
            </div>
            <Link href="/faq">
              <Button variant="outline" size="sm" rightIcon={<Icons.ArrowRight className="w-3.5 h-3.5" />}>
                View All FAQs
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {FAQ_ITEMS.map((faq, idx) => (
                <div key={idx} className="border-b border-[#F0ECE1] pb-3.5 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left group cursor-pointer py-1"
                  >
                    <span className="font-sans text-xs sm:text-sm font-semibold text-black group-hover:text-[#590B16] transition-colors pr-2">
                      {faq.question}
                    </span>
                    <Icons.ChevronDown
                      className={`w-4 h-4 text-stone-500 transition-transform duration-200 flex-shrink-0 ${openFaq === idx ? "rotate-180 text-[#590B16]" : ""
                        }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs text-black/80 font-sans mt-2 leading-relaxed font-normal">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}

