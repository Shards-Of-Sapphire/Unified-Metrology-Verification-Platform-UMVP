"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User, UserRole } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapRole(role: string): UserRole {
  const roles: Record<string, UserRole> = {
    APPLICANT: "user",
    DISTRICT_LMO: "lmo",
    INSPECTOR: "lmo",
    GATC_MANAGER: "gatc",
    SUPER_ADMIN: "admin",
    STATE_ADMIN: "admin",
    AUDITOR: "admin",
  };
  return roles[role] ?? "user";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json() as { id: string; name: string; email: string; phone?: string; active: boolean; role: string; workspace: { name: string }; };
        setUser({ id: data.id, name: data.name, email: data.email, phone: data.phone, role: mapRole(data.role), organisation: data.workspace.name, createdAt: "", isActive: data.active });
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  async function login(email: string, password: string) {
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!response.ok) return { success: false, error: ((await response.json()) as { error?: string }).error ?? "Login failed." };
    const sessionResponse = await fetch("/api/auth/me");
    if (!sessionResponse.ok) return { success: false, error: "Unable to load your session." };
    const data = await sessionResponse.json() as { id: string; name: string; email: string; phone?: string; active: boolean; role: string; workspace: { name: string } };
    setUser({ id: data.id, name: data.name, email: data.email, phone: data.phone, role: mapRole(data.role), organisation: data.workspace.name, createdAt: "", isActive: data.active });
    return { success: true };
  }

  return <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}