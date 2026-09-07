import React from "react";

/**
 * Admin route group layout.
 *
 * This layout is shared by all routes under (admin)/:
 *   /admin, /admin/hero, /admin/profile, /admin/projects, etc.
 *   /access_bz_admin  ← classified admin login portal
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root relative w-full min-h-screen flex flex-col">
      {children}
    </div>
  );
}
