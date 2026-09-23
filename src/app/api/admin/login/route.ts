import { NextResponse } from "next/server";
import { COOKIE_NAME, createAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || typeof body.password !== "string" || body.password !== configured) return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, createAdminToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60 * 8, path: "/" });
  return response;
}
