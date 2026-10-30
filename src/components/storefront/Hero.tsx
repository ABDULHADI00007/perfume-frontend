"use client";

import React, { useEffect, useState } from "react";
import SculptureHero, { SculptureHeroProps } from "@/components/ui/sculpture-hero";

export const Hero: React.FC<SculptureHeroProps> = ({
  src = "/images/hero/perfume_splash_center_nobg.png",
  mobileSrc = "/images/hero/perfume_splash_center_mobile.png",
  showNav = false,
  showCredit = false,
  height,
  className = "",
  backdropText = "",
  eyebrow = "HAUTE PARFUMERIE — PARIS & GRASSE",
  headline = "SOULMATE\nSCENTS.",
  headlineAccent = "SCENTS.",
  body = "An olfactory signature crafted with rare botanicals, aged sandalwood, and precious amber resins — bespoke extraits de parfum composed to become your indelible aura.",
  primaryCta = { label: "EXPLORE CREATIONS", href: "/perfumes" },
  secondaryCta = { label: "DISCOVERY SET", href: "/perfumes" },
  hint = "Move across the essence",
  hintTouch = "Touch the essence",
  background = "#FAF7EE",
  accentColor = "#590B16",
  sculptureScale = 1.18,
  mobileSculptureScale = 1.15,
  sculptureY = 3.5,
  mobileSculptureY = 2.5,
  ...props
}) => {
  // Dynamically compute hero height so the hero + announcement bar + header fit within viewport without scrolling
  const [computedHeight, setComputedHeight] = useState<string>(height || "calc(100svh - 102px)");

  useEffect(() => {
    if (height) {
      setComputedHeight(height);
      return;
    }

    const calcAvailableHeight = () => {
      const headerEl = document.querySelector("header");
      const asideEl = document.querySelector("aside");
      const headerH = headerEl ? headerEl.offsetHeight : 0;
      const asideH = asideEl ? asideEl.offsetHeight : 0;
      const totalOffset = (headerH + asideH) || 102;
      setComputedHeight(`calc(100svh - ${totalOffset}px)`);
    };

    calcAvailableHeight();
    window.addEventListener("resize", calcAvailableHeight);
    return () => window.removeEventListener("resize", calcAvailableHeight);
  }, [height]);

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <SculptureHero
        src={src}
        mobileSrc={mobileSrc}
        showNav={showNav}
        showCredit={showCredit}
        height={computedHeight}
        backdropText={backdropText}
        eyebrow={eyebrow}
        headline={headline}
        headlineAccent={headlineAccent}
        body={body}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        hint={hint}
        hintTouch={hintTouch}
        background={background}
        accentColor={accentColor}
        sculptureScale={sculptureScale}
        mobileSculptureScale={mobileSculptureScale}
        sculptureY={sculptureY}
        mobileSculptureY={mobileSculptureY}
        headingFont="'Cinzel', 'Marcellus', serif"
        accentFont="'Cinzel', 'Marcellus', serif"
        {...props}
      />
    </div>
  );
};

export default Hero;
export { SculptureHero };
export type { SculptureHeroProps };

