import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Verify it is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files (PNG, JPG, WEBP) are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "images", "perfumes");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize filename
    const ext = path.extname(file.name) || ".png";
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_")
      .slice(0, 50);

    let finalFilename = `${baseName}${ext}`;
    const targetPath = path.join(uploadDir, finalFilename);

    // If file exists with same name, add timestamp to prevent accidental overwrite
    if (fs.existsSync(targetPath)) {
      finalFilename = `${baseName}_${Date.now()}${ext}`;
    }

    const finalPath = path.join(uploadDir, finalFilename);
    fs.writeFileSync(finalPath, buffer);

    const publicUrl = `/images/perfumes/${finalFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: finalFilename,
      size: buffer.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Image upload failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
