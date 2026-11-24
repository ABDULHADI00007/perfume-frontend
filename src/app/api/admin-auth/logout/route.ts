import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/environment";

export async function POST(request: NextRequest) {
  try {
    const token =
      request.cookies.get("admin_token")?.value ||
      request.cookies.get("perfume_auth_token")?.value;

    // Best-effort backend notification
    if (token) {
      await fetch(`${env.apiUrl}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `admin_token=${token}; perfume_auth_token=${token}`,
        },
      }).catch(() => {});
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear local cookies
    response.cookies.delete("admin_token");
    response.cookies.delete("perfume_auth_token");

    return response;
  } catch {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("admin_token");
    response.cookies.delete("perfume_auth_token");
    return response;
  }
}

