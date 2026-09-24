import React from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
