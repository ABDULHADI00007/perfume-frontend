"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TiltCascadeCarousel, { TiltCascadeItem } from "@/components/ui/tilt-cascade-carousel";

interface PerfumeCascadeItem extends TiltCascadeItem {
  slug: string;
}

const cascadePerfumes: PerfumeCascadeItem[] = [
  {
    title: "Eternal Blaze",
    src: "/images/perfumes/amber-rivera.png",
    alt: "Eternal Blaze Flacon",
    slug: "eternal-blaze",
  },
  {
    title: "Vivid Desire",
    src: "/images/perfumes/vivid-desire.png",
    alt: "Vivid Desire Flacon",
    slug: "vivid-desire",
  },
  {
    title: "Oud Royale",
    src: "/images/perfumes/oyd_royal.png",
    alt: "Oud Royale Flacon",
    slug: "oud-royale",
  },
  {
    title: "Citrus Aura",
    src: "/images/perfumes/cirtus-revrie.png",
    alt: "Citrus Aura Flacon",
    slug: "citrus-aura",
  },
  {
    title: "Sultan's Veil",
    src: "/images/perfumes/sultan-veils.png",
    alt: "Sultan's Veil Flacon",
    slug: "sultans-veil",
  },
  {
    title: "Golden Serenity",
    src: "/images/perfumes/golden-senerity.png",
    alt: "Golden Serenity Flacon",
    slug: "golden-serenity",
  },
  {
    title: "Jardin Secret",
    src: "/images/perfumes/secret-garden.png",
    alt: "Jardin Secret Flacon",
    slug: "jardin-secret",
  },
  {
    title: "Noir Signature",
    src: "/images/perfumes/dusk.png",
    alt: "Noir Signature Flacon",
    slug: "noir-signature",
  },
  {
    title: "Whispers of Bloom",
    src: "/images/perfumes/whispers-bloom.jpg",
    alt: "Whispers of Bloom Flacon",
    slug: "whispers-of-bloom",
  },
];

export function TiltCascadeSection() {
  const router = useRouter();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleSelect = (item: TiltCascadeItem) => {
    const found = cascadePerfumes.find((p) => p.title === item.title);
    if (found) {
      router.push(`/perfumes/${found.slug}`);
    }
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!container) return;
          const rect = container.getBoundingClientRect();
          const totalScroll = rect.height - window.innerHeight;

          if (totalScroll <= 0) {
            ticking = false;
            return;
          }

          if (rect.top > 0) {
            // Above the section
            setActiveIndex((prev) => (prev !== 0 ? 0 : prev));
          } else if (-rect.top >= totalScroll) {
            // Past the section (reached the end)
            const lastIdx = cascadePerfumes.length - 1;
            setActiveIndex((prev) => (prev !== lastIdx ? lastIdx : prev));
          } else {
            // Inside the vertical scroll track
            const progress = -rect.top / totalScroll;
            const targetIdx = Math.min(
              cascadePerfumes.length - 1,
              Math.max(0, Math.floor(progress * cascadePerfumes.length))
            );
            setActiveIndex((prev) => (prev !== targetIdx ? targetIdx : prev));
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Tilt Cascade Fragrance Gallery"
      className="w-full relative z-10 isolate"
      style={{ height: "460vh" }}
    >
      <div className="sticky top-0 w-full h-screen min-h-[620px] max-h-[1080px] overflow-hidden flex items-center justify-center p-0 m-0 bg-[#FAF7EE] border-t border-b border-[#ECE5D8]/70">
        <TiltCascadeCarousel
          items={cascadePerfumes}
          height="100%"
          slideSize="clamp(280px, 64vmin, 580px)"
          angle={28}
          drop={0.46}
          inactiveScale={0.50}
          radius={28}
          bounce={0.2}
          duration={0.8}
          loop={false}
          autoplay={0}
          titles={true}
          captions={false}
          controls={true}
          index={activeIndex}
          onIndexChange={(idx) => setActiveIndex(idx)}
          onSelect={handleSelect}
          color="#121735"
          background="#FAF7EE"
          fontFamily='"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif'
          className="w-full h-full"
        />
      </div>
    </section>
  );
}

export default TiltCascadeSection;
