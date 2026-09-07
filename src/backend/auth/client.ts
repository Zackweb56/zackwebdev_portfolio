"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client Instance
 *
 * Used by client components for signing in, signing out, and accessing session state.
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
});

export const { signIn, signOut, useSession, getSession } = authClient;
