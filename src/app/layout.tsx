import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalEnvironment } from "@/frontend/components/layout/GlobalEnvironment";
import { PublicLayoutShell } from "@/frontend/components/layout/PublicLayoutShell";
import "./globals.css";

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
  icons: {
    icon: "/assets/branding/BZ.png",
    shortcut: "/assets/branding/BZ.png",
    apple: "/assets/branding/BZ.png",
  },
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
      <body className="antialiased font-sans bg-[#050505] text-white">
        <GlobalEnvironment>
          <PublicLayoutShell>{children}</PublicLayoutShell>
        </GlobalEnvironment>
      </body>
    </html>
  );
}
