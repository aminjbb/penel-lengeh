import React, { useState } from 'react';
import { useStore } from '../../app/providers/StoreContext';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { CollectionItem, HeroBanner } from '../../shared/types';
import { CollectionModal } from '../../features/collections/CollectionModal';
import { HeroBannerModal } from '../../features/collections/HeroBannerModal';
import {
  Sparkles,
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const {
    collections,
    heroBanners,
    deleteCollection,
    deleteHeroBanner,
    updateHeroBanner,
    checkPermission,
  } = useStore();

  const canManage = checkPermission('manage_collections');

  // Modals state
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleOpenAddCollection = () => {
    setEditingCollection(null);
    setIsCollectionModalOpen(true);
  };

  const handleOpenEditCollection = (col: CollectionItem) => {
    setEditingCollection(col);
    setIsCollectionModalOpen(true);
  };

  const handleDeleteCollection = (col: CollectionItem) => {
    setStatusMessage(null);
    if (!confirm(`آیا از حذف کالکشن «${col.title}» (${col.titleFa}) اطمینان دارید؟`)) {
      return;
    }

    const res = deleteCollection(col.id);
    if (res.success) {
      setStatusMessage({
        text: `کالکشن «${col.title}» با موفقیت حذف شد.`,
        isError: false,
      });
    } else {
      setStatusMessage({
        text: res.error || 'خطا در حذف کالکشن.',
        isError: true,
      });
    }
  };

  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: HeroBanner) => {
    setEditingBanner(b);
    setIsBannerModalOpen(true);
  };

  const handleDeleteBanner = (b: HeroBanner) => {
    setStatusMessage(null);
    if (!confirm(`آیا از حذف بنر هیرو «${b.title}» اطمینان دارید؟`)) {
      return;
    }

    const ok = deleteHeroBanner(b.id);
    if (ok) {
      setStatusMessage({
        text: `بنر هیرو «${b.title}» با موفقیت حذف شد.`,
        isError: false,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            کالکشن‌ها، هیرو بنرها و داستان بصری برند
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ایجاد، ویرایش و مدیریت کالکشن‌های اختصاصی، کتابخانه لوک‌بوک و اسلایدر صفحه نخست (Epic E03)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={<ImageIcon className="w-4 h-4 text-blue-400" />}
            onClick={handleOpenAddBanner}
            disabled={!canManage}
          >
            بنر هیرو جدید
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAddCollection}
            disabled={!canManage}
          >
            کالکشن جدید
          </Button>
        </div>
      </div>

      {/* Status or Error Banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
            statusMessage.isError
              ? 'bg-rose-950/40 border-rose-800 text-rose-300'
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white text-xs px-2 cursor-pointer"
          >
            بستن
          </button>
        </div>
      )}

      {/* Hero Banners Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              بنرهای هیرو صفحه نخست (Hero Banners)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              ({heroBanners.length} بنر / {heroBanners.filter((b) => b.isActive).length} فعال)
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5 text-blue-400" />}
            onClick={handleOpenAddBanner}
            disabled={!canManage}
          >
            افزودن بنر
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heroBanners.map((banner) => (
            <div
              key={banner.id}
              className="relative rounded-2xl overflow-hidden border border-slate-800 group shadow-lg bg-[#0e1017]"
            >
              <div className="aspect-[16/9] w-full relative">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-[#0e1017]/60 to-black/30" />

                {/* Top badges */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <Badge variant="blue">{banner.collectionTag}</Badge>
                  <Badge variant={banner.isActive ? 'emerald' : 'zinc'}>
                    {banner.isActive ? 'در حال نمایش' : 'غیرفعال'}
                  </Badge>
                </div>

                {/* Bottom details & action controls */}
                <div className="absolute bottom-4 right-4 left-4 space-y-2">
                  <h4 className="text-base font-bold text-slate-100">{banner.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {banner.subtitle}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-blue-300 font-semibold px-2.5 py-1 rounded bg-blue-600/20 border border-blue-500/40">
                      {banner.ctaText} ←
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          updateHeroBanner({ ...banner, isActive: !banner.isActive })
                        }
                        disabled={!canManage}
                        className={`text-xs px-2.5 py-1 rounded font-medium border cursor-pointer ${
                          banner.isActive
                            ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                            : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                        }`}
                      >
                        {banner.isActive ? 'توقف' : 'فعال‌سازی'}
                      </button>

                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<Edit2 className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenEditBanner(banner)}
                        disabled={!canManage}
                      >
                        ویرایش
                      </Button>

                      <button
                        onClick={() => handleDeleteBanner(banner)}
                        disabled={!canManage}
                        title="حذف بنر هیرو"
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950 border border-slate-700 hover:border-rose-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collections Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              کالکشن‌های اختصاصی استودیو لنگه
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              ({collections.length} کالکشن)
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleOpenAddCollection}
            disabled={!canManage}
          >
            افزودن کالکشن
          </Button>
        </div>

        <div className="space-y-6">
          {collections.map((col) => (
            <Card
              key={col.id}
              className="p-6 border-slate-800 bg-[#151823] overflow-hidden space-y-4"
            >
              {/* Top info and actions */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif-brand text-xs font-bold text-blue-400 tracking-wider">
                      {col.title}
                    </span>
                    <Badge variant="blue">{col.titleFa}</Badge>
                    <Badge variant={col.isActive ? 'emerald' : 'zinc'}>
                      {col.isActive ? 'فعال در کاتالوگ' : 'غیرفعال'}
                    </Badge>
                  </div>
                  <h4 className="text-lg font-bold text-slate-100">{col.subtitle}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-3xl">
                    {col.concept}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                    onClick={() => handleOpenEditCollection(col)}
                    disabled={!canManage}
                  >
                    ویرایش کالکشن
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => handleDeleteCollection(col)}
                    disabled={!canManage}
                  >
                    حذف
                  </Button>
                </div>
              </div>

              {/* Story box */}
              <div className="p-4 bg-[#0e1017] rounded-xl border border-slate-800/80 text-xs">
                <span className="text-[11px] font-semibold text-blue-400 block mb-1">
                  روایت و بیانیه فلسفی کالکشن:
                </span>
                <p className="text-slate-300 leading-relaxed">{col.story}</p>
              </div>

              {/* Lookbook Gallery */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    لوک‌بوک و تصویربرداری هنری (Lookbook Visuals):
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {col.lookbook?.length || 0} تصویر ثبت‌شده
                  </span>
                </div>

                {col.lookbook && col.lookbook.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {col.lookbook.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-[3/4] rounded-xl overflow-hidden bg-[#0e1017] border border-slate-800 group relative"
                      >
                        <img
                          src={img}
                          alt={`${col.title} look ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-slate-300 font-mono">
                          Look #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                    تصویری برای لوک‌بوک این کالکشن ثبت نشده است. از دکمه «ویرایش کالکشن» برای افزودن تصاویر استفاده کنید.
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Collection Modal (Add/Edit) */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        collectionToEdit={editingCollection}
      />

      {/* Hero Banner Modal (Add/Edit) */}
      <HeroBannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        bannerToEdit={editingBanner}
      />
    </div>
  );
};
