import React, { useState } from 'react';
import { useStore } from '../../app/providers/StoreContext';
import { Order, OrderStatus } from '../../shared/types';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { OrderDetailModal } from '../../features/order-detail/OrderDetailModal';
import { formatPrice, formatDate } from '../../shared/lib/formatters';
import {
  ShoppingBag,
  Search,
  Filter,
  CreditCard,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronLeft,
} from 'lucide-react';

interface OrdersPageProps {
  onOpenVerifyPiece: (serial: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onOpenVerifyPiece }) => {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.transactionReference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusTabItems: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'همه سفارش‌ها', count: orders.length },
    {
      id: 'processing',
      label: 'در حال بسته‌بندی',
      count: orders.filter((o) => o.status === 'processing').length,
    },
    {
      id: 'confirmed',
      label: 'تأییدشده',
      count: orders.filter((o) => o.status === 'confirmed').length,
    },
    {
      id: 'shipped',
      label: 'ارسال‌شده',
      count: orders.filter((o) => o.status === 'shipped').length,
    },
    {
      id: 'delivered',
      label: 'تحویل‌شده',
      count: orders.filter((o) => o.status === 'delivered').length,
    },
    {
      id: 'cancelled',
      label: 'لغوشده / مرجوعی',
      count: orders.filter((o) => o.status === 'cancelled').length,
    },
  ];

  const getStatusBadge = (s: OrderStatus) => {
    switch (s) {
      case 'confirmed':
        return <Badge variant="emerald">تأییدشده</Badge>;
      case 'processing':
        return <Badge variant="blue">در حال بسته‌بندی لوکس</Badge>;
      case 'shipped':
        return <Badge variant="cyan">ارسال به حامل</Badge>;
      case 'delivered':
        return <Badge variant="emerald">تحویل‌شده به خریدار</Badge>;
      case 'cancelled':
        return <Badge variant="rose">لغوشده</Badge>;
      case 'pending_payment':
        return <Badge variant="amber">در انتظار پرداخت</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            مدیریت سفارش‌ها و تطبیق تراکنش‌های مالی
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ثبت سفارش، رهگیری چرخه‌حیات، تطبیق شاپرک و اجرای بازپرداخت‌های مجاز (P0)
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statusTabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                : 'bg-[#151824] hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === tab.id
                  ? 'bg-blue-800/80 text-blue-200'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="جستجوی شماره سفارش (مانند LGH-2026-10501)، نام خریدار یا کد پیگیری بانکی..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#151824] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 pr-9"
        />
        <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
      </div>

      {/* Orders List Table */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#151823] shadow-xl">
        <table className="w-full text-right text-xs">
          <thead className="bg-[#10121a] text-slate-400 text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">شماره سفارش</th>
              <th className="py-3 px-4">مشتری</th>
              <th className="py-3 px-4">اقلام سفارش و سریال</th>
              <th className="py-3 px-4">مبلغ پرداختی</th>
              <th className="py-3 px-4">درگاه و پرداخت</th>
              <th className="py-3 px-4">وضعیت سفارش</th>
              <th className="py-3 px-4">زمان ثبت</th>
              <th className="py-3 px-4 text-left">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredOrders.map((order) => {
              const hasSerial = order.items.some((i) => i.pieceSerial);

              return (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400" dir="ltr">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{order.customerName}</div>
                    <span className="text-[10px] text-slate-500 font-mono" dir="ltr">
                      {order.customerPhoneMasked}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="line-clamp-1">{order.items.map((i) => i.productName).join('، ')}</div>
                    {hasSerial && (
                      <span className="text-[10px] text-blue-400 font-mono flex items-center gap-1 mt-0.5">
                        سریال تخصیص‌یافته: {order.items.find((i) => i.pieceSerial)?.pieceSerial}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                    {formatPrice(order.finalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300">{order.paymentGateway}</div>
                    <span
                      className={`text-[10px] font-semibold ${
                        order.paymentStatus === 'success'
                          ? 'text-emerald-400'
                          : order.paymentStatus === 'refunded'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {order.paymentStatus === 'success'
                        ? 'تراکنش موفق شاپرک'
                        : order.paymentStatus === 'refunded'
                        ? 'استرداد وجه شده'
                        : 'مغایرت / در انتظار'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-left">
                    <Button size="sm" variant="ghost">
                      جزئیات ←
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onOpenVerifyPiece={onOpenVerifyPiece}
      />
    </div>
  );
};
