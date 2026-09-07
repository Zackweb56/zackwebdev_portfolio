import { auth } from "@/backend/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth Route Handler
 *
 * Handles auth endpoints: /api/auth/sign-in/email, /api/auth/sign-out, /api/auth/session, etc.
 */
export const { GET, POST } = toNextJsHandler(auth.handler);
