import type { UserRole } from '../types';

export type Permission =
  | 'applications:own:read'
  | 'applications:own:create'
  | 'applications:own:update'
  | 'applications:assigned:read'
  | 'applications:assigned:update'
  | 'applications:all:read'
  | 'applications:all:manage'
  | 'certificates:own:read'
  | 'certificates:assigned:read'
  | 'certificates:all:read'
  | 'certificates:issue'
  | 'inspections:own:read'
  | 'inspections:manage'
  | 'inspections:all:read'
  | 'testing:assigned:read'
  | 'testing:results:submit'
  | 'users:all:manage'
  | 'lmos:all:manage'
  | 'gatcs:all:manage'
  | 'reports:view'
  | 'audit:view';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: [
    'applications:own:read',
    'applications:own:create',
    'applications:own:update',
    'certificates:own:read',
    'inspections:own:read',
  ],
  lmo: [
    'applications:assigned:read',
    'applications:assigned:update',
    'certificates:assigned:read',
    'certificates:issue',
    'inspections:manage',
    'inspections:own:read',
  ],
  gatc: [
    'applications:assigned:read',
    'testing:assigned:read',
    'testing:results:submit',
    'certificates:assigned:read',
  ],
  admin: [
    'applications:all:read',
    'applications:all:manage',
    'certificates:all:read',
    'certificates:issue',
    'inspections:all:read',
    'inspections:manage',
    'users:all:manage',
    'lmos:all:manage',
    'gatcs:all:manage',
    'reports:view',
    'audit:view',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export function canAccessRoute(role: UserRole, routePrefix: string): boolean {
  const routeRoleMap: Record<string, UserRole[]> = {
    '/user': ['user'],
    '/lmo': ['lmo'],
    '/gatc': ['gatc'],
    '/admin': ['admin'],
  };

  for (const [prefix, allowedRoles] of Object.entries(routeRoleMap)) {
    if (routePrefix.startsWith(prefix)) {
      return allowedRoles.includes(role);
    }
  }
  return true;
}
