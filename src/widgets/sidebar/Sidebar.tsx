import React from 'react';
import {
  LayoutDashboard,
  Shirt,
  Sparkles,
  Boxes,
  Award,
  ShoppingBag,
  Truck,
  Users,
  Tag,
  ShieldAlert,
  Settings,
  Search,
  Lock,
} from 'lucide-react';
import { useStore } from '../../app/providers/StoreContext';
import { canAccessSection } from '../../shared/lib/permissions';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenVerifyModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenVerifyModal,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { role, orders, returns } = useStore();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_payment' || o.status === 'processing').length;
  const pendingReturnsCount = returns.filter((r) => r.qcStatus === 'pending').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'داشبورد مدیریت',
      icon: <LayoutDashboard className="w-4 h-4" />,
      sectionKey: 'dashboard',
    },
    {
      id: 'catalog',
      label: 'کاتالوگ و واریانت‌ها',
      icon: <Shirt className="w-4 h-4" />,
      sectionKey: 'catalog',
    },
    {
      id: 'collections',
      label: 'کالکشن‌ها و محتوا',
      icon: <Sparkles className="w-4 h-4" />,
      sectionKey: 'collections',
    },
    {
      id: 'inventory',
      label: 'انبار و گردش موجودی',
      icon: <Boxes className="w-4 h-4" />,
      sectionKey: 'inventory',
    },
    {
      id: 'orders',
      label: 'سفارش‌ها و مالی',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} اقدام` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      sectionKey: 'orders',
    },
    {
      id: 'shipments',
      label: 'ارسال و مرجوعی',
      icon: <Truck className="w-4 h-4" />,
      badge: pendingReturnsCount > 0 ? `${pendingReturnsCount} مرجوعی` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
      sectionKey: 'shipments',
    },
    {
      id: 'customers',
      label: 'مشتریان و پشتیبانی',
      icon: <Users className="w-4 h-4" />,
      sectionKey: 'customers',
    },
    {
      id: 'marketing',
      label: 'بازاریابی و تخفیف',
      icon: <Tag className="w-4 h-4" />,
      sectionKey: 'marketing',
    },
    {
      id: 'audit',
      label: 'لاگ حسابرسی و رویدادها',
      icon: <ShieldAlert className="w-4 h-4" />,
      sectionKey: 'audit',
    },
    {
      id: 'settings',
      label: 'تنظیمات و دسترسی‌ها',
      icon: <Settings className="w-4 h-4" />,
      sectionKey: 'settings',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 right-0 bottom-0 z-40 w-72 bg-[#0e1017] border-l border-slate-800/80 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-0.5 flex items-center justify-center shadow-lg shadow-blue-950/60">
                <div className="w-full h-full bg-[#0e1017] rounded-[10px] flex items-center justify-center">
                  <span className="font-serif-brand text-blue-400 font-bold text-lg tracking-wider">
                    L
                  </span>
                </div>
              </div>
              <div>
                <h1 className="font-serif-brand text-sm tracking-widest text-slate-100 font-bold uppercase">
                  LENGEH
                </h1>
                <p className="text-[11px] text-blue-400 font-medium">
                  آتلیه و استودیو طراحی مد لنگه
                </p>
              </div>
            </div>
          </div>

          {/* Public Authenticity Checker Action */}
          <div className="p-3 mx-3 my-3 bg-[#151824] border border-blue-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-blue-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-400" />
                استعلام عمومی اصالت
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                مشتری و کلکسیونر
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mb-2">
              بررسی شناسنامه دیجیتال و اصالت قطعات شماره‌گذاری‌شده لنگه
            </p>
            <button
              onClick={() => {
                onOpenVerifyModal();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-blue-200 hover:text-white text-xs font-medium rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              استعلام سریال قطعه
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-290px)]">
            <div className="text-[10px] font-semibold text-slate-500 px-3 py-1 uppercase tracking-wider">
              منوی عملیاتی
            </div>
            {navItems.map((item) => {
              const isAllowed = canAccessSection(role, item.sectionKey);
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-200 border border-blue-500/40 font-semibold'
                      : isAllowed
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      : 'text-slate-600 hover:bg-slate-900/30 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`${
                        isActive ? 'text-blue-400' : isAllowed ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isAllowed && (
                      <span title="عدم دسترسی با نقش فعلی" className="text-slate-600">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0c0e14]">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>نسخه سیستم: ۱.۲.۰</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              متصل به انبار
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            سیستم متمرکز پنل و اصالت نسخه‌های محدود
          </p>
        </div>
      </aside>
    </>
  );
};
