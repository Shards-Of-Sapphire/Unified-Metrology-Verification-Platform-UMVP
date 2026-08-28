import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  accent?: 'blue' | 'teal' | 'saffron' | 'violet' | 'green' | 'red';
}

const ACCENT_STYLES: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  teal: 'bg-teal-50 text-teal-600',
  saffron: 'bg-orange-50 text-orange-500',
  violet: 'bg-violet-50 text-violet-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
};

export default function StatsCard({ title, value, subtitle, icon, trend, accent = 'blue' }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        {icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${ACCENT_STYLES[accent]}`}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800 font-display">{value}</div>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          <span className="text-slate-400 font-normal">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
