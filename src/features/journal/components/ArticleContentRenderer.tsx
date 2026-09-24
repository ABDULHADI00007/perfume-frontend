import React from "react";
import Image from "next/image";
import { parseContentToBlocks, ContentBlock } from "../utils/safeContent";

interface ArticleContentRendererProps {
  content: string;
  className?: string;
}

export const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({
  content,
  className = "",
}) => {
  const blocks = parseContentToBlocks(content);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div
      className={`prose prose-neutral max-w-none space-y-6 sm:space-y-8 font-sans ${className}`}
    >
      {blocks.map((block: ContentBlock, index: number) => {
        switch (block.type) {
          case "heading2":
            return (
              <h2
                key={index}
                className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight pt-4 first:pt-0 leading-snug"
              >
                {block.content}
              </h2>
            );

          case "heading3":
            return (
              <h3
                key={index}
                className="font-serif text-xl sm:text-2xl font-normal text-foreground tracking-tight pt-2 leading-snug"
              >
                {block.content}
              </h3>
            );

          case "blockquote":
            return (
              <blockquote
                key={index}
                className="my-6 sm:my-8 border-l-2 border-l-accent bg-accent-subtle/15 p-5 sm:p-6 italic"
              >
                <p className="font-serif text-lg sm:text-xl text-foreground font-normal leading-relaxed m-0">
                  “{block.content}”
                </p>
              </blockquote>
            );

          case "list":
            return (
              <ul
                key={index}
                className="space-y-2.5 my-4 sm:my-6 pl-5 text-sm sm:text-base text-foreground/90 font-light leading-relaxed list-disc"
              >
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "image":
            return (
              <figure key={index} className="my-8 sm:my-10">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-subtle border border-border">
                  <Image
                    src={block.src || "/images/perfumes/secret-garden.png"}
                    alt={block.alt || "Editorial Illustration"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </div>
                {block.alt && (
                  <figcaption className="mt-2 text-center text-xs text-foreground-muted font-sans font-light italic">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );

          case "paragraph":
          default:
            return (
              <p
                key={index}
                className="text-sm sm:text-base text-foreground/90 font-light leading-relaxed sm:leading-loose"
              >
                {block.content}
              </p>
            );
        }
      })}
    </div>
  );
};
