"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/backend/auth/auth";

const LoginSchema = z.object({
  email: z.string().trim().email("Invalid access identifier format").max(255),
  password: z.string().min(1, "Security key is required").max(128),
});

export type LoginActionState = {
  success: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

/**
 * Server Action for Administrator Login
 *
 * Security:
 *   1. Strict Zod input schema validation
 *   2. Authenticates purely against real existing user in MongoDB Atlas via Better Auth
 *   3. Zero auto-registration / zero plaintext password checks
 *   4. Uniform error responses preventing account enumeration
 *   5. Issues secure HttpOnly cookie session
 */
export async function loginAdminAction(
  prevState: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> {
  const rawEmail = formData.get("email")?.toString().trim() || "";
  const rawPassword = formData.get("password")?.toString() || "";

  // 1. Validate input schema
  const validation = LoginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid clearance parameters provided",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;

  try {
    const headersList = await headers();

    // Authenticate directly against the real user record in MongoDB Atlas
    const authResult = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: headersList,
    });

    if (!authResult || !authResult.user) {
      return {
        success: false,
        error: "ACCESS_DENIED: Invalid identifier or security key",
      };
    }

    return { success: true };
  } catch {
    // Return sanitized generic access denied to prevent enumeration
    return {
      success: false,
      error: "ACCESS_DENIED: Invalid identifier or security key",
    };
  }
}

/**
 * Server Action for Administrator Logout
 */
export async function logoutAdminAction(): Promise<{ success: boolean }> {
  try {
    const headersList = await headers();
    await auth.api.signOut({
      headers: headersList,
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
