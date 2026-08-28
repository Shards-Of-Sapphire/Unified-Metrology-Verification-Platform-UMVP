"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Scale } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const accounts = [["Instrument User", "applicant@umvp.gov.in"], ["LMO Officer", "lmo@umvp.gov.in"], ["GATC", "inspector@umvp.gov.in"], ["Admin", "admin@umvp.gov.in"]];

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (isAuthenticated) router.replace("/dashboard"); }, [isAuthenticated, router]);

  async function signIn(accountEmail: string, accountPassword: string) {
    setSubmitting(true);
    setError("");
    const result = await login(accountEmail, accountPassword);
    if (!result.success) setError(result.error ?? "Login failed.");
    else {
      const session = await (await fetch("/api/auth/me")).json() as { role?: string };
      const routes: Record<string, string> = { APPLICANT: "/user/dashboard", DISTRICT_LMO: "/lmo/dashboard", INSPECTOR: "/lmo/dashboard", GATC_MANAGER: "/gatc/dashboard", SUPER_ADMIN: "/admin/dashboard", STATE_ADMIN: "/admin/dashboard", AUDITOR: "/admin/dashboard" };
      router.push(routes[session.role ?? ""] ?? "/dashboard");
    }
    setSubmitting(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return signIn(email, password || "ChangeMe123!");
  }

  return <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0d1b3e 0%, #1a2d6b 50%, #0d9488 100%)" }}><div className="hidden lg:flex flex-col justify-between w-[42%] p-12 text-white"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center"><Scale size={20} /></div><div><div className="font-bold text-lg font-display">UMVP</div><div className="text-white/50 text-xs">Unified Metrology Verification Portal</div></div></div><div><h2 className="text-4xl font-bold font-display leading-tight mb-4">Digital Compliance<br />for Every Instrument</h2><p className="text-white/60 text-base leading-relaxed mb-8">Apply for verification, track inspections, and receive government-issued digital certificates - all in one place.</p><div className="space-y-3">{["Secure government platform", "Application tracking", "QR-verified certificates", "Nationwide LMO network"].map((feature) => <div key={feature} className="flex items-center gap-2.5 text-white/80 text-sm"><span className="w-5 h-5 rounded-full bg-teal-500/30 border border-teal-400/40 flex items-center justify-center text-teal-400 text-[10px]">✓</span>{feature}</div>)}</div></div><div className="text-white/30 text-xs">Government of India · Ministry of Consumer Affairs</div></div><div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-slate-50 rounded-l-3xl lg:rounded-l-[2rem]"><div className="w-full max-w-md"><div className="lg:hidden flex items-center gap-2 mb-8"><div className="w-8 h-8 rounded-lg bg-gradient-royal flex items-center justify-center"><Scale size={14} className="text-white" /></div><span className="font-bold text-slate-800 font-display">UMVP</span></div><h1 className="text-2xl font-bold text-slate-800 font-display mb-1">Welcome back</h1><p className="text-slate-500 text-sm mb-6">Sign in to your UMVP account</p><div className="mb-6"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Demo Access</p><div className="grid grid-cols-2 gap-2">{accounts.map(([role, accountEmail]) => <button key={accountEmail} onClick={() => { setEmail(accountEmail); return signIn(accountEmail, "ChangeMe123!"); }} disabled={submitting || isLoading} className="text-left px-3 py-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50"><div className="text-xs font-semibold text-slate-700">{role}</div><div className="text-[10px] text-slate-400 truncate">{accountEmail}</div></button>)}</div></div><div className="relative mb-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div><div className="relative text-center"><span className="bg-slate-50 px-3 text-xs text-slate-400">or sign in manually</span></div></div><form onSubmit={submit} className="space-y-4">{error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-red-700 text-sm">{error}</div>}<div><label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div><div><div className="flex items-center justify-between mb-1.5"><label htmlFor="password" className="text-xs font-semibold text-slate-600">Password</label><Link href="/forgot-password" className="text-xs text-blue-600">Forgot password?</Link></div><div className="relative"><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-11 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div><button type="submit" disabled={submitting || isLoading} className="w-full bg-gradient-royal text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">{submitting || isLoading ? "Signing in..." : <>Sign In <ArrowRight size={16} /></>}</button></form><p className="text-center text-sm text-slate-500 mt-6">Don&apos;t have an account? <Link href="/register" className="text-blue-600 font-semibold">Register</Link></p></div></div></div>;
}
