import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/environment";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Call backend login endpoint
    const backendRes = await fetch(`${env.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message || "Invalid email or password." },
        { status: backendRes.status || 401 }
      );
    }

    // Extract token from response body or set-cookie header
    let token = data.data?.token || data.token;

    if (!token) {
      const setCookie = backendRes.headers.get("set-cookie") || "";
      const match =
        setCookie.match(/perfume_auth_token=([^;]+)/) ||
        setCookie.match(/admin_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      data: {
        user: data.data?.user || data.user,
        token: token || "",
      },
    });

    // Set first-party cookies on the current domain
    if (token) {
      const isHttps = request.nextUrl.protocol === "https:";
      const cookieOptions = {
        httpOnly: true,
        secure: isHttps,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      };

      response.cookies.set("admin_token", token, cookieOptions);
      response.cookies.set("perfume_auth_token", token, cookieOptions);
    }

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to connect to authentication server";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

