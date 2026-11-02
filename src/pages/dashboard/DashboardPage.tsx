import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Boxes,
  Award,
  Truck,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Plus,
  Users,
} from 'lucide-react';
import { useStore } from '../../app/providers/StoreContext';
import { formatPrice, formatDate } from '../../shared/lib/formatters';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';

interface DashboardPageProps {
  onNavigate: (tabId: string) => void;
  onOpenProductModal: () => void;
  onOpenVerifyModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenProductModal,
  onOpenVerifyModal,
}) => {
  const { orders, variants, products, customers, auditLogs, returns, role } = useStore();

  // Metrics
  const totalSales = orders
    .filter((o) => o.paymentStatus === 'success')
    .reduce((sum, o) => sum + o.finalAmount, 0);

  const pendingOrders = orders.filter(
    (o) => o.status === 'pending_payment' || o.status === 'processing'
  );

  const lowStockVariants = variants.filter((v) => v.stockHealthy < 5);
  const pendingReturns = returns.filter((r) => r.qcStatus === 'pending');
  const discrepancies = orders.filter((o) => o.paymentStatus === 'discrepancy');

  return (
    <div className="space-y-6">
      {/* Welcome & Highlights Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#141722] via-[#161a26] to-[#10121a] p-6 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif-brand text-xs font-semibold tracking-wider text-blue-400 uppercase">
                LENGEH HAUTE COUTURE & STUDIO
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">پنل کنترل متمرکز عملیات</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              خوش‌آمدید به استودیو مدیریت لنگه
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              کنترل یکپارچه کاتالوگ کالکشن‌های شیبویی و آوت‌اسپوکن، شناسنامه‌های دیجیتال اصالت، گردش انبار سالم و قرنطینه، و سفارش‌های لوکس.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              icon={<Award className="w-4 h-4 text-blue-400" />}
              onClick={onOpenVerifyModal}
            >
              استعلام اصالت قطعه
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={onOpenProductModal}
            >
              محصول جدید
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <Card className="relative overflow-hidden border-slate-800 bg-[#151823]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">مجموع فروش واریزشده</span>
            <div className="w-8 h-8 rounded-lg bg-blue-600/15 text-blue-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">
            {formatPrice(totalSales)}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>۱۰۰٪ تطبیق با حساب شاپرک</span>
          </div>
        </Card>

        {/* Action Required Orders */}
        <Card
          hoverable
          onClick={() => onNavigate('orders')}
          className="relative overflow-hidden border-slate-800 bg-[#151823]"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">سفارش‌های نیازمند اقدام</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-600/15 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">
            {pendingOrders.length} سفارش
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {pendingOrders.filter((o) => o.status === 'processing').length} در حال بسته‌بندی لوکس
          </p>
        </Card>

        {/* Low Stock Alert */}
        <Card
          hoverable
          onClick={() => onNavigate('inventory')}
          className={`relative overflow-hidden ${
            lowStockVariants.length > 0 ? 'border-rose-900/40 bg-rose-950/20' : 'border-slate-800 bg-[#151823]'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">هشدار موجودی کم انبار</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">
            {lowStockVariants.length} واریانت
          </div>
          <p className="text-[11px] text-rose-300/80 mt-2">
            موجودی زیر ۵ عدد نیازمند سفارش دوخت
          </p>
        </Card>

        {/* Customers KPI */}
        <Card
          hoverable
          onClick={() => onNavigate('customers')}
          className="relative overflow-hidden border-slate-800 bg-[#151823]"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">باشگاه مشتریان و خریداران</span>
            <div className="w-8 h-8 rounded-lg bg-blue-600/15 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">
            {customers.length} مخاطب
          </div>
          <p className="text-[11px] text-blue-300/80 mt-2">
            {customers.filter((c) => c.totalOrders > 1).length} خریدار وفادار و تکرار خرید
          </p>
        </Card>
      </div>

      {/* Discrepancy & Returns Alert Banner if any */}
      {(discrepancies.length > 0 || pendingReturns.length > 0) && (
        <div className="p-4 bg-blue-950/30 border border-blue-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-blue-200">
            <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <span className="font-bold text-white">اقدامات فوری عملیاتی: </span>
              <span className="text-slate-300">
                {pendingReturns.length > 0 && `${pendingReturns.length} درخواست مرجوعی نیازمند کنترل کیفیت (QC). `}
                {discrepancies.length > 0 && `${discrepancies.length} تراکنش پرداخت نامشخص نیازمند بازبینی مالی.`}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate(pendingReturns.length > 0 ? 'shipments' : 'orders')}
          >
            بررسی موارد
          </Button>
        </div>
      )}

      {/* Main 2-column Dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Recent Orders & Collections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-400" />
                آخرین سفارش‌های ثبت‌شده
              </h3>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
              >
                مشاهده همه سفارش‌ها ←
              </button>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  onClick={() => onNavigate('orders')}
                  className="p-3.5 bg-[#10121a] hover:bg-slate-800/50 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200" dir="ltr">
                        {order.orderNumber}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="font-semibold text-slate-200">{order.customerName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {order.items.map((i) => i.productName).join(' + ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:justify-end">
                    <div className="text-left">
                      <span className="font-bold text-blue-300 block font-mono">
                        {formatPrice(order.finalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'emerald'
                          : order.status === 'processing' || order.status === 'shipped'
                          ? 'blue'
                          : order.status === 'cancelled'
                          ? 'rose'
                          : 'zinc'
                      }
                    >
                      {order.status === 'processing'
                        ? 'بسته‌بندی'
                        : order.status === 'shipped'
                        ? 'ارسال‌شده'
                        : order.status === 'delivered'
                        ? 'تحویل‌شده'
                        : order.status === 'cancelled'
                        ? 'لغوشده'
                        : 'در انتظار'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Collection Status Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-[#151823] border-slate-800 p-4">
              <span className="text-[10px] text-blue-400 font-mono uppercase tracking-widest block mb-1">
                COLLECTION 01
              </span>
              <h4 className="text-base font-bold text-slate-100 font-serif-brand">SHIBUI</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                مینیمال ژاپنی با الیاف طبیعی و طراحی متمرکز بر اصالت خطوط
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">محصولات فعال:</span>
                <span className="font-mono text-blue-400 font-semibold">
                  {products.filter((p) => p.collectionId === 'shibui').length} محصول
                </span>
              </div>
            </Card>

            <Card className="bg-[#151823] border-slate-800 p-4">
              <span className="text-[10px] text-blue-400 font-mono uppercase tracking-widest block mb-1">
                COLLECTION 02
              </span>
              <h4 className="text-base font-bold text-slate-100 font-serif-brand">OUTSPOKEN</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                فرم‌های ساختارشکن و چرم دباغی‌شده گیاهی با دوخت اختصاصی
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">محصولات فعال:</span>
                <span className="font-mono text-blue-400 font-semibold">
                  {products.filter((p) => p.collectionId === 'outspoken').length} محصول
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column (1/3): Audit Trail Activity & System Status */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                ثبت رویدادهای حساس (Audit Trail)
              </h3>
              <button
                onClick={() => onNavigate('audit')}
                className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                کامل ←
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-[#10121a] rounded-xl border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{log.action}</span>
                    <Badge variant="zinc" size="sm">
                      {log.category}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>{log.actorName}</span>
                    <span className="font-mono">{formatDate(log.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="p-4 bg-[#151823] border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300">دسترسی‌های سریع</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('inventory')}
                className="p-2.5 bg-slate-800/70 hover:bg-slate-700/80 rounded-lg text-right text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Boxes className="w-4 h-4 text-blue-400 mb-1" />
                <span>کاردکس انبار</span>
              </button>
              <button
                onClick={() => onNavigate('shipments')}
                className="p-2.5 bg-slate-800/70 hover:bg-slate-700/80 rounded-lg text-right text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Truck className="w-4 h-4 text-cyan-400 mb-1" />
                <span>رهگیری مرسوله‌ها</span>
              </button>
              <button
                onClick={() => onNavigate('marketing')}
                className="p-2.5 bg-slate-800/70 hover:bg-slate-700/80 rounded-lg text-right text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-emerald-400 mb-1" />
                <span>کدهای تخفیف</span>
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className="p-2.5 bg-slate-800/70 hover:bg-slate-700/80 rounded-lg text-right text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400 mb-1" />
                <span>ماتریس دسترسی</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
