"use client";

import React from "react";
import StringTieFooter, { StringTieFooterProps } from "./StringTieFooter";

export interface FooterProps extends Partial<StringTieFooterProps> {
  className?: string;
}

export const Footer: React.FC<FooterProps> = (props) => {
  return (
    <StringTieFooter
      logo="/images/perfumes/soulmate_logo_transparent.png"
      meta={[]}
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
      height="clamp(580px, 88svh, 850px)"
      paper="#ffffff"
      grain={0}
      ink="#000000"
      panelBg="#3E060E"
      bodyInk="#EBE3D7"
      accent="#3E060E"
      buttonColor="#000000"
      cord="#000000"
      fontDisplay="var(--font-serif), 'Cormorant Garamond', 'Playfair Display', Georgia, serif"
      fontSans="var(--font-sans), 'Plus Jakarta Sans', sans-serif"
      fontScript="'Great Vibes', 'Playfair Display', 'Snell Roundhand', cursive"
      {...props}
    />
  );
};

export default Footer;
