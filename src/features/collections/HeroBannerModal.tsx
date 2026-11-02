import React, { useState, useEffect } from 'react';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { HeroBanner } from '../../shared/types';
import { useStore } from '../../app/providers/StoreContext';
import { Image as ImageIcon, AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';

interface HeroBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bannerToEdit?: HeroBanner | null;
}

export const HeroBannerModal: React.FC<HeroBannerModalProps> = ({
  isOpen,
  onClose,
  bannerToEdit,
}) => {
  const { addHeroBanner, updateHeroBanner, collections, checkPermission } = useStore();
  const canManage = checkPermission('manage_collections');

  const isEditing = Boolean(bannerToEdit);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('مشاهده کالکشن و اصالت قطعات');
  const [ctaLink, setCtaLink] = useState('/catalog');
  const [imageUrl, setImageUrl] = useState('');
  const [collectionTag, setCollectionTag] = useState('SHIBUI');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (bannerToEdit) {
        setTitle(bannerToEdit.title || '');
        setSubtitle(bannerToEdit.subtitle || '');
        setCtaText(bannerToEdit.ctaText || 'مشاهده کالکشن و اصالت قطعات');
        setCtaLink(bannerToEdit.ctaLink || '/catalog');
        setImageUrl(bannerToEdit.imageUrl || '');
        setCollectionTag(bannerToEdit.collectionTag || 'SHIBUI');
        setIsActive(bannerToEdit.isActive ?? true);
      } else {
        setTitle('');
        setSubtitle('');
        setCtaText('مشاهده کالکشن و اصالت قطعات');
        setCtaLink('/catalog');
        setImageUrl(
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1400'
        );
        setCollectionTag(collections[0]?.title || 'SHIBUI');
        setIsActive(true);
      }
    }
  }, [isOpen, bannerToEdit, collections]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!canManage) {
      setError('شما دسترسی لازم برای مدیریت بنرها را ندارید.');
      return;
    }

    if (!title.trim() || !subtitle.trim() || !imageUrl.trim() || !ctaText.trim()) {
      setError('عنوان، زیرعنوان، آدرس تصویر و متن دکمه الزامی است.');
      return;
    }

    if (isEditing && bannerToEdit) {
      updateHeroBanner({
        ...bannerToEdit,
        title: title.trim(),
        subtitle: subtitle.trim(),
        ctaText: ctaText.trim(),
        ctaLink: ctaLink.trim(),
        imageUrl: imageUrl.trim(),
        collectionTag: collectionTag.trim().toUpperCase(),
        isActive,
      });
      onClose();
    } else {
      addHeroBanner({
        title: title.trim(),
        subtitle: subtitle.trim(),
        ctaText: ctaText.trim(),
        ctaLink: ctaLink.trim(),
        imageUrl: imageUrl.trim(),
        collectionTag: collectionTag.trim().toUpperCase(),
        isActive,
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      fullScreen={true}
      title={isEditing ? `ویرایش بنر هیرو «${bannerToEdit?.title}»` : 'افزودن بنر هیرو جدید'}
      description="تنظیم تصویر باکیفیت واید، متن دعوت به اقدام و پیش‌نمایش در نمای تمام‌صفحه"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs h-full flex flex-col justify-between">
        {!canManage && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl text-rose-300 flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>نقش جاری شما فاقد مجوز ثبت یا ویرایش بنر است.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Left Column (6 cols): Form fields */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 bg-[#10121a] border border-slate-800 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                مشخصات و محتوای بنر
              </h4>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  عنوان اصلی بنر (تیتر اول):
                </label>
                <input
                  type="text"
                  placeholder="مثال: ترنچ‌کت معماری OUTSPOKEN"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#151824] border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-500 text-sm font-bold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  زیرعنوان توضیحی:
                </label>
                <textarea
                  rows={3}
                  placeholder="مثال: تنها ۳۰ قطعه منحصر‌به‌فرد همراه با شناسنامه فیزیکی و امضای طراح..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-[#151824] border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-500 leading-relaxed text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    برچسب کالکشن مرتبط:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: SHIBUI یا OUTSPOKEN"
                    value={collectionTag}
                    onChange={(e) => setCollectionTag(e.target.value)}
                    className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 font-mono text-left uppercase text-xs focus:outline-none focus:border-blue-500"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    متن دکمه اقدام (CTA):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: مشاهده کاتالوگ و اصالت"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    لینک مقصد دکمه (CTA Link):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: /catalog یا /collections/shibui"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2 text-slate-100 placeholder:text-slate-500 font-mono text-left text-xs focus:outline-none focus:border-blue-500"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    آدرس تصویر عریض (Image URL):
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2 text-slate-100 placeholder:text-slate-500 font-mono text-left text-xs focus:outline-none focus:border-blue-500"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#151824] rounded-xl border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block text-xs">
                    نمایش فعال در صفحه اصلی
                  </span>
                  <span className="text-[10px] text-slate-400">
                    آیا این بنر در اسلایدر بالای سایت لنگه نمایش داده شود؟
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Fullscreen Live Hero Showcase Preview */}
          <div className="lg:col-span-6 space-y-4 flex flex-col">
            <div className="p-5 bg-[#10121a] border border-slate-800 rounded-2xl flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  پیش‌نمایش زنده در صفحه نخست استودیو لنگه
                </h4>
                <p className="text-[11px] text-slate-400 mb-3">
                  نمای بصری که خریداران در دسکتاپ هنگام مراجعه به وب‌سایت لنگه مشاهده می‌کنند:
                </p>

                {/* Live Banner Frame */}
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#151824] border border-blue-500/30 relative shadow-2xl">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      تصویر درج نشده است
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/60 to-black/30" />

                  {/* Top Tag Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="text-[10px] bg-blue-600/25 border border-blue-500/40 text-blue-300 px-3 py-1 rounded-full font-bold">
                      {collectionTag || 'COLLECTION'}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isActive ? 'در حال نمایش' : 'غیرفعال'}
                    </span>
                  </div>

                  {/* Bottom Captions */}
                  <div className="absolute bottom-6 right-6 left-6 space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-100 drop-shadow-md">
                      {title || 'عنوان بنر هیرو'}
                    </h3>
                    <p className="text-xs text-slate-200 line-clamp-2 max-w-lg leading-relaxed drop-shadow">
                      {subtitle || 'زیرعنوان توضیحی و کانسپت کالکشن...'}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-blue-950/50">
                        {ctaText || 'مشاهده کالکشن'} ←
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#151824] rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <span className="text-blue-400 font-semibold block mb-0.5">استاندارد تصویر هیرو:</span>
                تصاویر واید با نسبت ۱۶:۹ یا ۲۱:۹ و حداقل ابعاد ۱۴۰۰×۸۰۰ پیکسل بهترین جلوه بصری را دارند.
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-rose-400 font-medium text-xs">{error}</p>}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 bg-[#0f1117]/80 p-2 rounded-xl shrink-0">
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" variant="primary" disabled={!canManage}>
            {isEditing ? 'ذخیره بنر هیرو' : 'افزودن و انتشار بنر'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
