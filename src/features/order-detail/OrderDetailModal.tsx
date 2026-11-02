import React, { useState } from 'react';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { Badge } from '../../shared/ui/Badge';
import { Order, OrderStatus } from '../../shared/types';
import { useStore } from '../../app/providers/StoreContext';
import { formatPrice, formatDate } from '../../shared/lib/formatters';
import {
  Clock,
  User,
  MapPin,
  CreditCard,
  Truck,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Award,
} from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOpenVerifyPiece?: (serial: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenVerifyPiece,
}) => {
  const { updateOrderStatus, processRefund, role, checkPermission } = useStore();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('processing');
  const [statusNote, setStatusNote] = useState('');
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('');
  const [actionMessage, setActionMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!order) return null;

  const canManageOrders = checkPermission('manage_orders');
  const canProcessRefund = checkPermission('process_refunds');
  const canViewPrivate = checkPermission('view_customer_private_data');

  const handleStatusUpdate = () => {
    setActionMessage(null);
    if (!canManageOrders) {
      setActionMessage({ text: 'شما مجوز تغییر وضعیت سفارش را ندارید.', isError: true });
      return;
    }
    const success = updateOrderStatus(order.id, selectedStatus, statusNote);
    if (success) {
      setActionMessage({ text: 'وضعیت سفارش با موفقیت به‌روزرسانی شد.', isError: false });
      setStatusNote('');
    }
  };

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null);
    const res = processRefund(order.id, refundAmount || order.finalAmount, refundReason);
    if (res.success) {
      setActionMessage({ text: 'استرداد مالی با موفقیت ثبت شد و وضعیت مالی به‌روزرسانی گردید.', isError: false });
      setShowRefundForm(false);
    } else {
      setActionMessage({ text: res.error || 'خطا در انجام بازپرداخت', isError: true });
    }
  };

  const statusBadgeVariant = (s: OrderStatus) => {
    switch (s) {
      case 'confirmed':
      case 'delivered':
        return 'emerald';
      case 'processing':
      case 'shipped':
        return 'blue';
      case 'pending_payment':
        return 'amber';
      case 'cancelled':
        return 'rose';
      default:
        return 'zinc';
    }
  };

  const statusLabel = (s: OrderStatus) => {
    switch (s) {
      case 'pending_payment':
        return 'در انتظار پرداخت';
      case 'confirmed':
        return 'تأییدشده';
      case 'processing':
        return 'در حال آماده‌سازی و بسته‌بندی';
      case 'shipped':
        return 'تحویل به حامل / در مسیر';
      case 'delivered':
        return 'تحویل‌شده به خریدار';
      case 'cancelled':
        return 'لغوشده';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`جزئیات سفارش ${order.orderNumber}`}
      description={`ثبت‌شده در تاریخ ${formatDate(order.createdAt)}`}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-xs">
        {actionMessage && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              actionMessage.isError
                ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            }`}
          >
            {actionMessage.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Top Badges & Status summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#10121a] rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">وضعیت سفارش:</span>
            <Badge variant={statusBadgeVariant(order.status)} size="md">
              {statusLabel(order.status)}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">وضعیت پرداخت:</span>
            <Badge
              variant={
                order.paymentStatus === 'success'
                  ? 'emerald'
                  : order.paymentStatus === 'refunded'
                  ? 'rose'
                  : order.paymentStatus === 'discrepancy'
                  ? 'amber'
                  : 'zinc'
              }
              size="md"
            >
              {order.paymentStatus === 'success'
                ? 'پرداخت موفق شاپرک'
                : order.paymentStatus === 'refunded'
                ? 'مستردشده (Refund)'
                : order.paymentStatus === 'discrepancy'
                ? 'مغایرت بانکی'
                : 'نامشخص'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">مبلغ نهایی:</span>
            <span className="text-base font-bold text-blue-400 font-mono">
              {formatPrice(order.finalAmount)}
            </span>
          </div>
        </div>

        {/* 2-column info layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer & Shipping info */}
          <div className="p-4 bg-[#10121a] rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
              <User className="w-4 h-4 text-blue-400" />
              اطلاعات مشتری و ارسال
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">نام خریدار:</span>
                <span className="font-semibold text-slate-100">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">شماره تماس (حریم خصوصی):</span>
                <span className="font-mono text-slate-200" dir="ltr">
                  {canViewPrivate ? order.customerPhoneFull : order.customerPhoneMasked}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">روش ارسال:</span>
                <span className="text-slate-200 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  {order.carrier}
                </span>
              </div>
              {order.trackingCode && (
                <div className="flex justify-between">
                  <span className="text-slate-400">کد رهگیری مرسوله:</span>
                  <span className="font-mono text-blue-300 font-semibold" dir="ltr">
                    {order.trackingCode}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  نشانی تحویل:
                </span>
                <p className="text-slate-300 leading-relaxed bg-[#151824] p-2 rounded-lg border border-slate-800/80">
                  {order.shippingAddress.province}، {order.shippingAddress.city}، {order.shippingAddress.postalAddress}
                  <span className="block text-[11px] text-slate-500 font-mono mt-0.5">
                    کد پستی: {order.shippingAddress.postalCode} | گیرنده: {order.shippingAddress.receiverName}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Payment & Gateway info */}
          <div className="p-4 bg-[#10121a] rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
              <CreditCard className="w-4 h-4 text-blue-400" />
              تطبیق مالی و ارائه‌دهنده پرداخت
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">درگاه پرداخت:</span>
                <span className="font-semibold text-slate-200">{order.paymentGateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">شماره مرجع بانکی (RRN):</span>
                <span className="font-mono text-slate-300" dir="ltr">
                  {order.transactionReference}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">کلید تکرارناپذیری (Idempotency):</span>
                <span className="font-mono text-[10px] text-slate-400" dir="ltr">
                  {order.idempotencyKey}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">جمع مبلغ اقلام:</span>
                <span className="text-slate-200 font-mono">{formatPrice(order.totalAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-rose-400 font-mono">
                  <span>تخفیف اعمال‌شده:</span>
                  <span>- {formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">هزینه بسته‌بندی و ارسال:</span>
                <span className="text-emerald-400 font-mono">
                  {order.shippingFee === 0 ? 'رایگان (سفارش ویژه)' : formatPrice(order.shippingFee)}
                </span>
              </div>

              {/* Refund Info if refunded */}
              {order.refundDetails && (
                <div className="p-2.5 bg-rose-950/30 border border-rose-800/50 rounded-lg text-rose-300 mt-2">
                  <div className="font-semibold text-xs flex items-center gap-1.5 mb-1">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    استرداد وجه ثبت‌شده
                  </div>
                  <p className="text-[11px]">مبلغ: {formatPrice(order.refundDetails.amount)}</p>
                  <p className="text-[11px]">علت: {order.refundDetails.reason}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    تأییدکننده: {order.refundDetails.approvedBy} | {formatDate(order.refundDetails.refundedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items Table with Serial Allocation */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-200">اقلام سفارش و سریال‌های تخصیص‌یافته:</h4>
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#10121a]">
            <table className="w-full text-right">
              <thead className="bg-[#151824] text-slate-400 text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">کالا و مشخصات</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">تعداد</th>
                  <th className="py-2.5 px-3">قیمت واحد</th>
                  <th className="py-2.5 px-3">سریال قطعه انحصاری</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#151824]/50">
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-100">{item.productName}</p>
                      <span className="text-[10px] text-slate-400">{item.variantLabel}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300 text-[11px]" dir="ltr">
                      {item.sku}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-200">{item.quantity}</td>
                    <td className="py-3 px-3 font-mono text-slate-200">{formatPrice(item.unitPrice)}</td>
                    <td className="py-3 px-3">
                      {item.pieceSerial ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-blue-400 font-bold bg-blue-600/10 px-2 py-0.5 rounded border border-blue-500/30 text-xs" dir="ltr">
                            {item.pieceSerial}
                          </span>
                          {onOpenVerifyPiece && (
                            <button
                              onClick={() => onOpenVerifyPiece(item.pieceSerial!)}
                              title="استعلام شناسنامه قطعه"
                              className="text-slate-400 hover:text-blue-400 p-1 cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">- (محصول عمومی)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline of events */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            تایم‌لاین چرخه حیات سفارش:
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-[#10121a] rounded-xl border border-slate-800">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{event.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>توسط: {event.actor}</span>
                    {event.note && <span className="text-slate-300">({event.note})</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operations & Status Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          {/* Status Changer */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">تغییر وضعیت:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              className="bg-[#10121a] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              disabled={!canManageOrders}
            >
              <option value="confirmed">تأییدشده</option>
              <option value="processing">در حال آماده‌سازی و بسته‌بندی</option>
              <option value="shipped">ارسال به حامل (پیک/تیپاکس)</option>
              <option value="delivered">تحویل‌شده به خریدار</option>
              <option value="cancelled">لغوشده</option>
            </select>
            <input
              type="text"
              placeholder="توضیح اختیاری..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="bg-[#10121a] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              disabled={!canManageOrders}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleStatusUpdate}
              disabled={!canManageOrders}
            >
              ثبت وضعیت جدید
            </Button>
          </div>

          {/* Refund Trigger */}
          {canProcessRefund && order.paymentStatus !== 'refunded' && (
            <Button
              size="sm"
              variant="danger"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => {
                setShowRefundForm(!showRefundForm);
                setRefundAmount(order.finalAmount);
              }}
            >
              {showRefundForm ? 'بستن فرم استرداد' : 'صدور بازپرداخت مالی'}
            </Button>
          )}
        </div>

        {/* Refund Form Drawer */}
        {showRefundForm && (
          <form
            onSubmit={handleRefundSubmit}
            className="p-4 bg-rose-950/20 border border-rose-800/60 rounded-xl space-y-3"
          >
            <h5 className="font-bold text-rose-300 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              فرم صدور بازپرداخت مالی (تأیید مدیر مالی / مالک)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">
                  مبلغ بازپرداخت (تومان):
                </label>
                <input
                  type="number"
                  max={order.finalAmount}
                  min={1000}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#10121a] border border-rose-800/60 rounded-lg p-2 text-slate-100 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">
                  علت استرداد و شماره سند حسابداری:
                </label>
                <input
                  type="text"
                  placeholder="مثال: مرجوعی طبق تایید QC کارگاه لنگه"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-[#10121a] border border-rose-800/60 rounded-lg p-2 text-slate-100 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowRefundForm(false)}>
                انصراف
              </Button>
              <Button type="submit" variant="danger" size="sm">
                تأیید و اجرای قطعی استرداد وجه
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
