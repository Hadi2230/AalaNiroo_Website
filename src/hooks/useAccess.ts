import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/contexts/UsersContext';

export type AppPermission =
  | 'admin.dashboard.view'
  | 'admin.products.manage'
  | 'admin.orders.manage'
  | 'admin.customers.manage'
  | 'admin.content.manage'
  | 'admin.media.manage'
  | 'admin.meetings.manage'
  | 'admin.reports.view'
  | 'admin.integrations.manage'
  | 'admin.users.manage';

export const ALL_PERMISSIONS: AppPermission[] = [
  'admin.dashboard.view',
  'admin.products.manage',
  'admin.orders.manage',
  'admin.customers.manage',
  'admin.content.manage',
  'admin.media.manage',
  'admin.meetings.manage',
  'admin.reports.view',
  'admin.integrations.manage',
  'admin.users.manage',
];

export const ROLE_PERMISSIONS: Record<string, AppPermission[]> = {
  superadmin: ALL_PERMISSIONS,
  admin: [
    'admin.dashboard.view',
    'admin.products.manage',
    'admin.orders.manage',
    'admin.customers.manage',
    'admin.content.manage',
    'admin.media.manage',
    'admin.meetings.manage',
    'admin.reports.view',
    'admin.integrations.manage',
    // no users.manage by default for admin
  ],
  manager: [
    'admin.dashboard.view',
    'admin.products.manage',
    'admin.orders.manage',
    'admin.customers.manage',
    'admin.content.manage',
    'admin.media.manage',
    'admin.meetings.manage',
    'admin.reports.view',
  ],
  sales: [
    'admin.dashboard.view',
    'admin.customers.manage',
    'admin.orders.manage',
  ],
};

export function computeEffectivePermissions(
  role: string,
  grants: AppPermission[] = [],
  denies: AppPermission[] = []
) {
  const base = ROLE_PERMISSIONS[role] || [];
  const set = new Set<AppPermission>([...base, ...grants]);
  denies.forEach(d => set.delete(d));
  return set;
}

export function useAccess() {
  const { user } = useAuth();
  const { getUserByEmail } = useUsers();

  const effective = useMemo(() => {
    if (!user) return new Set<AppPermission>();
    const rolePerms = ROLE_PERMISSIONS[user.role] || [];
    const stored = getUserByEmail(user.email);
    const grants = (stored?.grants || []) as AppPermission[];
    const denies = (stored?.denies || []) as AppPermission[];
    return computeEffectivePermissions(user.role, grants, denies);
  }, [user, getUserByEmail]);

  const can = (perm: AppPermission) => effective.has(perm);

  return { can, effectivePermissions: effective };
}
