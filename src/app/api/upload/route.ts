import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { env } from "@/config/environment";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB ceiling
const ALLOWED_ROLES = ["superadmin", "admin", "scent_specialist"];

/**
 * Validates magic bytes/file signatures to strictly permit only authentic raster images.
 * Explicitly rejects SVG, HTML, JavaScript, ELF/PE executables, and polyglots.
 */
function detectSafeImageSignature(buffer: Buffer): { ext: string; mime: string } | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: ".jpg", mime: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { ext: ".png", mime: "image/png" };
  }

  // WEBP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { ext: ".webp", mime: "image/webp" };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Mandatory Authentication & Authorization Check
    const cookieToken = request.cookies.get("admin_token")?.value;
    const authHeader = request.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required: Anonymous uploads are prohibited.",
        },
        { status: 401 }
      );
    }

    // Verify token with backend authoritative auth service
    try {
      const authUrl = `${env.apiUrl}/auth/me`;
      const authRes = await fetch(authUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `admin_token=${token}`,
        },
        cache: "no-store",
      });

      if (!authRes.ok) {
        return NextResponse.json(
          {
            success: false,
            message: "Authentication failed: Session is invalid or has expired.",
          },
          { status: 401 }
        );
      }

      const authData = await authRes.json();
      const user = authData?.data || authData?.user;

      if (!user || !ALLOWED_ROLES.includes(user.role)) {
        return NextResponse.json(
          {
            success: false,
            message: "Permission denied: Account lacks required product management authorization.",
          },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication gateway unreachable. Upload aborted.",
        },
        { status: 503 }
      );
    }

    // 2. Parse and Validate Form Payload
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided for upload." },
        { status: 400 }
      );
    }

    // 3. Strict File Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: "File exceeds the maximum permitted limit of 5 MB.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: "Buffer payload exceeds the maximum permitted limit of 5 MB.",
        },
        { status: 400 }
      );
    }

    // 4. File Signature & Magic Byte Verification (Rejects SVG, HTML, Scripts, Executables)
    const detected = detectSafeImageSignature(buffer);
    if (!detected) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid file format. Only verified binary JPEG, PNG, and WebP images are permitted (SVG and script formats are strictly rejected).",
        },
        { status: 400 }
      );
    }

    // 5. Server-Controlled Filename & Path Traversal Prevention
    const uploadDir = path.join(process.cwd(), "public", "images", "perfumes");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const safeFilename = `${Date.now()}_${randomSuffix}${detected.ext}`;
    const targetPath = path.resolve(uploadDir, safeFilename);

    // Verify canonical path resides strictly inside uploadDir
    if (!targetPath.startsWith(path.resolve(uploadDir))) {
      return NextResponse.json(
        { success: false, message: "Security error: Path traversal detected." },
        { status: 400 }
      );
    }

    // Write verified binary buffer to disk
    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/images/perfumes/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      mimeType: detected.mime,
      size: buffer.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal image upload error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
