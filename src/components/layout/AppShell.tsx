"use client";

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { canAccessRoute } from '../../lib/permissions';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import type { Crumb } from './Breadcrumbs';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Crumb[];
  requiredRoutePrefix?: string;
}

export default function AppShell({ children, title, breadcrumbs, requiredRoutePrefix }: AppShellProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-royal flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500 text-sm">Loading UMVP...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) redirect('/login');

  if (requiredRoutePrefix && user && !canAccessRoute(user.role, requiredRoutePrefix)) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="text-center max-w-sm p-8">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2 font-display">Access Denied</h2>
          <p className="text-slate-500 text-sm">You do not have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      <Sidebar />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-7xl mx-auto">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-4">
                <Breadcrumbs crumbs={breadcrumbs} />
              </div>
            )}
            {title && (
              <div className="mb-5 sm:hidden">
                <h1 className="text-slate-800 font-bold text-xl font-display">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
