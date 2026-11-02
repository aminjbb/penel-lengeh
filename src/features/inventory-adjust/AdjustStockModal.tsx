import React, { useState } from 'react';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { Variant, InventoryLog } from '../../shared/types';
import { useStore } from '../../app/providers/StoreContext';
import { AlertTriangle, Plus, Minus } from 'lucide-react';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: Variant | null;
  productTitle: string;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  isOpen,
  onClose,
  variant,
  productTitle,
}) => {
  const { adjustInventory, checkPermission } = useStore();
  const [changeType, setChangeType] = useState<'increase' | 'decrease'>('increase');
  const [amount, setAmount] = useState<number>(1);
  const [reason, setReason] = useState<InventoryLog['reason']>('stocktake_adjustment');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!variant) return null;

  const canManage = checkPermission('manage_inventory');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!canManage) {
      setError('شما دسترسی لازم برای اصلاح موجودی انبار را ندارید.');
      return;
    }

    if (amount <= 0) {
      setError('تعداد باید عددی بزرگتر از صفر باشد.');
      return;
    }

    if (!notes.trim()) {
      setError('ثبت توضیح و مستندات اصلاح موجودی طبق دستورالعمل الزامی است.');
      return;
    }

    const delta = changeType === 'increase' ? amount : -amount;
    if (changeType === 'decrease' && variant.stockHealthy < amount) {
      setError(`موجودی سالم فعلی (${variant.stockHealthy}) کمتر از مقدار کسر درخواستی است.`);
      return;
    }

    const success = adjustInventory(variant.sku, delta, reason, notes.trim());
    if (success) {
      onClose();
    } else {
      setError('خطا در به‌روزرسانی موجودی.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ثبت گردش و اصلاح موجودی انبار"
      description={`اصلاح موجودی سالم برای واریانت: ${variant.colorName} - سایز ${variant.size}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!canManage && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>نقش فعلی شما فاقد مجوز ویرایش موجودی انبار است.</span>
          </div>
        )}

        <div className="p-3 bg-[#10121a] rounded-xl border border-slate-800 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">محصول:</span>
            <span className="font-semibold text-slate-200">{productTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">شناسه SKU:</span>
            <span className="font-mono text-blue-400 font-bold">{variant.sku}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">موجودی سالم فعلی:</span>
            <span className="font-bold text-emerald-400">{variant.stockHealthy} عدد</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">رزرو فعال / قرنطینه:</span>
            <span className="text-slate-300">
              {variant.stockReserved} رزرو / {variant.stockQuarantine} قرنطینه
            </span>
          </div>
        </div>

        {/* Change type toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">نوع عملیات:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setChangeType('increase')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                changeType === 'increase'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              افزایش موجودی (ورود کالا)
            </button>
            <button
              type="button"
              onClick={() => setChangeType('decrease')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                changeType === 'decrease'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Minus className="w-4 h-4" />
              کاهش موجودی (کسر / خسارت)
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">تعداد تغییر:</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-[#10121a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            required
          />
        </div>

        {/* Reason */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">علت ثبت گردش:</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as InventoryLog['reason'])}
            className="w-full bg-[#10121a] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          >
            <option value="stocktake_adjustment">اصلاح انبارگردانی دوره‌ای</option>
            <option value="initial_stock">ورود محموله جدید از کارگاه دوخت</option>
            <option value="damage">خسارت / آسیب‌دیدگی در انبار</option>
            <option value="return_quarantined">انتقال از قرنطینه به سالم</option>
          </select>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            توضیحات و شماره بارنامه / ارجاع الزامی:
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="علت دقیق، شماره سند کارگاه یا رسید انبارگردانی..."
            className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" variant="primary" disabled={!canManage}>
            ثبت در کاردکس انبار و لاگ
          </Button>
        </div>
      </form>
    </Modal>
  );
};
