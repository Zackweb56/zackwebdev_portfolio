import { requireAdminAuth } from "@/backend/dal";
import { AdminDashboardShell } from "@/frontend/components/admin/AdminDashboardShell";

/**
 * /admin — Classified Master Administration Portal
 *
 * Security:
 *   - Strictly guarded by the Data Access Layer (`requireAdminAuth()`).
 *   - Unauthenticated visitors are immediately redirected to `/access_bz_admin`.
 *   - Authenticated administrators receive the full classified Content Manager Workstation.
 */
export default async function AdminPage() {
  // DAL Security Gate: throws redirect('/access_bz_admin') if unauthenticated
  const sessionData = await requireAdminAuth();

  return <AdminDashboardShell user={sessionData.user} />;
}
