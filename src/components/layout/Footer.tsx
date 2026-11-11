"use client";

import React from "react";
import StringTieFooter, { StringTieFooterProps } from "./StringTieFooter";

export interface FooterProps extends Partial<StringTieFooterProps> {
  className?: string;
}

export const Footer: React.FC<FooterProps> = (props) => {
  return (
    <StringTieFooter
      logo="/images/perfumes/soulmate_logo_transparent.webp"
      meta={[]}
      title="Thank"
      titleAccent="You"
      tapes={["Soulmate Scents", "Essence of Unbreakable Bonds"]}
      email="soulmatescents@gmail.com"
      phone="+92 333 7615355"
      links={[
        {
          label: "instagram.com/soulmatescents",
          href: "https://www.instagram.com/soulmatescents?vrfl=MWc1YTY4MGVuNWpyaw==",
        },
        {
          label: "facebook.com/soulmatescents",
          href: "https://www.facebook.com/share/1EGXnZi5TC/",
        },
        {
          label: "tiktok.com/@soulmatescent",
          href: "https://www.tiktok.com/@soulmatescent?_r=1&_t=ZS-9B2nSnXPVvL",
        },
      ]}
      regards="Warm Regards,"
      signatureLabel="Signed, Hadi"
      note={{
        kicker: "A letter from Soulmate Scents",
        text: "Crafting timeless memories through luxury perfumery. Have an inquiry, custom fragrance request, or wish to connect? Our concierge is always delighted to assist you.",
        cta: "FAQ / Q&A",
        href: "/faq",
      }}
      height="clamp(500px, 74svh, 700px)"
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
