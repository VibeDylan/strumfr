import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export const verifySession = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return {
    userId: session.user.id,
    user: session.user,
    isAdmin: isAdminEmail(session.user.email),
  };
});

export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});
