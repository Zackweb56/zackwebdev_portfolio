import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ─── Temporary font setup (will be replaced in Task 1.3: Configure Fonts) ───
// Keeping Geist as the UI/technical font — Geist Mono as the mono font.
// Display font (Cormorant Garamond) will be added in Task 1.3.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─── Metadata (will be expanded in Task 1.6 / SEO phase) ────────────────────
export const metadata: Metadata = {
  title: {
    default: "Zakariyae Boughaba — Full Stack Developer",
    template: "%s — Zakariyae Boughaba",
  },
  description:
    "Full Stack Web Developer specializing in backend rigor and frontend interactivity.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
