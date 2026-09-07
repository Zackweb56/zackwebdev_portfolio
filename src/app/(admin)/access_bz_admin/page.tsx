"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  KeyRound,
  Mail,
  Eye,
  EyeOff,
  Terminal,
  Lock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { authClient } from "@/backend/auth/client";

/**
 * /access_bz_admin — Classified Administrator Terminal Login Console
 *
 * Secure Single-Admin Authentication Console:
 *   - Monochromatic #050505 surface with amber accents
 *   - Strictly authenticates against the verified administrator user in MongoDB Atlas
 *   - Issues secure HttpOnly session and transitions to /admin control matrix
 */
export default function AccessBzAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@bz.dev");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await authClient.signIn.email({
        email: email.trim(),
        password: password,
      });

      if (response.error) {
        setErrorMessage("ACCESS_DENIED: Invalid identifier or security key");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage("AUTH_GATEWAY_ERROR: Terminal authentication service unavailable");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full flex items-center justify-center p-4 sm:p-6 select-none">
      {/* ── Background Grid & Reticle Overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 170, 0, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 170, 0, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Terminal HUD Login Console ── */}
      <div className="relative z-10 w-full max-w-md border border-white/25 bg-[#050505]/95 backdrop-blur-xl p-6 sm:p-8">
        {/* ── Top Bar Header ── */}
        <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFAA00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFAA00]" />
            </span>
            <span className="font-mono text-[11px] tracking-widest text-[#FFAA00] font-semibold uppercase">
              AUTH // ADMIN_CONSOLE
            </span>
          </div>

          <span className="font-mono text-[10px] text-white/40 tracking-wider">
            CLEARANCE: LEVEL 5
          </span>
        </div>

        {/* ── Identity & Title ── */}
        <div className="mb-6 space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FFAA00]/10 border border-[#FFAA00]/30 text-[#FFAA00] font-mono text-[10px] uppercase tracking-wider mb-2">
            <Shield className="w-3 h-3 text-[#FFAA00]" />
            <span>SINGLE-ADMIN PROTOCOL</span>
          </div>
          <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
            <Lock className="w-5 h-5 text-[#FFAA00]" />
            TERMINAL ACCESS
          </h1>
          <p className="text-xs text-white/50 font-mono">
            Enter administrative credentials to unlock system controls.
          </p>
        </div>

        {/* ── Error Banner ── */}
        {errorMessage && !isSuccess && (
          <div className="mb-5 border border-red-500/40 bg-red-950/30 p-3.5 flex items-start gap-2.5 text-xs font-mono text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold tracking-wide text-red-300">SECURITY ERROR</p>
              <p className="text-red-200/80 text-[11px]">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* ── Success Banner ── */}
        {isSuccess && (
          <div className="mb-5 border border-[#FFAA00]/50 bg-[#FFAA00]/15 p-3.5 flex items-center gap-2.5 text-xs font-mono text-[#FFAA00]">
            <CheckCircle2 className="w-4 h-4 text-[#FFAA00] shrink-0 animate-bounce" />
            <div>
              <p className="font-bold tracking-wider">ACCESS GRANTED</p>
              <p className="text-white/70 text-[11px]">Redirecting to control matrix...</p>
            </div>
          </div>
        )}

        {/* ── Login Form ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Access Identifier (Email) */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block font-mono text-[11px] uppercase tracking-wider text-white/70 flex items-center justify-between"
            >
              <span>ACCESS IDENTIFIER</span>
              <span className="text-white/30 text-[10px]">ADMIN EMAIL</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                disabled={isLoading || isSuccess}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bz.dev"
                className="w-full bg-black/80 border border-white/15 focus:border-white/50 focus:ring-1 focus:ring-white/50 text-white font-mono text-xs pl-10 pr-4 py-2.5 placeholder:text-white/20 transition-colors outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Security Key (Password) */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block font-mono text-[11px] uppercase tracking-wider text-white/70 flex items-center justify-between"
            >
              <span>SECURITY KEY</span>
              <span className="text-white/30 text-[10px]">PASSWORD</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                disabled={isLoading || isSuccess}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/80 border border-white/15 focus:border-white/50 focus:ring-1 focus:ring-white/50 text-white font-mono text-xs pl-10 pr-10 py-2.5 placeholder:text-white/20 transition-colors outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isSuccess}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-[#FFAA00] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full bg-[#FFAA00] hover:bg-[#ffbe33] text-black font-mono text-xs font-bold uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING WITH DB...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ACCESS AUTHORIZED</span>
                </>
              ) : (
                <>
                  <span>AUTHORIZE ACCESS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* ── Terminal Telemetry Footer ── */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-col gap-1.5 font-mono text-[10px] text-white/40">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-white/50">
              <Terminal className="w-3 h-3 text-[#FFAA00]" />
              DAL_GATEWAY // ACTIVE
            </span>
            <span className="text-[#FFAA00]/80">MONGODB_ATLAS_VERIFIED</span>
          </div>
          <p className="text-white/30 text-[9px] leading-tight">
            Security notice: Direct database authentication. Single-admin role enforced.
          </p>
        </div>

        {/* ── HUD Corner Markings ── */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FFAA00]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#FFAA00]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#FFAA00]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FFAA00]" />
      </div>
    </div>
  );
}
