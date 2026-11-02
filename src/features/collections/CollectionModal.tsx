import React, { useState, useEffect } from 'react';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { CollectionItem } from '../../shared/types';
import { useStore } from '../../app/providers/StoreContext';
import { Plus, Trash2, Image as ImageIcon, Sparkles, AlertTriangle, Layers } from 'lucide-react';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionToEdit?: CollectionItem | null;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  collectionToEdit,
}) => {
  const { addCollection, updateCollection, checkPermission } = useStore();
  const canManage = checkPermission('manage_collections');

  const isEditing = Boolean(collectionToEdit);

  const [title, setTitle] = useState('');
  const [titleFa, setTitleFa] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [concept, setConcept] = useState('');
  const [story, setStory] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [lookbook, setLookbook] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (collectionToEdit) {
        setTitle(collectionToEdit.title || '');
        setTitleFa(collectionToEdit.titleFa || '');
        setSlug(collectionToEdit.slug || '');
        setSubtitle(collectionToEdit.subtitle || '');
        setConcept(collectionToEdit.concept || '');
        setStory(collectionToEdit.story || '');
        setHeroImage(collectionToEdit.heroImage || '');
        setLookbook(
          collectionToEdit.lookbook && collectionToEdit.lookbook.length > 0
            ? [...collectionToEdit.lookbook]
            : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800']
        );
        setIsActive(collectionToEdit.isActive ?? true);
      } else {
        setTitle('');
        setTitleFa('');
        setSlug('');
        setSubtitle('');
        setConcept('');
        setStory('');
        setHeroImage(
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200'
        );
        setLookbook([
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
        ]);
        setIsActive(true);
      }
    }
  }, [isOpen, collectionToEdit]);

  const handleAddLookbookRow = () => {
    setLookbook([...lookbook, '']);
  };

  const handleRemoveLookbookRow = (index: number) => {
    if (lookbook.length <= 1) return;
    setLookbook(lookbook.filter((_, i) => i !== index));
  };

  const handleLookbookChange = (index: number, val: string) => {
    const updated = [...lookbook];
    updated[index] = val;
    setLookbook(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!canManage) {
      setError('شما دسترسی لازم برای مدیریت کالکشن‌ها را ندارید.');
      return;
    }

    if (!title.trim() || !titleFa.trim() || !concept.trim() || !story.trim()) {
      setError('عنوان لاتین، نام فارسی، مفهوم و داستان کالکشن الزامی است.');
      return;
    }

    const cleanSlug = slug.trim()
      ? slug.trim().toLowerCase().replace(/\s+/g, '-')
      : title.trim().toLowerCase().replace(/\s+/g, '-');

    const cleanLookbook = lookbook
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (isEditing && collectionToEdit) {
      updateCollection({
        ...collectionToEdit,
        title: title.trim().toUpperCase(),
        titleFa: titleFa.trim(),
        slug: cleanSlug,
        subtitle: subtitle.trim(),
        concept: concept.trim(),
        story: story.trim(),
        heroImage: heroImage.trim(),
        lookbook: cleanLookbook.length > 0 ? cleanLookbook : collectionToEdit.lookbook,
        isActive,
      });
      onClose();
    } else {
      addCollection({
        title: title.trim().toUpperCase(),
        titleFa: titleFa.trim(),
        slug: cleanSlug,
        subtitle: subtitle.trim(),
        concept: concept.trim(),
        story: story.trim(),
        heroImage: heroImage.trim(),
        lookbook: cleanLookbook,
        isActive,
        releaseDate: new Date().toISOString(),
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      fullScreen={true}
      title={isEditing ? `ویرایش کالکشن «${collectionToEdit?.title}»` : 'تعریف کالکشن جدید آتلیه'}
      description="تنظیم مشخصات هویتی، بیانیه فلسفی، تصویر شاخص و کتابخانه لوک‌بوک کالکشن در نمای تمام‌صفحه"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs h-full flex flex-col justify-between">
        {!canManage && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl text-rose-300 flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>نقش جاری شما فاقد مجوز ثبت یا ویرایش کالکشن است.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Left Column (7 cols): Concept, Narrative & Hero Image */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 bg-[#10121a] border border-slate-800 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Layers className="w-4 h-4 text-blue-400" />
                هویت و نام‌گذاری کالکشن
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    عنوان لاتین کالکشن (English):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SHIBUI or CAPSULE-01"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 font-mono text-left uppercase text-sm font-bold tracking-wider focus:outline-none focus:border-blue-500"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    نام فارسی رسمی:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: کالکشن شیبویی (Shibui)"
                    value={titleFa}
                    onChange={(e) => setTitleFa(e.target.value)}
                    className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 text-sm font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    اسلاگ آدرس (Slug):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. shibui"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2 text-slate-100 placeholder:text-slate-500 font-mono text-left focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    زیرعنوان معرفی (Subtitle):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: زیبایی در سادگی خاموش و وقار نامحسوس"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#10121a] border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
                روایت، فلسفه و مفهوم معماری کالکشن
              </h4>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  مفهوم و ساختار دیزاین (Design Concept):
                </label>
                <textarea
                  rows={2}
                  placeholder="الهام‌گرفته از زیبایی‌شناسی ژاپنی با ساختار مینیمال، دوخت‌های دست‌دوز و پارچه‌های ارگانیک..."
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 leading-relaxed focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  روایت فلسفی و بیانیه برند (Collection Story):
                </label>
                <textarea
                  rows={3}
                  placeholder="روایت فلسفی در مورد هنر سکوت، ظرافت الیاف و تیراژ انحصاری ۵۰ نسخه‌ای..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 leading-relaxed focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-[#10121a] border border-slate-800 rounded-2xl space-y-3">
              <label className="text-slate-200 font-bold block">
                تصویر شاخص و کاور اصلی کالکشن (Hero Image):
              </label>
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#151824] border border-slate-700 rounded-lg p-2 text-slate-100 placeholder:text-slate-500 font-mono text-left focus:outline-none focus:border-blue-500"
                dir="ltr"
                required
              />

              {heroImage && (
                <div className="aspect-[21/9] rounded-xl overflow-hidden bg-[#151824] border border-slate-700 relative">
                  <img
                    src={heroImage}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] text-blue-300 font-medium">پیش‌نمایش تصویر شاخص کالکشن</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Dynamic Lookbook Gallery & Status */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-[#10121a] border border-slate-800 rounded-2xl space-y-3 flex flex-col h-full">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    گالری تصاویر لوک‌بوک (Lookbook Visuals)
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    استایل‌ها و شات‌های هنری عمودی
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddLookbookRow}
                  className="text-xs bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/40 text-blue-300 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  تصویر جدید
                </button>
              </div>

              {/* Lookbook list */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1">
                {lookbook.map((url, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#151824] rounded-xl border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-blue-400 font-bold">Look #{idx + 1}</span>
                      {lookbook.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLookbookRow(idx)}
                          className="text-slate-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          حذف این شات
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-16 h-20 rounded-lg bg-[#10121a] border border-slate-700 overflow-hidden shrink-0">
                        {url ? (
                          <img
                            src={url}
                            alt={`Look ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-mono">
                            بدون عکس
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 block mb-1">
                          لینک تصویر لوک‌بوک (Image URL):
                        </label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={url}
                          onChange={(e) => handleLookbookChange(idx, e.target.value)}
                          className="w-full bg-[#10121a] border border-slate-700 rounded-lg p-2 text-[11px] font-mono text-left text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                          dir="ltr"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active status */}
              <div className="flex items-center justify-between p-3.5 bg-[#151824] rounded-xl border border-slate-800 mt-auto">
                <div>
                  <span className="font-semibold text-slate-200 block text-xs">
                    وضعیت انتشار در کاتالوگ و منو
                  </span>
                  <span className="text-[10px] text-slate-400">
                    فعال‌سازی دسترسی و عرضه عمومی قطعات
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
        </div>

        {error && <p className="text-rose-400 font-medium text-xs">{error}</p>}

        {/* Footer sticky bar */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 bg-[#0f1117]/80 p-2 rounded-xl shrink-0">
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" variant="primary" disabled={!canManage}>
            {isEditing ? 'ذخیره و انتشار تغییرات کالکشن' : 'ثبت قطعی کالکشن در استودیو لنگه'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
