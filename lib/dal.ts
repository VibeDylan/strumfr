import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const verifySession = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return { userId: session.user.id, user: session.user };
});

export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});
