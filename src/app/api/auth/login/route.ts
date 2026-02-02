import { NextResponse } from "next/server";

/**
 * Server-side proxy to the auth backend.
 * This avoids browser CORS issues and keeps the backend URL configurable.
 */
export async function POST(req: Request) {
  const body = await req.json();

  const backendUrl =
    process.env.AUTH_API_URL ?? "http://23.27.186.134:8080/v1/auth/login";

  try {
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // Don't cache auth
      cache: "no-store",
    });

    const text = await res.text();
    // Try JSON parse, but don't crash if backend returns plain text.
    const data = (() => {
      try {
        return JSON.parse(text);
      } catch {
        return { raw: text };
      }
    })();

    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Auth request failed" },
      { status: 500 },
    );
  }
}
