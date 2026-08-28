"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, PlusCircle, Award, Settings, ClipboardList,
  Search, Calendar, FlaskConical, Users, UserCheck, Building2, BarChart3,
  ShieldCheck, LogOut, ChevronRight, Scale, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NAV_CONFIG, ROLE_LABELS } from '../../config/navigation';
import type { NavItem } from '../../config/navigation';

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard, FileText, PlusCircle, Award, Settings, ClipboardList,
  Search, Calendar, FlaskConical, Users, UserCheck, Building2, BarChart3, ShieldCheck,
};

interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function NavLink({ item, collapsed }: { item: NavItem; collapsed?: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const Icon = ICONS[item.icon];

  return (
    <Link
      href={item.href}
      className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium group ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-white/60 hover:bg-white/6 hover:text-white/90'
      }`}
    >
      {Icon && (
        <span className={`flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-white/40 group-hover:text-white/70'}`}>
          <Icon size={18} />
        </span>
      )}
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && isActive && <ChevronRight size={14} className="ml-auto text-blue-400 flex-shrink-0" />}
    </Link>
  );
}

export default function Sidebar({ collapsed, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  if (!user) return null;

  const navGroups = NAV_CONFIG[user.role];
  const roleLabel = ROLE_LABELS[user.role];

  const content = (
    <div className="flex flex-col h-full" style={{ background: 'var(--sidebar-bg)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-royal flex-shrink-0">
          <Scale size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-base font-display tracking-tight leading-tight">UMVP</div>
            <div className="text-white/40 text-[10px] leading-tight uppercase tracking-wider">Metrology Portal</div>
          </div>
        )}
        {mobileOpen && (
          <button onClick={onMobileClose} className="ml-auto text-white/40 hover:text-white p-1">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-2">
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <div className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Signed in as</div>
            <div className="text-white text-xs font-semibold truncate">{user.name}</div>
            <div className="text-blue-400 text-[10px] mt-0.5 truncate">{roleLabel}</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {!collapsed && group.label && (
              <div className="text-white/25 text-[10px] uppercase tracking-widest px-3 mb-2 font-semibold">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavLink key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
        <button
          onClick={logout}
          className="sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white/90 hover:bg-white/6"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  if (mobileOpen !== undefined) {
    return (
      <>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
            <div className="relative w-64 h-full">
              {content}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`hidden lg:flex flex-col flex-shrink-0 ${collapsed ? 'w-16' : 'w-60'} transition-all duration-200`}>
      {content}
    </div>
  );
}
