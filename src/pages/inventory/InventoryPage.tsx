import React, { useState } from 'react';
import { useStore } from '../../app/providers/StoreContext';
import { Variant, Product } from '../../shared/types';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { AdjustStockModal } from '../../features/inventory-adjust/AdjustStockModal';
import { formatDate } from '../../shared/lib/formatters';
import {
  Boxes,
  PlusCircle,
  AlertTriangle,
  History,
  Search,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { variants, products, inventoryLogs, checkPermission } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'stock' | 'logs'>('stock');

  // Selected variant for modal
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedProductTitle, setSelectedProductTitle] = useState('');

  const canManage = checkPermission('manage_inventory');

  const totalHealthy = variants.reduce((s, v) => s + v.stockHealthy, 0);
  const totalReserved = variants.reduce((s, v) => s + v.stockReserved, 0);
  const totalQuarantine = variants.reduce((s, v) => s + v.stockQuarantine, 0);

  const filteredVariants = variants.filter((v) => {
    const prod = products.find((p) => p.id === v.productId);
    const text = `${v.sku} ${v.colorName} ${v.size} ${prod?.titleFa || ''}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const handleOpenAdjust = (v: Variant) => {
    const prod = products.find((p) => p.id === v.productId);
    setSelectedVariant(v);
    setSelectedProductTitle(prod?.titleFa || 'محصول لنگه');
  };

  const reasonLabels = {
    initial_stock: 'ورود محموله از کارگاه دوخت',
    sale_reserved: 'رزرو خرید سبد مشتری',
    sale_fulfilled: 'خروج کالا و تحویل سفارش',
    return_quarantined: 'انتقال مرجوعی به قرنطینه',
    stocktake_adjustment: 'اصلاح انبارگردانی',
    damage: 'خسارت یا استهلاک انبار',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-400" />
            انبار، موجودی و کاردکس گردش کالا
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            کنترل دقیق موجودی فیزیکی، تفکیک انبار سالم، رزروهای سبد و قرنطینه مرجوعی (P0)
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-[#151824] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'stock'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            موجودی واریانت‌ها ({variants.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            کاردکس و لاگ گردش ({inventoryLogs.length})
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-800 bg-[#151823]">
          <span className="text-xs font-medium text-emerald-400 block mb-1">
            موجودی قابل فروش (سالم)
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            {totalHealthy} عدد
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            آماده تخصیص به سفارش و ثبت خرید
          </p>
        </Card>

        <Card className="border-slate-800 bg-[#151823]">
          <span className="text-xs font-medium text-blue-400 block mb-1">
            موجودی در حال رزرو
          </span>
          <div className="text-2xl font-bold font-mono text-blue-300">
            {totalReserved} عدد
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            رزرو در سبد یا فرآیند پرداخت شاپرک
          </p>
        </Card>

        <Card className="border-slate-800 bg-[#151823]">
          <span className="text-xs font-medium text-rose-400 block mb-1">
            انبار قرنطینه (کنترل کیفیت)
          </span>
          <div className="text-2xl font-bold font-mono text-rose-300">
            {totalQuarantine} عدد
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            مرجوعی‌های در انتظار بررسی QC
          </p>
        </Card>
      </div>

      {activeTab === 'stock' ? (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو بر اساس SKU، نام محصول، رنگ یا سایز..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#151824] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 pr-9"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
          </div>

          {/* Variants Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#151823] shadow-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#10121a] text-slate-400 text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">کد واریانت (SKU)</th>
                  <th className="py-3 px-4">محصول</th>
                  <th className="py-3 px-4">رنگ و سایز</th>
                  <th className="py-3 px-4">موجودی سالم</th>
                  <th className="py-3 px-4">رزرو فعال</th>
                  <th className="py-3 px-4">قرنطینه</th>
                  <th className="py-3 px-4">وضعیت</th>
                  <th className="py-3 px-4 text-left">عملیات انبار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVariants.map((v) => {
                  const prod = products.find((p) => p.id === v.productId);
                  const isLow = v.stockHealthy < 5;

                  return (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-blue-400 font-bold" dir="ltr">
                        {v.sku}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {prod?.titleFa || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: v.colorHex }}
                          />
                          <span className="text-slate-300">{v.colorName}</span>
                          <span className="text-slate-500 font-mono">({v.size})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-sm">
                        <span className={isLow ? 'text-rose-400' : 'text-emerald-400'}>
                          {v.stockHealthy}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {v.stockReserved}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {v.stockQuarantine}
                      </td>
                      <td className="py-3 px-4">
                        {isLow ? (
                          <Badge variant="rose">موجودی بحرانی</Badge>
                        ) : (
                          <Badge variant="emerald">مطلوب</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-left">
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={<PlusCircle className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenAdjust(v)}
                          disabled={!canManage}
                        >
                          گردش / اصلاح
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Inventory Logs Tab */
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#151823] shadow-xl">
          <div className="p-4 bg-[#10121a] border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              کاردکس تاریخی گردش موجودی انبار لنگه
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              ثبت‌شده با زمان‌بندی تهران (Asia/Tehran)
            </span>
          </div>

          <table className="w-full text-right text-xs">
            <thead className="bg-[#10121a]/80 text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">زمان</th>
                <th className="py-3 px-4">کد کالا (SKU)</th>
                <th className="py-3 px-4">شرح قلم</th>
                <th className="py-3 px-4">میزان تغییر</th>
                <th className="py-3 px-4">مانده سالم</th>
                <th className="py-3 px-4">علت ثبت</th>
                <th className="py-3 px-4">عامل / اپراتور</th>
                <th className="py-3 px-4">توضیحات و مستندات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {inventoryLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-400 font-bold" dir="ltr">
                    {log.sku}
                  </td>
                  <td className="py-3 px-4 text-neutral-200">
                    <div>{log.productName}</div>
                    <span className="text-[10px] text-neutral-500">{log.variantDesc}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <span
                      className={`inline-flex items-center gap-0.5 ${
                        log.changeAmount > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                      dir="ltr"
                    >
                      {log.changeAmount > 0 ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-200">
                    {log.resultingHealthy}
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {reasonLabels[log.reason] || log.reason}
                  </td>
                  <td className="py-3 px-4 text-neutral-400 font-medium">
                    {log.operator}
                  </td>
                  <td className="py-3 px-4 text-neutral-400 text-[11px]">
                    {log.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust Stock Modal */}
      <AdjustStockModal
        isOpen={Boolean(selectedVariant)}
        onClose={() => setSelectedVariant(null)}
        variant={selectedVariant}
        productTitle={selectedProductTitle}
      />
    </div>
  );
};
