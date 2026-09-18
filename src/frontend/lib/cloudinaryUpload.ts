/**
 * Cloudinary Client-Side Upload Utility (BFF Pattern)
 *
 * Requests a time-limited signature from /api/cloudinary/sign, then uploads
 * directly from the browser to Cloudinary's auto/upload API.
 * Never exposes the Cloudinary API secret to the client.
 *
 * Returns both `secureUrl` and `publicId` so callers can store the
 * public_id for future deletion/replacement (Cloudinary cleanup-on-replace).
 */

export interface UploadProgressCallback {
  (percentage: number): void;
}

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

export async function uploadToCloudinary(
  file: File,
  folder: "portfolio/profile" | "portfolio/cv" | "portfolio/projects",
  onProgress?: UploadProgressCallback
): Promise<CloudinaryUploadResult> {
  // 1. Request signature from server BFF
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });

  if (!signRes.ok) {
    const err = await signRes.json().catch(() => ({ error: "Signing failed" }));
    throw new Error(err.error || `Failed to sign upload (status ${signRes.status})`);
  }

  const { signature, timestamp, apiKey, cloudName } = await signRes.json();

  // 2. Prepare FormData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  // 3. Upload to Cloudinary auto upload endpoint with progress support
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.secure_url && res.public_id) {
            resolve({ secureUrl: res.secure_url, publicId: res.public_id });
          } else {
            reject(new Error("No secure_url / public_id returned by Cloudinary"));
          }
        } catch (e: any) {
          reject(new Error("Failed to parse Cloudinary response: " + e.message));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes?.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload"));
    };

    xhr.send(formData);
  });
}

