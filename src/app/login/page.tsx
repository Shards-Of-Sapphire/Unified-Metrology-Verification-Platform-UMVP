"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("lmo@umvp.gov.in");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!response.ok) { setError((await response.json()).error); return; }
    router.push("/");
    router.refresh();
  }
  return <main className="login-page"><div className="login-card"><div className="brand-lockup"><div className="brand-mark">U</div><div><strong>UMVP</strong><span>Legal metrology portal</span></div></div><p className="eyebrow">SECURE WORKSPACE ACCESS</p><h1>Sign in to UMVP</h1><p className="lede">Use your department account to continue.</p><form onSubmit={submit}><label htmlFor="email">Work email</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />{error && <p className="form-error">{error}</p>}<button className="login-button">Sign in</button></form><small className="login-note">Demo accounts are documented in the README. Change all seeded passwords before deployment.</small></div></main>;
}