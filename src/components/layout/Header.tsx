"use client";

import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../config/navigation';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 py-3.5 bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <Menu size={20} />
        </button>
        {title && (
          <h1 className="text-slate-800 font-bold text-lg font-display hidden sm:block">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-64">
          <Search size={15} className="text-slate-400" />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
          />
        </div>

        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
          <div className="w-8 h-8 rounded-full bg-gradient-royal flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</div>
            <div className="text-[10px] text-slate-400 leading-tight">{ROLE_LABELS[user.role]}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
