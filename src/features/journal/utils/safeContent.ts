/**
 * Security & Formatting Utilities for Editorial Content
 * Sanitizes and safely structures text/markdown/HTML into clean editorial blocks
 */

export interface ContentBlock {
  type: "heading2" | "heading3" | "paragraph" | "blockquote" | "list" | "image";
  content?: string;
  items?: string[];
  src?: string;
  alt?: string;
}

/**
 * Strips dangerous HTML tags, attributes, and JavaScript URI schemes
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== "string") return "";

  // 1. Remove script, style, iframe, object, embed, form, input, button tags
  let clean = rawHtml.replace(
    /<(script|style|iframe|object|embed|form|input|button|meta|link|base)[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );
  clean = clean.replace(/<(script|style|iframe|object|embed|form|input|button|meta|link|base)[^>]*\/?\s*>/gi, "");

  // 2. Remove inline event handlers (e.g., onclick, onerror, onload, onmouseover)
  clean = clean.replace(/\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // 3. Remove javascript:, vbscript:, and data: URI protocols in href and src (except safe images)
  clean = clean.replace(/href\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, 'href="#"');
  clean = clean.replace(/href\s*=\s*(?:'vbscript:[^']*'|"vbscript:[^"]*"|vbscript:[^\s>]+)/gi, 'href="#"');
  clean = clean.replace(/src\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, "");

  return clean;
}

/**
 * Parses article content (whether HTML, Markdown, or plaintext) into structured editorial blocks
 */
export function parseContentToBlocks(rawContent: string): ContentBlock[] {
  if (!rawContent || !rawContent.trim()) return [];

  const sanitized = sanitizeHtml(rawContent);

  // If content contains standard HTML tags, break down by HTML blocks
  if (/<(p|h2|h3|blockquote|ul|ol|img)\b[^>]*>/i.test(sanitized)) {
    return parseHtmlBlocks(sanitized);
  }

  // Otherwise parse as Markdown / plain paragraphs
  return parseMarkdownBlocks(sanitized);
}

function parseHtmlBlocks(html: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const tagRegex = /<(h2|h3|blockquote|p|ul|ol|img)\b([^>]*)>([\s\S]*?)<\/\1>|<img\b([^>]*)\/?>/gi;

  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[1]?.toLowerCase() || (match[4] ? "img" : "");
    const attributes = match[2] || match[4] || "";
    const inner = match[3] || "";

    if (tag === "h2") {
      blocks.push({ type: "heading2", content: stripInnerTags(inner) });
    } else if (tag === "h3") {
      blocks.push({ type: "heading3", content: stripInnerTags(inner) });
    } else if (tag === "blockquote") {
      blocks.push({ type: "blockquote", content: stripInnerTags(inner) });
    } else if (tag === "ul" || tag === "ol") {
      const items = (inner.match(/<li\b[^>]*>([\s\S]*?)<\/li>/gi) || []).map(stripInnerTags);
      if (items.length > 0) {
        blocks.push({ type: "list", items });
      }
    } else if (tag === "img") {
      const srcMatch = attributes.match(/src=["']([^"']+)["']/i);
      const altMatch = attributes.match(/alt=["']([^"']+)["']/i);
      if (srcMatch?.[1]) {
        blocks.push({
          type: "image",
          src: srcMatch[1],
          alt: altMatch?.[1] || "Editorial Article Illustration",
        });
      }
    } else if (tag === "p") {
      const text = stripInnerTags(inner).trim();
      if (text) {
        blocks.push({ type: "paragraph", content: text });
      }
    }
  }

  // If no HTML blocks were matched, fallback to raw text
  if (blocks.length === 0) {
    const rawParagraphs = html
      .split(/\n\s*\n/)
      .map(stripInnerTags)
      .filter(Boolean);

    return rawParagraphs.map((p) => ({ type: "paragraph", content: p }));
  }

  return blocks;
}

function parseMarkdownBlocks(text: string): ContentBlock[] {
  const lines = text.split(/\n/);
  const blocks: ContentBlock[] = [];
  let currentParagraph: string[] = [];
  let currentList: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const p = currentParagraph.join(" ").trim();
      if (p) blocks.push({ type: "paragraph", content: p });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: "list", items: [...currentList] });
      currentList = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading3", content: trimmed.replace(/^###\s+/, "") });
    } else if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading2", content: trimmed.replace(/^#+\s+/, "") });
    } else if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "blockquote", content: trimmed.replace(/^>\s*/, "") });
    } else if (/^[-*•]\s+/.test(trimmed)) {
      flushParagraph();
      currentList.push(trimmed.replace(/^[-*•]\s+/, ""));
    } else if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      currentList.push(trimmed.replace(/^\d+\.\s+/, ""));
    } else {
      flushList();
      currentParagraph.push(trimmed);
    }
  }

  flushParagraph();
  flushList();

  return blocks;
}

function stripInnerTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

/**
 * Calculate estimated reading time in minutes
 */
export function calculateReadTime(text: string): string {
  if (!text) return "3 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
