import React, { useState } from 'react';
import { useStore } from '../../app/providers/StoreContext';
import { DiscountCode } from '../../shared/types';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { Modal } from '../../shared/ui/Modal';
import { formatPrice, formatDate } from '../../shared/lib/formatters';
import { Tag, Plus, Search, AlertCircle, TrendingUp, Check } from 'lucide-react';

export const MarketingPage: React.FC = () => {
  const {
    discountCodes,
    addDiscountCode,
    toggleDiscountActive,
    searchKeywords,
    checkPermission,
  } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(15000000);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(3000000);
  const [usageLimit, setUsageLimit] = useState<number>(50);

  const canManage = checkPermission('manage_marketing');

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addDiscountCode({
      code: code.trim().toUpperCase(),
      discountType,
      value,
      minOrderValue,
      maxDiscountAmount: discountType === 'percentage' ? maxDiscountAmount : undefined,
      expiryDate: '2026-12-30T23:59:59Z',
      usageLimit,
      isActive: true,
    });

    setIsAddModalOpen(false);
    setCode('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-400" />
            بازاریابی، کدهای تخفیف و تحلیل جستجوهای سایت
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ایجاد کمپین‌های تخفیف، سقف مجاز، و پایش کلمات پرجستجو و بدون نتیجه طبق Epic E09
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
          disabled={!canManage}
        >
          ایجاد کد تخفیف جدید
        </Button>
      </div>

      {/* Coupons Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200">کدهای تخفیف فعال و آرشیو</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discountCodes.map((d) => (
            <Card
              key={d.id}
              className={`p-4 border transition-all ${
                d.isActive ? 'border-blue-500/40 bg-[#151823]' : 'border-slate-800 bg-[#10121a] opacity-70'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-blue-400 tracking-wider">
                      {d.code}
                    </span>
                    <Badge variant={d.isActive ? 'emerald' : 'zinc'}>
                      {d.isActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {d.discountType === 'percentage'
                      ? `${d.value}٪ تخفیف (حداکثر ${formatPrice(d.maxDiscountAmount || 0)})`
                      : `${formatPrice(d.value)} تخفیف نقدی مستقیم`}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant={d.isActive ? 'outline' : 'secondary'}
                  onClick={() => toggleDiscountActive(d.id)}
                  disabled={!canManage}
                >
                  {d.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                </Button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>حداقل سبد خرید: {formatPrice(d.minOrderValue)}</span>
                <span className="font-mono">
                  مصرف: {d.timesUsed} از {d.usageLimit} بار
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Search Keywords Analytics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            تحلیل عبارات جستجوشده در فروشگاه و کالکشن‌ها
          </h3>
          <span className="text-[11px] text-slate-500">
            شناسایی تقاضای خریداران و اصلاح کلمات بدون نتیجه
          </span>
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#151823] shadow-xl">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#10121a] text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">عبارت جستجوشده</th>
                <th className="py-3 px-4">تعداد دفعات جستجو</th>
                <th className="py-3 px-4">نتیجه در کاتالوگ</th>
                <th className="py-3 px-4">سفارش‌های تبدیل‌شده</th>
                <th className="py-3 px-4">اقدام پیشنهادی مدیریت محصول</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {searchKeywords.map((k, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-200">
                    «{k.keyword}»
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-400 font-semibold">
                    {k.count} بار
                  </td>
                  <td className="py-3 px-4">
                    {k.hasResults ? (
                      <Badge variant="emerald">دارای محصول منطبق</Badge>
                    ) : (
                      <Badge variant="rose">بدون نتیجه (Gaps)</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {k.convertedOrders} سفارش
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {k.hasResults
                      ? 'موقعیت کالاها در هیرو یا صفحه کالکشن بهینه است'
                      : 'پیشنهاد: افزودن تگ مترادف یا توسعه محصول در اسپرینت بعدی'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Discount Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="تعریف کد تخفیف جدید"
        description="ایجاد کوپن تخفیف با محدودیت سقف مبلغ و تاریخ انقضا"
        maxWidth="md"
      >
        <form onSubmit={handleCreateDiscount} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">کد تخفیف (لاتین):</label>
            <input
              type="text"
              placeholder="e.g. OUTSPOKEN-WINTER"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#10121a] border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono text-left uppercase focus:outline-none focus:border-blue-500"
              dir="ltr"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">نوع تخفیف:</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-[#10121a] border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="percentage">درصدی (٪)</option>
                <option value="fixed">مبلغ ثابت (تومان)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                مقدار تخفیف {discountType === 'percentage' ? '(درصد)' : '(تومان)'}:
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#10121a] border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">حداقل مبلغ سفارش (تومان):</label>
            <input
              type="number"
              step={500000}
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#10121a] border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {discountType === 'percentage' && (
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                حداکثر سقف تخفیف مجاز (تومان):
              </label>
              <input
                type="number"
                step={500000}
                value={maxDiscountAmount}
                onChange={(e) => setMaxDiscountAmount(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#10121a] border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="text-slate-300 font-medium block mb-1">سقف تعداد دفعات استفاده:</label>
            <input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-[#10121a] border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              انصراف
            </Button>
            <Button type="submit" variant="primary">
              ثبت و فعال‌سازی کد
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
