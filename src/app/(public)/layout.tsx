import React from "react";
import { PublicLayoutShell } from "@/frontend/components/layout/PublicLayoutShell";

/**
 * Public Layout
 *
 * Wraps only public portfolio routes with the public navigation bar,
 * custom cursor, smooth scrolling, and footer.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayoutShell>{children}</PublicLayoutShell>;
}
