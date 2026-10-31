"use client";

import React from "react";
import StringTieFooter, { StringTieFooterProps } from "./StringTieFooter";

export interface FooterProps extends Partial<StringTieFooterProps> {
  className?: string;
}

export const Footer: React.FC<FooterProps> = (props) => {
  return (
    <StringTieFooter
      meta={["Soulmate Scents", "Artisanal Parfumerie", "Pure Luxury"]}
      title="Thank"
      titleAccent="You"
      tapes={["Soulmate Scents", "Essence of Unbreakable Bonds"]}
      email="hadi@soulmatescents.com"
      phone="+92 300 1234567"
      links={[
        { label: "instagram.com/soulmatescents", href: "https://instagram.com" },
        { label: "facebook.com/soulmatescents", href: "https://facebook.com" },
        { label: "tiktok.com/@soulmatescents", href: "https://tiktok.com" },
      ]}
      regards="Warm Regards,"
      signatureLabel="Signed, Hadi"
      note={{
        kicker: "A letter from Hadi",
        text: "Crafting timeless memories through luxury perfumery. Have an inquiry, custom fragrance request, or wish to connect? Our concierge is always delighted to assist you.",
        cta: "Write to Hadi",
      }}
      height="100svh"
      paper="#FAF8F5"
      ink="#060B16"
      bodyInk="#EBE3D7"
      accent="#590B16"
      cord="#7A0F1F"
      fontDisplay="var(--font-serif), 'Cormorant Garamond', 'Playfair Display', Georgia, serif"
      fontSans="var(--font-sans), 'Plus Jakarta Sans', sans-serif"
      fontScript="'Great Vibes', 'Playfair Display', 'Snell Roundhand', cursive"
      {...props}
    />
  );
};

export default Footer;
