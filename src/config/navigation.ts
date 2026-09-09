import type { UserRole } from '../types';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const NAV_CONFIG: Record<UserRole, NavGroup[]> = {
  user: [
    {
      items: [
        { label: 'Dashboard', href: '/user/dashboard', icon: 'LayoutDashboard' },
        { label: 'My Applications', href: '/user/applications', icon: 'FileText' },
        { label: 'New Application', href: '/user/applications/new', icon: 'PlusCircle' },
        { label: 'Certificates', href: '/user/certificates', icon: 'Award' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Profile & Settings', href: '/user/profile', icon: 'Settings' },
      ],
    },
  ],
  lmo: [
    {
      items: [
        { label: 'Dashboard', href: '/lmo/dashboard', icon: 'LayoutDashboard' },
        { label: 'Application Queue', href: '/lmo/applications', icon: 'ClipboardList' },
        { label: 'Inspections', href: '/lmo/inspections', icon: 'Search' },
        { label: 'Schedule', href: '/lmo/schedule', icon: 'Calendar' },
        { label: 'Certificates', href: '/lmo/certificates', icon: 'Award' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Profile & Settings', href: '/lmo/profile', icon: 'Settings' },
      ],
    },
  ],
  gatc: [
    {
      items: [
        { label: 'Dashboard', href: '/gatc/dashboard', icon: 'LayoutDashboard' },
        { label: 'Assigned Applications', href: '/gatc/applications', icon: 'ClipboardList' },
        { label: 'Testing Queue', href: '/gatc/testing', icon: 'FlaskConical' },
        { label: 'Certificates', href: '/gatc/certificates', icon: 'Award' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Profile & Settings', href: '/gatc/profile', icon: 'Settings' },
      ],
    },
  ],
  admin: [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
      ],
    },
    {
      label: 'Management',
      items: [
        { label: 'Users', href: '/admin/users', icon: 'Users' },
        { label: 'LMO Officers', href: '/admin/lmos', icon: 'UserCheck' },
        { label: 'Test Centres (GATC)', href: '/admin/gatcs', icon: 'Building2' },
      ],
    },
    {
      label: 'Operations',
      items: [
        { label: 'Applications', href: '/admin/applications', icon: 'FileText' },
        { label: 'Inspections', href: '/admin/inspections', icon: 'Search' },
        { label: 'Certificates', href: '/admin/certificates', icon: 'Award' },
      ],
    },
    {
      label: 'Intelligence',
      items: [
        { label: 'Reports & Analytics', href: '/admin/reports', icon: 'BarChart3' },
        { label: 'Audit Logs', href: '/admin/audit', icon: 'ShieldCheck' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Profile & Settings', href: '/admin/profile', icon: 'Settings' },
      ],
    },
  ],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  user: 'Instrument User',
  lmo: 'Legal Metrology Officer',
  gatc: 'Govt. Approved Test Centre',
  admin: 'System Administrator',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  user: 'bg-blue-100 text-blue-800',
  lmo: 'bg-teal-100 text-teal-800',
  gatc: 'bg-purple-100 text-purple-800',
  admin: 'bg-orange-100 text-orange-800',
};
