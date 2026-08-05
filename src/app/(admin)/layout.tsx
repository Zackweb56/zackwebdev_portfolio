/**
 * Admin route group layout.
 *
 * This layout is shared by all routes under (admin)/:
 *   /admin, /admin/hero, /admin/profile, /admin/projects, etc.
 *   /login  ← also part of this group but intentionally has no sidebar
 *
 * Authentication guard (middleware.ts) will be added in Phase 9.
 * UI shell (sidebar, top bar) will be built in Task 10.1.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#0a0a0a",
          color: "#e5e5e5",
          minHeight: "100vh",
        }}
      >
        {/* Admin shell will replace this placeholder in Task 10.1 */}
        {children}
      </body>
    </html>
  );
}
