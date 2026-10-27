import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif"]);

export async function GET() {
  try {
    const perfumesDir = path.join(process.cwd(), "public", "images", "perfumes");
    if (!fs.existsSync(perfumesDir)) {
      return NextResponse.json({ success: true, images: [] });
    }

    const entries = fs.readdirSync(perfumesDir, { withFileTypes: true });
    const images = entries
      .filter((entry) => {
        if (!entry.isFile()) return false;
        const ext = path.extname(entry.name).toLowerCase();
        return IMAGE_EXTENSIONS.has(ext);
      })
      .map((entry) => {
        const fullPath = path.join(perfumesDir, entry.name);
        let stat;
        try {
          stat = fs.statSync(fullPath);
        } catch {
          stat = { size: 0, mtimeMs: 0 };
        }
        return {
          filename: entry.name,
          url: `/images/perfumes/${encodeURIComponent(entry.name)}`,
          size: stat.size,
          updatedAt: stat.mtimeMs,
        };
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);

    return NextResponse.json({
      success: true,
      images,
      total: images.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load perfume images";
    return NextResponse.json({ success: false, message, images: [] }, { status: 500 });
  }
}
