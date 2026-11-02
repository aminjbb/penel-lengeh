import { RoleKey, PermissionKey, UserRoleInfo } from '../types';

export const ROLES_CONFIG: Record<RoleKey, UserRoleInfo> = {
  owner: {
    key: 'owner',
    titleFa: 'مالک یا مدیر کل',
    description: 'دسترسی کامل به تنظیمات، نقش‌ها، کاتالوگ، امور مالی و تمام عملیات پنل',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    allowedSections: [
      'dashboard',
      'catalog',
      'collections',
      'inventory',
      'orders',
      'shipments',
      'customers',
      'marketing',
      'audit',
      'settings',
    ],
  },
  catalog_operator: {
    key: 'catalog_operator',
    titleFa: 'اپراتور کاتالوگ',
    description: 'مدیریت محصولات، واریانت‌ها، رسانه و دسته‌ها (بدون دسترسی مالی و نشانی کامل مشتری)',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    allowedSections: ['dashboard', 'catalog', 'collections'],
  },
  content_editor: {
    key: 'content_editor',
    titleFa: 'سردبیر محتوا',
    description: 'مدیریت کالکشن‌ها، هیروها، لوک‌بوک و صفحات برند (بدون دسترسی تغییر موجودی و مالی)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    allowedSections: ['dashboard', 'collections', 'marketing'],
  },
  warehouse: {
    key: 'warehouse',
    titleFa: 'انبار و ارسال',
    description: 'کنترل موجودی، گردش انبار، برداشت، بسته‌بندی، رهگیری و سریال قطعات (بدون دسترسی بازپرداخت)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    allowedSections: ['dashboard', 'inventory', 'shipments'],
  },
  support: {
    key: 'support',
    titleFa: 'پشتیبانی',
    description: 'رسیدگی به سفارش‌ها، پرونده‌های پشتیبانی و ثبت درخواست مرجوعی (بدون تأیید نهایی بازپرداخت)',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    allowedSections: ['dashboard', 'orders', 'shipments', 'customers'],
  },
  finance: {
    key: 'finance',
    titleFa: 'مالی',
    description: 'تطبیق پرداخت‌ها، مغایرت‌های بانکی و اجرای بازپرداخت مجاز (بدون مدیریت نقش و کاتالوگ)',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    allowedSections: ['dashboard', 'orders', 'audit'],
  },
  analyst: {
    key: 'analyst',
    titleFa: 'تحلیلگر',
    description: 'گزارش‌های فقط‌خواندنی، تحلیل فروش و موجودی (با پوشاندن کامل داده‌های شخصی)',
    badgeColor: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
    allowedSections: ['dashboard', 'catalog', 'orders', 'marketing'],
  },
};

export const ROLE_PERMISSIONS: Record<RoleKey, PermissionKey[]> = {
  owner: [
    'view_dashboard',
    'manage_catalog',
    'manage_collections',
    'manage_inventory',
    'manage_orders',
    'process_refunds',
    'manage_shipments',
    'manage_returns',
    'view_customer_private_data',
    'manage_marketing',
    'view_audit_logs',
    'manage_settings',
  ],
  catalog_operator: [
    'view_dashboard',
    'manage_catalog',
    'manage_collections',
  ],
  content_editor: [
    'view_dashboard',
    'manage_collections',
    'manage_marketing',
  ],
  warehouse: [
    'view_dashboard',
    'manage_inventory',
    'manage_shipments',
    'manage_returns',
  ],
  support: [
    'view_dashboard',
    'manage_orders',
    'manage_shipments',
    'manage_returns',
  ],
  finance: [
    'view_dashboard',
    'manage_orders',
    'process_refunds',
    'view_audit_logs',
  ],
  analyst: [
    'view_dashboard',
  ],
};

export function hasPermission(role: RoleKey, permission: PermissionKey): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessSection(role: RoleKey, sectionKey: string): boolean {
  return ROLES_CONFIG[role]?.allowedSections.includes(sectionKey) ?? false;
}
