import React, { useState } from 'react';
import { useStore } from '../../app/providers/StoreContext';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { formatDate } from '../../shared/lib/formatters';
import { ShieldAlert, Search, Filter, History, User, CheckCircle } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || log.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'refund':
        return <Badge variant="rose">امور مالی و بازپرداخت</Badge>;
      case 'inventory':
        return <Badge variant="emerald">کاردکس انبار</Badge>;
      case 'edition':
        return <Badge variant="blue">شناسنامه و اصالت</Badge>;
      case 'order':
        return <Badge variant="cyan">سفارش و تحویل</Badge>;
      case 'catalog':
        return <Badge variant="purple">کاتالوگ و محصول</Badge>;
      case 'auth':
        return <Badge variant="zinc">دسترسی و نقش‌ها</Badge>;
      default:
        return <Badge variant="zinc">{cat}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            لاگ حسابرسی و ثبت تغییرات حساس (Audit Trail)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ثبت غیرقابل تغییر تمام عملیات حساس مالی، اصلاح موجودی انبار، تغییر وضعیت سفارش و صدور شناسنامه (Epic E01-03)
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          مجموع رکوردها: {auditLogs.length} رویداد
        </span>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <input
            type="text"
            placeholder="جستجو در شرح عملیات، نام اپراتور یا جزئیات سند..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151824] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 pr-9"
          />
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
        </div>

        <div className="sm:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#151824] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">همه حوزه‌های عملیاتی</option>
            <option value="refund">امور مالی و استرداد وجه</option>
            <option value="inventory">کاردکس و انبارداری</option>
            <option value="edition">شناسنامه و اصالت قطعات</option>
            <option value="order">چرخه حیات سفارشات</option>
            <option value="catalog">کاتالوگ و کالاها</option>
            <option value="auth">امنیت و نقش‌ها</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Timeline Table */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#151823] shadow-xl">
        <table className="w-full text-right text-xs">
          <thead className="bg-[#10121a] text-slate-400 text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">زمان ثبت (Tehran)</th>
              <th className="py-3 px-4">حوزه</th>
              <th className="py-3 px-4">عنوان اقدام</th>
              <th className="py-3 px-4">عامل و نقش مسئول</th>
              <th className="py-3 px-4">شرح دقیق عملیات</th>
              <th className="py-3 px-4">تغییر وضعیت (قبل / بعد)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                  {formatDate(log.timestamp)}
                </td>
                <td className="py-3.5 px-4">{getCategoryBadge(log.category)}</td>
                <td className="py-3.5 px-4 font-bold text-slate-200">{log.action}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{log.actorName}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-300 max-w-sm">
                  {log.details}
                </td>
                <td className="py-3.5 px-4">
                  {log.beforeSnapshot || log.afterSnapshot ? (
                    <div className="space-y-0.5 text-[10px] font-mono">
                      {log.beforeSnapshot && (
                        <div className="text-slate-500">
                          قبل: <span className="text-slate-400">{log.beforeSnapshot}</span>
                        </div>
                      )}
                      {log.afterSnapshot && (
                        <div className="text-emerald-400">
                          بعد: <span>{log.afterSnapshot}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-600">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
