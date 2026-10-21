"use client";

import React, { useEffect, useState } from "react";
import SculptureHero, { SculptureHeroProps } from "@/components/ui/sculpture-hero";

export const Hero: React.FC<SculptureHeroProps> = ({
  showNav = false,
  showCredit = false,
  height,
  className = "",
  backdropText = "Perfume",
  eyebrow = "Haute Parfumerie — Paris & Grasse",
  headline = "Soulmate\nScents.",
  headlineAccent = "Scents.",
  body = "An olfactory signature crafted with rare botanicals, aged sandalwood, and precious amber resins — bespoke extraits de parfum composed to become your indelible aura.",
  primaryCta = { label: "Explore Creations", href: "/perfumes" },
  secondaryCta = { label: "Discovery Set", href: "/perfumes" },
  hint = "Move across the essence",
  hintTouch = "Touch the essence",
  background = "#FAF7EE",
  accentColor = "#590B16",
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
        {...props}
      />
    </div>
  );
};

export default Hero;
export { SculptureHero };
export type { SculptureHeroProps };

