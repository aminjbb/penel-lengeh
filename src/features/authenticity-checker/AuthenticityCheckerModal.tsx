import React, { useState } from 'react';
import { Award, Search, ShieldCheck, CheckCircle2, AlertCircle, FileText, QrCode } from 'lucide-react';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { Badge } from '../../shared/ui/Badge';
import { useStore } from '../../app/providers/StoreContext';
import { EditionPiece } from '../../shared/types';
import { formatDate } from '../../shared/lib/formatters';

interface AuthenticityCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSerial?: string;
}

export const AuthenticityCheckerModal: React.FC<AuthenticityCheckerModalProps> = ({
  isOpen,
  onClose,
  initialSerial = '',
}) => {
  const { editionPieces } = useStore();
  const [searchTerm, setSearchTerm] = useState(initialSerial);
  const [searched, setSearched] = useState(false);
  const [matchedPiece, setMatchedPiece] = useState<EditionPiece | null>(null);

  const handleSearch = (termToSearch = searchTerm) => {
    const clean = termToSearch.trim().toUpperCase();
    if (!clean) return;

    // Search by full serial (e.g. LGH-SHB-001/050) or partial (e.g. LGH-SHB-001)
    const found = editionPieces.find((p) =>
      p.serialNumber.toUpperCase().includes(clean)
    );

    setMatchedPiece(found || null);
    setSearched(true);
  };

  const sampleSerials = ['LGH-SHB-001/050', 'LGH-SHB-002/050', 'LGH-OUT-001/030', 'LGH-OUT-007/030'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="استعلام عمومی اصالت و شناسنامه دیجیتال"
      description="پایگاه داده متمرکز راستی‌آزمایی نسخه‌های محدود و شماره‌گذاری‌شده استودیو لنگه"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">
            شماره سریال قطعه یا شناسنامه (روی لیبل فیزیکی و فاکتور درج شده است):
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="مثال: LGH-SHB-001/050 یا LGH-OUT-001"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-[#10121a] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-left"
                dir="ltr"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
            <Button variant="primary" onClick={() => handleSearch()} icon={<ShieldCheck className="w-4 h-4" />}>
              استعلام
            </Button>
          </div>

          {/* Quick test sample pills */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] text-slate-500">سریال‌های نمونه جهت تست:</span>
            {sampleSerials.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSearchTerm(s);
                  handleSearch(s);
                }}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                dir="ltr"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        {searched && (
          <div>
            {matchedPiece ? (
              <div className="relative border border-blue-500/40 rounded-2xl bg-gradient-to-b from-[#151824] via-[#12141c] to-[#0e1017] p-6 shadow-2xl overflow-hidden">
                {/* Certificate Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-blue-500/20 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">
                        CERTIFICATE OF AUTHENTICITY
                      </span>
                      <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                        شناسنامه اصالت نسخه محدود لنگه
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                      </h4>
                    </div>
                  </div>

                  <div className="text-left" dir="ltr">
                    <Badge variant="blue" size="md">
                      <span className="font-mono font-bold text-sm">{matchedPiece.serialNumber}</span>
                    </Badge>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#0e1017]/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">نام طرح و محصول:</span>
                    <p className="font-bold text-slate-100 text-sm">{matchedPiece.productName}</p>
                    <span className="text-[10px] text-blue-400 font-mono mt-0.5 block">
                      کد SKU: {matchedPiece.sku}
                    </span>
                  </div>

                  <div className="bg-[#0e1017]/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">کالکشن و تیراژ انحصاری:</span>
                    <p className="font-semibold text-slate-200">{matchedPiece.editionName}</p>
                    <p className="text-slate-300 mt-0.5">
                      قطعه شماره <strong className="text-blue-400 font-mono">{matchedPiece.pieceNumber}</strong> از مجموع{' '}
                      <strong className="text-blue-400 font-mono">{matchedPiece.totalPieces}</strong> قطعه
                    </p>
                  </div>

                  <div className="bg-[#0e1017]/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">استادکار و کارگاه دوخت:</span>
                    <p className="text-slate-200">{matchedPiece.craftsman}</p>
                    <span className="text-slate-400 text-[11px] block mt-1">
                      تاریخ اتمام تولید: {matchedPiece.productionDate}
                    </span>
                  </div>

                  <div className="bg-[#0e1017]/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">وضعیت کنونی قطعه و نسخه شناسنامه:</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          matchedPiece.status === 'allocated'
                            ? 'emerald'
                            : matchedPiece.status === 'available'
                            ? 'blue'
                            : matchedPiece.status === 'quarantined'
                            ? 'rose'
                            : 'zinc'
                        }
                      >
                        {matchedPiece.status === 'allocated'
                          ? 'تخصیص‌یافته به خریدار'
                          : matchedPiece.status === 'available'
                          ? 'آزاد در انبار'
                          : matchedPiece.status === 'quarantined'
                          ? 'قرنطینه مرجوعی'
                          : 'ابطال‌شده'}
                      </Badge>
                      <span className="text-[11px] text-slate-400">
                        نسخه سند: <strong className="text-slate-200 font-mono">{matchedPiece.certificateVersion}</strong>
                      </span>
                    </div>
                    {matchedPiece.customerNameMasked && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        مالک ثبت‌شده (حفظ حریم خصوصی): {matchedPiece.customerNameMasked}
                      </p>
                    )}
                  </div>
                </div>

                {/* Material & Craft notes */}
                <div className="mt-4 p-3.5 bg-[#0e1017]/90 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium block mb-1">مشخصات متریال و شناسنامه بافت:</span>
                  <p className="text-slate-200 leading-relaxed">{matchedPiece.materialNote}</p>
                </div>

                {/* History if duplicate was issued */}
                {matchedPiece.certificateHistory.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      تایم‌لاین صدور و اصالت سند:
                    </span>
                    <div className="space-y-1.5">
                      {matchedPiece.certificateHistory.map((h, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] text-slate-400 flex items-center justify-between bg-[#0e1017]/50 px-3 py-1.5 rounded-lg border border-slate-800/60"
                        >
                          <div>
                            <span className="font-semibold text-slate-200">نسخه {h.version}:</span>{' '}
                            <span>{h.reason}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {formatDate(h.issuedAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer security badge */}
                <div className="mt-4 pt-3 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    تأییدشده توسط پایگاه رمزنگاری استودیو مد لنگه (Asia/Tehran)
                  </span>
                  <span className="font-mono text-slate-400">UUID: {matchedPiece.id}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-rose-950/20 border border-rose-800/40 rounded-xl text-rose-300 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-rose-400" />
                <h4 className="text-sm font-bold">سریال مورد نظر یافت نشد</h4>
                <p className="text-xs text-rose-300/80 max-w-md mx-auto">
                  شماره سریالی مطابق با ورودی شما در پایگاه داده نسخه‌های رسمی لنگه یافت نشد. لطفاً دقت فرمایید که فرمت سریال به شکل LGH-SHB-001/050 باشد.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
