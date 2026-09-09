"use client";

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-500">
      <Link href="/" className="hover:text-slate-700">
        <Home size={13} />
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={13} className="text-slate-300" />
          {crumb.href && i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="hover:text-slate-700">{crumb.label}</Link>
          ) : (
            <span className="text-slate-800 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
