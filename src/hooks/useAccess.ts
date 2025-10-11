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

const allPermissions: AppPermission[] = [
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

const rolePermissions: Record<string, AppPermission[]> = {
  superadmin: allPermissions,
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

export function useAccess() {
  const { user } = useAuth();
  const { getUserByEmail } = useUsers();

  const effective = useMemo(() => {
    if (!user) return new Set<AppPermission>();
    const rolePerms = rolePermissions[user.role] || [];
    const stored = getUserByEmail(user.email);
    const grants = (stored?.grants || []) as AppPermission[];
    const denies = (stored?.denies || []) as AppPermission[];
    const set = new Set<AppPermission>([...rolePerms, ...grants]);
    denies.forEach(d => set.delete(d));
    return set;
  }, [user, getUserByEmail]);

  const can = (perm: AppPermission) => effective.has(perm);

  return { can, effectivePermissions: effective };
}
