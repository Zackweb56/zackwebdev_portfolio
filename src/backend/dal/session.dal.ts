import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/backend/auth/auth";

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  role: "admin";
  createdAt?: Date;
}

export interface AdminSessionData {
  user: AdminSessionUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

/**
 * Data Access Layer (DAL) — Session Verification
 *
 * Memoized per request using React cache() to prevent redundant DB calls
 * across nested Server Components, Layouts, and Actions.
 *
 * Security:
 *   - Guaranteed server-only execution via `import 'server-only'`
 *   - Validates session token against Better Auth
 *   - Enforces single-admin identity check
 */
export const verifySession = cache(
  async (): Promise<AdminSessionData | null> => {
    try {
      const headersList = await headers();
      const session = await auth.api.getSession({
        headers: headersList,
      });

      if (!session || !session.user) {
        return null;
      }

      // Check single-admin eligibility
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail && session.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
        // Not the designated admin
        return null;
      }

      return {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || "Administrator",
          role: "admin",
        },
        session: {
          id: session.session.id,
          userId: session.session.userId,
          expiresAt: session.session.expiresAt,
        },
      };
    } catch {
      return null;
    }
  }
);

/**
 * Enforces admin authentication on protected Server Components.
 * Redirects to /access_bz_admin if unauthenticated.
 */
export async function requireAdminAuth(): Promise<AdminSessionData> {
  const sessionData = await verifySession();

  if (!sessionData) {
    redirect("/access_bz_admin");
  }

  return sessionData;
}

/**
 * Enforces admin authentication on protected Route Handlers (API).
 * Returns null if unauthenticated (allowing API handler to return 401 JSON instead of 307 redirect).
 */
export async function requireAdminApiAuth(): Promise<AdminSessionData | null> {
  return verifySession();
}
