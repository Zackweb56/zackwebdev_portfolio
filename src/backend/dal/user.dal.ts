import "server-only";

import { cache } from "react";
import { verifySession, AdminSessionUser } from "./session.dal";
import { getDb } from "@/backend/db/mongodb";

/**
 * Data Access Layer (DAL) — User & Profile Access
 *
 * Enforces data isolation and authorization before querying MongoDB.
 */

export const getAdminProfile = cache(
  async (): Promise<AdminSessionUser | null> => {
    const session = await verifySession();
    if (!session) {
      return null;
    }

    try {
      const db = await getDb();
      const userDoc = await db.collection("user").findOne({ email: session.user.email });

      if (!userDoc) {
        return session.user;
      }

      return {
        id: userDoc._id.toString(),
        email: userDoc.email,
        name: userDoc.name || "Administrator",
        role: "admin",
        createdAt: userDoc.createdAt,
      };
    } catch {
      // Fall back to session user if DB read fails
      return session.user;
    }
  }
);
