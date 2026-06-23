"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { env } from "./env";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000;
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString("hex");

function hashToken(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const payload = `${env.admin.email}:${env.admin.password}:${timestamp}`;
  return `${timestamp}.${hashToken(payload)}`;
}

function verifySessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, hash] = parts;
  if (Date.now() - Number(timestamp) > SESSION_MAX_AGE) return false;
  const expected = hashToken(`${env.admin.email}:${env.admin.password}:${timestamp}`);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expected));
}

export async function setAdminSession() {
  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE / 1000,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !verifySessionToken(token)) {
    redirect("/admin/login");
  }
}
