import React, { useState } from 'react';
import { useStore } from '../../app/providers/StoreContext';
import { Customer, SupportCase } from '../../shared/types';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { formatPrice, formatDate } from '../../shared/lib/formatters';
import {
  Users,
  MessageSquare,
  Shield,
  Eye,
  EyeOff,
  Plus,
  Send,
  MapPin,
  ShoppingBag,
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { customers, supportCases, addSupportNote, checkPermission } = useStore();
  const [activeTab, setActiveTab] = useState<'customers' | 'support'>('customers');
  const [showFullPhones, setShowFullPhones] = useState(false);
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null);
  const [newNote, setNewNote] = useState('');

  const canViewPrivate = checkPermission('view_customer_private_data');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newNote.trim()) return;
    addSupportNote(selectedCase.id, newNote.trim());
    setNewNote('');
    // refresh selectedCase
    const updated = supportCases.find((c) => c.id === selectedCase.id);
    if (updated) setSelectedCase(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            مشتریان، حریم خصوصی و پرونده‌های پشتیبانی
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            پروفایل حداقلی خریداران، پوشاندن شماره‌های تماس (Privacy Shield) و تیکت‌های پشتیبانی
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-[#151824] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            خریداران ثبت‌شده ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'support'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            پرونده‌های پشتیبانی ({supportCases.length})
          </button>
        </div>
      </div>

      {activeTab === 'customers' ? (
        <div className="space-y-4">
          {/* Privacy Notice Banner */}
          <div className="p-4 bg-[#151824] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>
                سیاست حفاظت از حریم خصوصی: نمایش کامل شماره موبایل فقط برای نقش‌های مالک و پشتیبانی مجاز است.
              </span>
            </div>
            {canViewPrivate ? (
              <button
                onClick={() => setShowFullPhones(!showFullPhones)}
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-medium cursor-pointer"
              >
                {showFullPhones ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    پوشاندن مجدد شماره‌ها
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    نمایش شماره‌های کامل
                  </>
                )}
              </button>
            ) : (
              <span className="text-[11px] text-slate-500">شماره‌ها ماسک‌شده هستند</span>
            )}
          </div>

          {/* Customers Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#151823] shadow-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#10121a] text-slate-400 text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">نام خریدار</th>
                  <th className="py-3 px-4">شماره تماس</th>
                  <th className="py-3 px-4">تعداد سفارش‌ها</th>
                  <th className="py-3 px-4">مجموع خرید</th>
                  <th className="py-3 px-4">نشانی ثبت‌شده</th>
                  <th className="py-3 px-4">رضایت اطلاع‌رسانی</th>
                  <th className="py-3 px-4">تاریخ ثبت‌نام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-200">
                      {c.fullName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300" dir="ltr">
                      {showFullPhones && canViewPrivate ? c.phoneFull : c.phoneMasked}
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-400 font-semibold">
                      {c.totalOrders} سفارش
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-100">
                      {formatPrice(c.totalSpend)}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                      {c.addresses[0]?.fullAddress || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {c.consentMarketing ? (
                        <Badge variant="emerald">پیامک فعال</Badge>
                      ) : (
                        <Badge variant="zinc">عدم تمایل</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {formatDate(c.registeredAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Support Tickets Tab */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tickets list (1/3) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300">تیکت‌های باز و در حال رسیدگی:</h3>
            {supportCases.map((cs) => (
              <Card
                key={cs.id}
                hoverable
                onClick={() => setSelectedCase(cs)}
                className={`p-3.5 space-y-2 text-xs border transition-all cursor-pointer ${
                  selectedCase?.id === cs.id
                    ? 'border-blue-500/60 bg-blue-950/20'
                    : 'border-slate-800 bg-[#151823]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-400" dir="ltr">
                    {cs.ticketNumber}
                  </span>
                  <Badge
                    variant={
                      cs.priority === 'urgent'
                        ? 'rose'
                        : cs.priority === 'medium'
                        ? 'blue'
                        : 'zinc'
                    }
                  >
                    {cs.priority === 'urgent' ? 'فوری' : 'عادی'}
                  </Badge>
                </div>
                <h4 className="font-semibold text-slate-200 line-clamp-1">{cs.subject}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                  <span>{cs.customerName}</span>
                  <span className="font-mono">{formatDate(cs.createdAt)}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Ticket Detail Drawer (2/3) */}
          <div className="md:col-span-2">
            {selectedCase ? (
              <Card className="p-5 space-y-4 border-slate-800 bg-[#151823]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="font-mono text-xs text-blue-400 block" dir="ltr">
                      {selectedCase.ticketNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{selectedCase.subject}</h3>
                  </div>
                  <Badge variant={selectedCase.status === 'resolved' ? 'emerald' : 'blue'}>
                    {selectedCase.status === 'resolved' ? 'پاسخ داده‌شده و بسته' : 'در حال رسیدگی'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#10121a] p-3 rounded-xl border border-slate-800/60">
                  <div>
                    <span className="text-slate-500 block">خریدار:</span>
                    <span className="font-semibold text-slate-200">
                      {selectedCase.customerName}
                    </span>
                  </div>
                  {selectedCase.orderId && (
                    <div>
                      <span className="text-slate-500 block">سفارش مرتبط:</span>
                      <span className="font-mono text-blue-400 font-semibold" dir="ltr">
                        {selectedCase.orderId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Operator conversation notes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300">
                    تاریخچه یادداشت‌ها و مکاتبات پشتیبانی:
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto p-3 bg-[#10121a] rounded-xl border border-slate-800 text-xs">
                    {selectedCase.operatorNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#151824] rounded-lg border border-slate-800/80 text-slate-300 leading-relaxed"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add new note form */}
                <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-medium text-slate-300 block">
                    ثبت یادداشت جدید در پرونده:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="پاسخ به مشتری یا گزارش تماس تلفنی..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1 bg-[#151824] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      icon={<Send className="w-3.5 h-3.5" />}
                    >
                      ارسال
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
              <Card className="p-12 text-center text-slate-500 border-dashed border-slate-800 bg-[#151823]">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">برای مشاهده تاریخچه و ارسال یادداشت، یک تیکت را انتخاب کنید.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
