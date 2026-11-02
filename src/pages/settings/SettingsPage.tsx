import React from 'react';
import { useStore } from '../../app/providers/StoreContext';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { ROLES_CONFIG } from '../../shared/lib/permissions';
import { RoleKey } from '../../shared/types';
import {
  Settings,
  Shield,
  Clock,
  Database,
  Lock,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { role, setRole, resetAllData } = useStore();

  const rbacMatrix: {
    section: string;
    owner: boolean;
    catalog: boolean;
    content: boolean;
    warehouse: boolean;
    support: boolean;
    finance: boolean;
    analyst: boolean;
  }[] = [
    {
      section: 'داشبورد مدیریت و شاخص‌های کلیدی',
      owner: true,
      catalog: true,
      content: true,
      warehouse: true,
      support: true,
      finance: true,
      analyst: true,
    },
    {
      section: 'کاتالوگ و واریانت‌ها (ایجاد و ویرایش کالا)',
      owner: true,
      catalog: true,
      content: false,
      warehouse: false,
      support: false,
      finance: false,
      analyst: false,
    },
    {
      section: 'کالکشن‌ها، هیرو بنرها و لوک‌بوک',
      owner: true,
      catalog: true,
      content: true,
      warehouse: false,
      support: false,
      finance: false,
      analyst: false,
    },
    {
      section: 'انبار و اصلاح موجودی کالاها',
      owner: true,
      catalog: false,
      content: false,
      warehouse: true,
      support: false,
      finance: false,
      analyst: false,
    },
    {
      section: 'مدیریت و چرخه وضعیت سفارشات',
      owner: true,
      catalog: false,
      content: false,
      warehouse: false,
      support: true,
      finance: true,
      analyst: false,
    },
    {
      section: 'تأیید و اجرای استرداد وجه (Refund)',
      owner: true,
      catalog: false,
      content: false,
      warehouse: false,
      support: false,
      finance: true,
      analyst: false,
    },
    {
      section: 'کنترل کیفیت مرجوعی (QC) و ارسال',
      owner: true,
      catalog: false,
      content: false,
      warehouse: true,
      support: true,
      finance: false,
      analyst: false,
    },
    {
      section: 'دسترسی به شماره تماس کامل خریداران',
      owner: true,
      catalog: false,
      content: false,
      warehouse: false,
      support: true,
      finance: false,
      analyst: false,
    },
    {
      section: 'مشاهده لاگ حسابرسی رویدادهای حساس',
      owner: true,
      catalog: false,
      content: false,
      warehouse: false,
      support: false,
      finance: true,
      analyst: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          تنظیمات سیستم، پیکربندی عملیاتی و ماتریس مجوزها (RBAC)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          قواعد کنترل دسترسی نقش‌ها، استانداردهای مالی و زمان‌بندی مطابق مستند معماری و نقش‌های پنل
        </p>
      </div>

      {/* System Operational Parameters Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#151823] border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
            <Clock className="w-4 h-4" />
            مرجع زمان سیستم
          </div>
          <div className="text-sm font-semibold text-slate-100 font-mono">
            Asia/Tehran (UTC +03:30)
          </div>
          <p className="text-[11px] text-slate-400">
            تمام لاگ‌ها و رویدادها با استاندارد زمان رسمی تهران ذخیره و نمایش داده می‌شوند.
          </p>
        </Card>

        <Card className="p-4 bg-[#151823] border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <Database className="w-4 h-4" />
            واحد پولی و مالیات
          </div>
          <div className="text-sm font-semibold text-slate-100">
            تومان (تطبیق خودکار با ریال درگاه)
          </div>
          <p className="text-[11px] text-slate-400">
            ذخیره مبالغ به‌صورت عدد صحیح؛ تبدیل به ریال هنگام ارسال به شاپرک.
          </p>
        </Card>

        <Card className="p-4 bg-[#151823] border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
            <Shield className="w-4 h-4" />
            سیاست بازیابی و RPO/RTO
          </div>
          <div className="text-sm font-semibold text-slate-100 font-mono">
            RPO: 1h | RTO: 4h
          </div>
          <p className="text-[11px] text-slate-400">
            بک‌آپ دوره‌ای دیتابیس با بازتولید خودکار در کلاسترهای ابری امن.
          </p>
        </Card>
      </div>

      {/* RBAC Matrix Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            ماتریس دسترسی نقش‌ها (جدول ۴ سند معماری)
          </h3>
          <span className="text-[11px] text-slate-400">
            نقش فعال شما:{' '}
            <strong className="text-blue-400 font-bold">
              {ROLES_CONFIG[role].titleFa}
            </strong>
          </span>
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#151823] shadow-xl">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#10121a] text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">بخش و اقدام عملیاتی</th>
                <th className="py-3 px-2 text-center">مالک / مدیر</th>
                <th className="py-3 px-2 text-center">کاتالوگ</th>
                <th className="py-3 px-2 text-center">محتوا</th>
                <th className="py-3 px-2 text-center">انبار و ارسال</th>
                <th className="py-3 px-2 text-center">پشتیبانی</th>
                <th className="py-3 px-2 text-center">مالی</th>
                <th className="py-3 px-2 text-center">تحلیلگر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rbacMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-900/40">
                  <td className="py-3 px-4 font-medium text-neutral-200">
                    {row.section}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.owner ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.catalog ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.content ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.warehouse ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.support ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.finance ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.analyst ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Reset Section */}
      <Card className="p-5 border-rose-900/40 bg-rose-950/10 space-y-3">
        <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-rose-400" />
          بازنشانی به داده‌های آزمایشی مبنا (Factory Reset)
        </h4>
        <p className="text-xs text-rose-300/80 leading-relaxed">
          در صورت تمایل به پاکسازی تمام تغییرات موقت (محصولات اضافه شده، تغییرات انبار و سفارش‌ها) و بازگشت به سناریوی دموی اولیه، روی دکمه زیر کلیک کنید.
        </p>
        <div>
          <Button
            variant="danger"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              if (confirm('آیا از بازنشانی کلیه داده‌های آزمایشی اطمینان دارید؟')) {
                resetAllData();
              }
            }}
          >
            بازنشانی کامل داده‌های دمو
          </Button>
        </div>
      </Card>
    </div>
  );
};
