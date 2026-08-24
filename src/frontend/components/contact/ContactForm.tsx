"use client";

import React, { useState } from "react";
import { playSound } from "@/frontend/lib/sound";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

/**
 * ContactForm
 *
 * Minimalist, high-tech classified message dispatch interface.
 */
export function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [receiptId, setReceiptId] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      playSound("click");
      setStatus("error");
      setErrorMessage("ALL PAYLOAD FIELDS ARE MANDATORY.");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      playSound("click");
      setStatus("error");
      setErrorMessage("INVALID TRANSMISSION EMAIL FORMAT.");
      return;
    }

    setStatus("submitting");
    playSound("click");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "TRANSMISSION FAILED. TRY AGAIN.");
      }

      const generatedReceipt = `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      setReceiptId(generatedReceipt);
      setStatus("success");
      playSound("open");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      playSound("click");
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "TRANSMISSION FAILURE."
      );
    }
  };

  const handleReset = () => {
    playSound("click");
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <div
      className="relative w-full border border-white/10 bg-[#080808]/90 p-5 sm:p-7 overflow-hidden flex flex-col justify-between"
      style={{
        boxShadow: "0 0 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.02)",
      }}
    >
      {/* Precision Corner Reticles */}
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#FFAA00]" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#FFAA00]" />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#FFAA00]" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#FFAA00]" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5 font-mono text-[0.62rem] tracking-[0.2em] uppercase">
        <div className="flex items-center gap-2">
          <span className="text-[#FFAA00] font-bold">TRANSMISSION // FORM</span>
        </div>
        <span className="text-white/40 font-mono">[SEC_ENC_256]</span>
      </div>

      {/* ── Success Confirmation Screen ── */}
      {status === "success" ? (
        <div className="py-8 flex flex-col items-center justify-center text-center gap-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-full border border-[#44FF88] bg-[#44FF88]/10 flex items-center justify-center text-[#44FF88]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-[#44FF88] tracking-[0.2em] uppercase font-bold">
              &gt;&gt; DISPATCH CONFIRMED // RECEIVED
            </span>
            <p className="font-sans text-xs text-white/70 max-w-sm">
              Your message has been encrypted and delivered to Zakariyae's terminal. Expect an encrypted reply shortly.
            </p>
          </div>

          <div className="p-3 border border-white/10 bg-white/[0.02] font-mono text-[0.65rem] text-white/40 tracking-widest uppercase">
            RECEIPT_REF: <span className="text-[#FFAA00]">{receiptId}</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            onMouseEnter={() => playSound("hover")}
            className="mt-2 px-5 py-2 font-mono text-xs tracking-[0.2em] uppercase border border-[#FFAA00]/40 bg-[#FFAA00]/10 text-[#FFAA00] hover:bg-[#FFAA00] hover:text-[#050505] transition-all duration-200 cursor-pointer"
          >
            [ TRANSMIT ANOTHER ]
          </button>
        </div>
      ) : (
        /* ── Standard Active Form ── */
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-name"
              className="font-mono text-[0.62rem] tracking-[0.16em] text-white/50 uppercase"
            >
              CODENAME // FULL NAME <span className="text-[#FFAA00]">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Vance / Enterprise Client"
              disabled={status === "submitting"}
              className="w-full bg-[#050505] border border-white/15 focus:border-[#FFAA00] px-3.5 py-2.5 font-sans text-xs sm:text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#FFAA00]/40 transition-colors"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-email"
              className="font-mono text-[0.62rem] tracking-[0.16em] text-white/50 uppercase"
            >
              COMM_FREQUENCY // EMAIL <span className="text-[#FFAA00]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. contact@client.com"
              disabled={status === "submitting"}
              className="w-full bg-[#050505] border border-white/15 focus:border-[#FFAA00] px-3.5 py-2.5 font-sans text-xs sm:text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#FFAA00]/40 transition-colors"
            />
          </div>

          {/* Message Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-message"
              className="font-mono text-[0.62rem] tracking-[0.16em] text-white/50 uppercase"
            >
              MISSION PAYLOAD // MESSAGE <span className="text-[#FFAA00]">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe project specifications, timelines, or inquiry details..."
              disabled={status === "submitting"}
              className="w-full bg-[#050505] border border-white/15 focus:border-[#FFAA00] px-3.5 py-2.5 font-sans text-xs sm:text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#FFAA00]/40 transition-colors resize-none"
            />
          </div>

          {/* Error Notice */}
          {status === "error" && (
            <div className="p-2.5 border border-red-500/40 bg-red-500/10 font-mono text-[0.65rem] text-red-400 tracking-wider flex items-center gap-2">
              <span>✕</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "submitting"}
            onMouseEnter={() => playSound("hover")}
            className="mt-2 w-full py-3 bg-[#FFAA00] hover:bg-[#ffbe33] text-[#050505] font-mono text-xs font-bold tracking-[0.22em] uppercase transition-all duration-200 shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === "submitting" ? (
              <>
                <span className="w-2.5 h-2.5 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                <span>ENCRYPTING &amp; DISPATCHING...</span>
              </>
            ) : (
              <span>INITIATE TRANSMISSION &rarr;</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
