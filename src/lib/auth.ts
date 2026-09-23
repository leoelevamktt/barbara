import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "barbara_admin";

function sign(value: string) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminToken() {
  const expires = Date.now() + 1000 * 60 * 60 * 8;
  const payload = `admin:${expires}`;
  return `${payload}:${sign(payload)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const [role, expiresRaw, signature] = parts;
  if (role !== "admin") return false;
  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  const payload = `${role}:${expiresRaw}`;
  const expected = sign(payload);
  if (!expected || signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE_NAME)?.value);
}

export { COOKIE_NAME };
