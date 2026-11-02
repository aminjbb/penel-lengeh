import React, { useState } from 'react';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { ReturnRequest } from '../../shared/types';
import { useStore } from '../../app/providers/StoreContext';
import { CheckCircle2, XCircle, Wrench, ShieldAlert } from 'lucide-react';

interface ReturnQCModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnRequest: ReturnRequest | null;
}

export const ReturnQCModal: React.FC<ReturnQCModalProps> = ({
  isOpen,
  onClose,
  returnRequest,
}) => {
  const { updateReturnQC, checkPermission } = useStore();
  const [qcStatus, setQcStatus] = useState<ReturnRequest['qcStatus']>('approved_healthy');
  const [resolution, setResolution] = useState<ReturnRequest['resolution']>('exchange');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!returnRequest) return null;

  const canManage = checkPermission('manage_returns');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!canManage) {
      setError('شما دسترسی ثبت نتایج کنترل کیفیت را ندارید.');
      return;
    }

    if (!notes.trim()) {
      setError('ثبت گزارش کارشناسی وضعیت دوخت و متریال الزامی است.');
      return;
    }

    const ok = updateReturnQC(returnRequest.id, qcStatus, resolution, notes.trim());
    if (ok) {
      onClose();
    } else {
      setError('خطا در ذخیره‌سازی نتیجه QC');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`کنترل کیفیت و تصمیم مرجوعی ${returnRequest.rmaNumber}`}
      description={`سفارش مرتبط: ${returnRequest.orderNumber} - متقاضی: ${returnRequest.customerName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-[#10121a] rounded-xl border border-slate-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">کالا:</span>
            <span className="font-semibold text-slate-200">{returnRequest.productName}</span>
          </div>
          {returnRequest.pieceSerial && (
            <div className="flex justify-between">
              <span className="text-slate-400">سریال قطعه مرجوعی:</span>
              <span className="font-mono text-blue-400 font-bold" dir="ltr">
                {returnRequest.pieceSerial}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">علت اظهارشده مشتری:</span>
            <span className="text-slate-300">
              {returnRequest.returnReason === 'size_mismatch'
                ? 'عدم تطابق سایز خریدار'
                : returnRequest.returnReason === 'defect'
                ? 'ایراد یا نقص در دوخت'
                : 'انصراف خریدار'}
            </span>
          </div>
        </div>

        {/* QC Status choice */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium block">نتیجه بازرسی فیزیکی (QC):</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setQcStatus('approved_healthy')}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                qcStatus === 'approved_healthy'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
              <span className="block font-semibold text-[11px]">کاملاً سالم</span>
              <span className="text-[9px] text-slate-400">بدون بو و آسیب</span>
            </button>

            <button
              type="button"
              onClick={() => setQcStatus('approved_repairable')}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                qcStatus === 'approved_repairable'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              <span className="block font-semibold text-[11px]">نیاز به رفو</span>
              <span className="text-[9px] text-slate-400">ارسال به آتلیه</span>
            </button>

            <button
              type="button"
              onClick={() => setQcStatus('rejected')}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                qcStatus === 'rejected'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <XCircle className="w-4 h-4 mx-auto mb-1 text-rose-400" />
              <span className="block font-semibold text-[11px]">رد مرجوعی</span>
              <span className="text-[9px] text-slate-400">نقض شرایط بازگشت</span>
            </button>
          </div>
        </div>

        {/* Resolution */}
        <div className="space-y-1">
          <label className="text-slate-300 font-medium block">تصمیم نهایی پرونده:</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value as ReturnRequest['resolution'])}
            className="w-full bg-[#10121a] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
          >
            <option value="exchange">تعویض کالا / ارسال سایز جدید</option>
            <option value="refund">ارجاع به واحد مالی جهت استرداد وجه (Refund)</option>
            <option value="rejected">رد درخواست و عودت مرسوله به مشتری</option>
          </select>
        </div>

        {/* QC Notes */}
        <div className="space-y-1">
          <label className="text-slate-300 font-medium block">
            گزارش کارشناس کنترل کیفیت و شماره پلمپ:
          </label>
          <textarea
            rows={2}
            placeholder="بررسی پارچه، زیپ، یراق و پلاک اصالت..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {error && <p className="text-rose-400 font-medium">{error}</p>}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" variant="primary" disabled={!canManage}>
            ثبت در پرونده مرجوعی
          </Button>
        </div>
      </form>
    </Modal>
  );
};
