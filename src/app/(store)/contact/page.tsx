"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

const SUBJECT_OPTIONS = [
  { label: "Select a subject", value: "" },
  { label: "General Inquiry", value: "General Inquiry" },
  { label: "Fragrance Recommendation", value: "Fragrance Recommendation" },
  { label: "Order Support", value: "Order Support" },
  { label: "Bespoke Gifting", value: "Bespoke Gifting" },
  { label: "Wholesale & Corporate", value: "Wholesale" },
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
    <main className="bg-[#FAF9F6] text-[#0B1938] min-h-screen py-8 sm:py-14 font-sans selection:bg-[#D4ADFC]/20">
      <Container size="wide">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs font-sans text-[#8E95A2] mb-6 flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0B1938] transition-colors flex items-center gap-1">
            <span>Home</span>
          </Link>
          <span className="text-[#C5A880]">&gt;</span>
          <span className="text-[#0B1938] font-semibold">Contact Us</span>
        </nav>

        {/* Header Section */}
        <div className="mb-10 sm:mb-14">
          <Badge variant="accent" className="mb-3">
            <Icons.Mail className="w-3 h-3 mr-1.5 text-[#C5A880]" />
            CONCIERGE & SUPPORT
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1938] tracking-tight leading-tight">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-sans font-normal mt-2 max-w-2xl leading-relaxed">
            Have a question about our fragrances, need help with an order, or looking for a personalized recommendation? Our concierge team is here to assist you.
          </p>
        </div>

        {/* 2-Column Main Contact Grid using shadcn Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Card: Send Us a Message (8 cols) */}
          <Card variant="default" className="lg:col-span-8 border border-[#E2DED6] bg-white p-2 sm:p-4">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1938]">
                Send Us a Message
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-[#64748B]">
                Fill out the form below and our scent concierges will respond within 24 hours.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {status === "success" ? (
                <div className="p-8 sm:p-10 bg-[#FAF4E8] rounded-2xl border border-[#F5EAD4] text-center space-y-4">
                  <div className="w-14 h-14 bg-[#0B1938] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Icons.Check className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B1938]">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5A3E] font-sans leading-relaxed max-w-md mx-auto">
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
                      placeholder="+92 300 1234567"
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
                    className="w-full min-h-[48px] shadow-md bg-[#0B1938] hover:bg-[#131F37]"
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
              <CardTitle className="font-serif text-2xl font-bold text-[#0B1938]">
                Contact Channels
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Reach our team directly through your preferred channel.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* 1. Email Us */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#F0ECE1]">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938]">
                  <Icons.Mail className="w-5 h-5 text-[#0B1938]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0B1938]">Email Concierge</h3>
                  <p className="text-xs font-semibold text-[#0B1938] mt-0.5">support@soulmatescents.com</p>
                  <p className="text-[11px] text-[#64748B] font-sans mt-0.5">Replies within 24 hours</p>
                </div>
              </div>

              {/* 2. Call Us */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#F0ECE1]">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938]">
                  <Icons.Phone className="w-5 h-5 text-[#0B1938]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0B1938]">Call Us</h3>
                  <p className="text-xs font-semibold text-[#0B1938] mt-0.5">+92 300 1234567</p>
                  <p className="text-[11px] text-[#64748B] font-sans mt-0.5">Mon – Sat, 10:00 AM – 7:00 PM</p>
                </div>
              </div>

              {/* 3. Visit Our Studio */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#F0ECE1]">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938]">
                  <Icons.MapPin className="w-5 h-5 text-[#0B1938]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0B1938]">Maison Studio</h3>
                  <p className="text-xs font-semibold text-[#0B1938] mt-0.5">Lahore, Pakistan</p>
                  <p className="text-[11px] text-[#64748B] font-sans mt-0.5">By appointment only</p>
                </div>
              </div>

              {/* 4. Live Chat */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center flex-shrink-0 text-[#0B1938]">
                  <Icons.MessageSquare className="w-5 h-5 text-[#0B1938]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0B1938]">Instant Live Chat</h3>
                  <p className="text-xs font-semibold text-[#0B1938] mt-0.5">Available on website</p>
                  <p className="text-[11px] text-[#64748B] font-sans mt-0.5">Instant olfactory assistance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Frequently Asked Questions Card using shadcn Card */}
        <Card variant="default" className="border border-[#E2DED6] bg-white mt-10 p-2 sm:p-4">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0ECE1] gap-4">
            <div>
              <CardTitle className="font-serif text-2xl font-bold text-[#0B1938]">
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B] mt-0.5">
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
                    <span className="font-sans text-xs sm:text-sm font-semibold text-[#0B1938] group-hover:text-[#C5A880] transition-colors pr-2">
                      {faq.question}
                    </span>
                    <Icons.ChevronDown
                      className={`w-4 h-4 text-[#64748B] transition-transform duration-200 flex-shrink-0 ${
                        openFaq === idx ? "rotate-180 text-[#C5A880]" : ""
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
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}

