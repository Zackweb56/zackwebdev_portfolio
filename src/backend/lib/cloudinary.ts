import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary v2 singleton configuration.
 *
 * All keys are sourced exclusively from environment variables.
 * If any key is missing, the module throws at import time so misconfiguration
 * is caught immediately — never silently falls back to an empty string.
 *
 * Never expose CLOUDINARY_API_SECRET to the browser (BFF pattern enforced via
 * the server-side sign endpoint at /api/cloudinary/sign).
 */

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "[Cloudinary] Missing required environment variables: " +
      [
        !cloudName && "CLOUDINARY_CLOUD_NAME",
        !apiKey && "CLOUDINARY_API_KEY",
        !apiSecret && "CLOUDINARY_API_SECRET",
      ]
        .filter(Boolean)
        .join(", ")
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;

/** Allowed upload folders — validated server-side in sign endpoint */
export const ALLOWED_UPLOAD_FOLDERS = [
  "portfolio/profile",
  "portfolio/cv",
  "portfolio/projects",
] as const;

export type AllowedUploadFolder = (typeof ALLOWED_UPLOAD_FOLDERS)[number];

/** Allowed MIME types for profile images (server-side validation) */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

/** Allowed MIME types for CV files */
export const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/** Max file sizes */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_CV_BYTES = 10 * 1024 * 1024; // 10 MB

/** Validate that a returned Cloudinary URL belongs to this account */
export function isValidCloudinaryUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "res.cloudinary.com" &&
      parsed.pathname.startsWith(`/${cloudName}/`)
    );
  } catch {
    return false;
  }
}
