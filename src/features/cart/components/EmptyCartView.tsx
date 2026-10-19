import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export const EmptyCartView: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 max-w-2xl mx-auto px-4 font-sans text-[#0B1938]">
      <Card variant="default" className="border border-[#E2DED6] bg-white p-8 sm:p-14 text-center shadow-xl">
        <CardContent className="space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FAF4E8] border border-[#F5EAD4] flex items-center justify-center mx-auto text-[#0B1938] shadow-sm">
            <Icons.Bag className="w-8 h-8 text-[#0B1938]" />
          </div>

          <Badge variant="accent">
            MAISON DE PARFUM
          </Badge>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1938] leading-tight tracking-tight">
            Your Shopping Bag is Empty
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] font-sans max-w-md mx-auto leading-relaxed">
            Discover handcrafted extraits de parfum, rare harvest distillations, and bespoke collections formulated for individual expression.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/perfumes" className="w-full sm:w-auto">
              <Button variant="default" size="lg" className="w-full sm:w-auto bg-[#0B1938]">
                Explore All Fragrances
              </Button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                About Our Maison
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

