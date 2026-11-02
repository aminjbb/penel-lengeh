import React, { useState } from 'react';
import { useStore } from '../../app/providers/StoreContext';
import { ReturnRequest } from '../../shared/types';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { ReturnQCModal } from '../../features/return-qc-modal/ReturnQCModal';
import { formatDate } from '../../shared/lib/formatters';
import {
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wrench,
  Search,
  ExternalLink,
} from 'lucide-react';

export const ShipmentsPage: React.FC = () => {
  const { orders, returns, checkPermission } = useStore();
  const [activeTab, setActiveTab] = useState<'returns' | 'shipments'>('returns');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);

  const canManage = checkPermission('manage_returns');

  const pendingQC = returns.filter((r) => r.qcStatus === 'pending');
  const approvedHealthy = returns.filter((r) => r.qcStatus === 'approved_healthy');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-400" />
            ارسال، رهگیری حامل‌ها و کنترل کیفیت مرجوعی (QC)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            بررسی پرونده‌های RMA، کنترل سلامت قطعات بازگشتی، تصمیم تعویض یا استرداد و کدهای رهگیری
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-[#151824] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'returns'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            پرونده‌های مرجوعی ({returns.length})
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'shipments'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            مرسوله‌ها و حامل‌ها ({orders.filter((o) => o.trackingCode).length})
          </button>
        </div>
      </div>

      {activeTab === 'returns' ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-800 bg-[#151823] p-4">
              <span className="text-xs font-medium text-blue-400 block mb-1">
                در انتظار کنترل کیفیت (QC)
              </span>
              <div className="text-2xl font-bold font-mono text-blue-300">
                {pendingQC.length} پرونده
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                مرسوله رسیده به آتلیه نیازمند تایید کارشناس
              </p>
            </Card>

            <Card className="border-slate-800 bg-[#151823] p-4">
              <span className="text-xs font-medium text-emerald-400 block mb-1">
                تأییدشده سالم (انبار قرنطینه)
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-300">
                {approvedHealthy.length} پرونده
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                آماده تعویض سایز یا ارجاع به امور مالی
              </p>
            </Card>

            <Card className="border-slate-800 bg-[#151823] p-4">
              <span className="text-xs font-medium text-cyan-400 block mb-1">
                ضمانت مرجوعی ۷ روزه لنگه
              </span>
              <div className="text-xs text-slate-300 font-medium">
                شرط عدم استفاده، حفظ برچسب اصالت و جعبه فابریک
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                مطابق استانداردهای کالکشن‌های پوشاک لوکس
              </p>
            </Card>
          </div>

          {/* Returns Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#151823] shadow-xl">
            <div className="p-4 bg-[#10121a] border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-blue-400" />
                فهرست درخواست‌های مرجوعی و بازرسی فیزیکی (RMA)
              </h3>
            </div>

            <table className="w-full text-right text-xs">
              <thead className="bg-[#10121a] text-slate-400 text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">شماره RMA</th>
                  <th className="py-3 px-4">سفارش و مشتری</th>
                  <th className="py-3 px-4">کالا و سریال قطعه</th>
                  <th className="py-3 px-4">علت اظهارشده</th>
                  <th className="py-3 px-4">نتیجه کنترل کیفیت (QC)</th>
                  <th className="py-3 px-4">راهکار نهایی</th>
                  <th className="py-3 px-4">تاریخ ثبت</th>
                  <th className="py-3 px-4 text-left">عملیات بازرسی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {returns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-blue-400" dir="ltr">
                      {ret.rmaNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{ret.customerName}</div>
                      <span className="text-[10px] text-slate-500 font-mono" dir="ltr">
                        {ret.orderNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-neutral-200">{ret.productName}</div>
                      {ret.pieceSerial && (
                        <span className="font-mono text-[10px] text-amber-400" dir="ltr">
                          {ret.pieceSerial}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-300">
                      {ret.returnReason === 'size_mismatch'
                        ? 'عدم تطابق سایز خریدار'
                        : ret.returnReason === 'defect'
                        ? 'ایراد یا نقص در دوخت'
                        : 'انصراف خریدار'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          ret.qcStatus === 'approved_healthy'
                            ? 'emerald'
                            : ret.qcStatus === 'approved_repairable'
                            ? 'amber'
                            : ret.qcStatus === 'rejected'
                            ? 'rose'
                            : 'zinc'
                        }
                      >
                        {ret.qcStatus === 'approved_healthy'
                          ? 'تأیید کاملاً سالم'
                          : ret.qcStatus === 'approved_repairable'
                          ? 'نیاز به رفو در آتلیه'
                          : ret.qcStatus === 'rejected'
                          ? 'رد مرجوعی'
                          : 'در انتظار بازرسی'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">
                      {ret.resolution === 'exchange'
                        ? 'تعویض سایز/طرح'
                        : ret.resolution === 'refund'
                        ? 'استرداد وجه مالی'
                        : ret.resolution === 'rejected'
                        ? 'ردشده و عودت'
                        : 'مشخص‌نشده'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                      {formatDate(ret.requestedAt)}
                    </td>
                    <td className="py-3 px-4 text-left">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<Wrench className="w-3 h-3" />}
                        onClick={() => setSelectedReturn(ret)}
                        disabled={!canManage}
                      >
                        ثبت نتیجه QC
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Shipments and Carriers list */
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#151823] shadow-xl">
          <div className="p-4 bg-[#10121a] border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              مرسوله‌های در حال ارسال و کدهای رهگیری حامل‌ها
            </h3>
          </div>

          <table className="w-full text-right text-xs">
            <thead className="bg-[#10121a] text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">شماره سفارش</th>
                <th className="py-3 px-4">گیرنده و مقصد</th>
                <th className="py-3 px-4">شرکت حامل / روش ارسال</th>
                <th className="py-3 px-4">کد رهگیری رسمی</th>
                <th className="py-3 px-4">وضعیت تحویل</th>
                <th className="py-3 px-4">زمان ثبت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders
                .filter((o) => o.trackingCode)
                .map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-blue-400" dir="ltr">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">
                        {order.shippingAddress.receiverName}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {order.shippingAddress.city}، {order.shippingAddress.province}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {order.carrier}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400" dir="ltr">
                      {order.trackingCode}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          order.status === 'delivered'
                            ? 'emerald'
                            : order.status === 'shipped'
                            ? 'cyan'
                            : 'blue'
                        }
                      >
                        {order.status === 'delivered'
                          ? 'تحویل‌شده'
                          : order.status === 'shipped'
                          ? 'در مسیر انتقال'
                          : 'در حال بسته‌بندی'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Return QC Modal */}
      <ReturnQCModal
        isOpen={Boolean(selectedReturn)}
        onClose={() => setSelectedReturn(null)}
        returnRequest={selectedReturn}
      />
    </div>
  );
};
