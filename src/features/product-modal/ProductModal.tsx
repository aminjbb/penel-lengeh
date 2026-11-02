import React, { useState, useEffect } from 'react';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { Product, Variant, ProductSeo } from '../../shared/types';
import { useStore } from '../../app/providers/StoreContext';
import {
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Globe,
  Tag,
  FileText,
  Search,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, checkPermission } = useStore();

  const isEditing = Boolean(productToEdit);
  const canManage = checkPermission('manage_catalog');

  // Modal active tab: 'details' or 'seo'
  const [activeTab, setActiveTab] = useState<'details' | 'seo'>('details');

  // General fields
  const [titleFa, setTitleFa] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('پالتو و بارانی');
  const [collectionId, setCollectionId] = useState<Product['collectionId']>('shibui');
  const [audience, setAudience] = useState<Product['audience']>('زنانه');
  const [basePrice, setBasePrice] = useState<number>(12000000);
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [careInstructions, setCareInstructions] = useState('فقط خشک‌شویی تخصصی با بخار سرد.');
  const [isLimitedEdition, setIsLimitedEdition] = useState(true);
  const [editionLimit, setEditionLimit] = useState(50);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800'
  );

  // SEO fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywordsText, setFocusKeywordsText] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // Variants list for new product
  const [variantsList, setVariantsList] = useState<Omit<Variant, 'id' | 'productId'>[]>([
    {
      sku: 'LGH-NEW01-BLK-FREE',
      colorName: 'مشکی کربن',
      colorHex: '#1e1e1e',
      size: 'Free',
      stockHealthy: 10,
      stockQuarantine: 0,
      stockReserved: 0,
      price: 12000000,
      isActive: true,
    },
  ]);

  const [error, setError] = useState('');

  // Sync state whenever modal opens or productToEdit changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab('details');
      setError('');
      if (productToEdit) {
        setTitleFa(productToEdit.titleFa || '');
        setName(productToEdit.name || '');
        setCategory(productToEdit.category || 'پالتو و بارانی');
        setCollectionId(productToEdit.collectionId || 'shibui');
        setAudience(productToEdit.audience || 'زنانه');
        setBasePrice(productToEdit.basePrice || 12000000);
        setDescription(productToEdit.description || '');
        setMaterials(productToEdit.materials || '');
        setCareInstructions(productToEdit.careInstructions || 'فقط خشک‌شویی تخصصی با بخار سرد.');
        setIsLimitedEdition(productToEdit.isLimitedEdition ?? true);
        setEditionLimit(productToEdit.editionLimit || 50);
        setImageUrl(productToEdit.images[0] || '');

        // SEO fields
        setMetaTitle(
          productToEdit.seo?.metaTitle || `${productToEdit.titleFa} | استودیو مد لنگه`
        );
        setMetaDescription(
          productToEdit.seo?.metaDescription || productToEdit.description || ''
        );
        setFocusKeywordsText(productToEdit.seo?.focusKeywords?.join('، ') || '');
        setCanonicalUrl(
          productToEdit.seo?.canonicalUrl ||
            `https://lengeh.studio/products/${productToEdit.slug}`
        );
      } else {
        setTitleFa('');
        setName('');
        setCategory('پالتو و بارانی');
        setCollectionId('shibui');
        setAudience('زنانه');
        setBasePrice(12000000);
        setDescription('');
        setMaterials('');
        setCareInstructions('فقط خشک‌شویی تخصصی با بخار سرد.');
        setIsLimitedEdition(true);
        setEditionLimit(50);
        setImageUrl(
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800'
        );
        setMetaTitle('');
        setMetaDescription('');
        setFocusKeywordsText('');
        setCanonicalUrl('');
        setVariantsList([
          {
            sku: 'LGH-NEW01-BLK-FREE',
            colorName: 'مشکی کربن',
            colorHex: '#1e1e1e',
            size: 'Free',
            stockHealthy: 10,
            stockQuarantine: 0,
            stockReserved: 0,
            price: 12000000,
            isActive: true,
          },
        ]);
      }
    }
  }, [isOpen, productToEdit]);

  // Auto-fill helpers for SEO
  const handleAutoFillMetaTitle = () => {
    if (titleFa.trim()) {
      setMetaTitle(`${titleFa.trim()} | استودیو مد لنگه`);
    }
  };

  const handleAutoFillMetaDescription = () => {
    if (description.trim()) {
      setMetaDescription(description.trim().slice(0, 155));
    }
  };

  const handleAutoFillCanonical = () => {
    const slug = name.trim()
      ? name.trim().toLowerCase().replace(/\s+/g, '-')
      : 'new-product';
    setCanonicalUrl(`https://lengeh.studio/products/${slug}`);
  };

  const handleAddVariantRow = () => {
    setVariantsList([
      ...variantsList,
      {
        sku: `LGH-${Date.now().toString().slice(-4)}`,
        colorName: 'رنگ جدید',
        colorHex: '#333333',
        size: 'M',
        stockHealthy: 5,
        stockQuarantine: 0,
        stockReserved: 0,
        price: basePrice,
        isActive: true,
      },
    ]);
  };

  const handleRemoveVariantRow = (index: number) => {
    if (variantsList.length <= 1) return;
    setVariantsList(variantsList.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof Omit<Variant, 'id' | 'productId'>,
    value: any
  ) => {
    const updated = [...variantsList];
    updated[index] = { ...updated[index], [field]: value };
    setVariantsList(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!canManage) {
      setError('شما دسترسی لازم برای مدیریت کاتالوگ را ندارید.');
      return;
    }

    if (!titleFa.trim() || !name.trim()) {
      setError('نام فارسی و نام لاتین محصول الزامی است.');
      return;
    }

    // Prepare keywords array
    const parsedKeywords = focusKeywordsText
      .split(/[,،]/)
      .map((k) => k.trim())
      .filter(Boolean);

    // Prepare SEO object with sensible fallbacks
    const generatedSlug = name.toLowerCase().replace(/\s+/g, '-');
    const seoData: ProductSeo = {
      metaTitle: metaTitle.trim() || `${titleFa.trim()} | استودیو مد لنگه`,
      metaDescription: metaDescription.trim() || description.trim().slice(0, 150),
      focusKeywords: parsedKeywords,
      canonicalUrl:
        canonicalUrl.trim() || `https://lengeh.studio/products/${generatedSlug}`,
    };

    if (isEditing && productToEdit) {
      updateProduct({
        ...productToEdit,
        titleFa: titleFa.trim(),
        name: name.trim(),
        category,
        collectionId,
        audience,
        basePrice,
        description: description.trim(),
        materials: materials.trim(),
        careInstructions: careInstructions.trim(),
        isLimitedEdition,
        editionLimit: isLimitedEdition ? editionLimit : undefined,
        images: [imageUrl, ...(productToEdit.images.slice(1) || [])],
        seo: seoData,
      });
      onClose();
    } else {
      addProduct(
        {
          slug: generatedSlug,
          titleFa: titleFa.trim(),
          name: name.trim(),
          category,
          collectionId,
          audience,
          status: 'published',
          basePrice,
          description: description.trim(),
          materials: materials.trim(),
          careInstructions: careInstructions.trim(),
          sizeGuide: 'فیت استاندارد آتلیه لنگه',
          images: [imageUrl],
          isLimitedEdition,
          editionLimit: isLimitedEdition ? editionLimit : undefined,
          seo: seoData,
        },
        variantsList
      );
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      fullScreen={true}
      title={isEditing ? `ویرایش ${productToEdit?.titleFa}` : 'افزودن محصول جدید به کاتالوگ'}
      description="تعریف اطلاعات کاتالوگ، متریال، تنظیمات سئو و سقف تیراژ نسخه محدود"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {!canManage && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>نقش جاری شما فاقد مجوز ثبت یا ویرایش محصول در کاتالوگ است.</span>
          </div>
        )}

        {/* Tab switcher inside modal */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'bg-blue-600/15 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>مشخصات کالا و واریانت‌ها</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'seo'
                ? 'bg-blue-600/15 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>تنظیمات سئو (SEO Metadata)</span>
            {(metaTitle || metaDescription) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            )}
          </button>
        </div>

        {/* TAB 1: General Details & Variants */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  نام فارسی محصول:
                </label>
                <input
                  type="text"
                  value={titleFa}
                  onChange={(e) => setTitleFa(e.target.value)}
                  placeholder="مثال: پالتو کیمونو ابریشم"
                  className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  نام لاتین (English):
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shibui Silk Kimono Coat"
                  className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 font-mono text-left focus:outline-none focus:border-blue-500"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-medium block mb-1">کالکشن:</label>
                <select
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value as Product['collectionId'])}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="shibui">SHIBUI (شیبویی)</option>
                  <option value="outspoken">OUTSPOKEN (آوت‌اسپوکن)</option>
                  <option value="capsule">کپسول فصلی (Capsule)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">دسته‌بندی:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="پالتو و بارانی">پالتو و بارانی</option>
                  <option value="شلوار">شلوار</option>
                  <option value="پیراهن و شومیز">پیراهن و شومیز</option>
                  <option value="اکسسوری و رویه">اکسسوری و رویه</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">مخاطب:</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as Product['audience'])}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="زنانه">زنانه</option>
                  <option value="مردانه">مردانه</option>
                  <option value="یونیسکس">یونیسکس</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  قیمت پایه (تومان):
                </label>
                <input
                  type="number"
                  step={100000}
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">لینک تصویر اصلی:</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2 text-slate-100 placeholder:text-slate-500 font-mono text-left focus:outline-none focus:border-blue-500"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Limited Edition Box */}
            <div className="p-3 bg-[#10121a] border border-blue-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-blue-300 font-semibold flex items-center gap-1.5 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  نسخه محدود شماره‌گذاری‌شده (Limited Edition)
                </label>
                <input
                  type="checkbox"
                  checked={isLimitedEdition}
                  onChange={(e) => setIsLimitedEdition(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
              </div>
              {isLimitedEdition && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-slate-400">سقف تیراژ انحصاری طرح:</span>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={editionLimit}
                    onChange={(e) => setEditionLimit(parseInt(e.target.value, 10) || 50)}
                    className="w-24 bg-[#151824] border border-slate-700 rounded-lg p-1.5 text-center text-blue-400 font-bold font-mono focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-500">
                    (پس از تکمیل این سقف، تولید متوقف و غیرقابل بازتولید می‌شود)
                  </span>
                </div>
              )}
            </div>

            {/* Description & Materials */}
            <div className="space-y-2">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  شرح کانسپت و ویژگی‌ها:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="داستان دیزاین، فرم سیلوئت و دوخت..."
                  className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  مشخصات متریال و شناسنامه بافت:
                </label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="مثال: ۱۰۰٪ کتان خام، ابریشم طبیعی یزد، دکمه صدف دست‌ساز"
                  className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Variants configuration (Only when adding new product) */}
            {!isEditing && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-200">واریانت‌ها و موجودی انبار اولیه:</h5>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    افزودن واریانت
                  </button>
                </div>

                <div className="space-y-2">
                  {variantsList.map((v, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-[#10121a] p-2.5 rounded-lg border border-slate-800"
                    >
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="SKU"
                          value={v.sku}
                          onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                          className="w-full bg-[#151824] border border-slate-700 rounded p-1 text-[11px] font-mono text-left text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                          dir="ltr"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="نام رنگ"
                          value={v.colorName}
                          onChange={(e) => handleVariantChange(idx, 'colorName', e.target.value)}
                          className="w-full bg-[#151824] border border-slate-700 rounded p-1 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={v.size}
                          onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                          className="w-full bg-[#151824] border border-slate-700 rounded p-1 text-[11px] text-slate-100 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Free">Free</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="موجودی"
                          value={v.stockHealthy}
                          onChange={(e) =>
                            handleVariantChange(idx, 'stockHealthy', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-full bg-[#151824] border border-slate-700 rounded p-1 text-[11px] font-mono text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        {variantsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantRow(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SEO Settings */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-start gap-2">
              <Globe className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">مدیریت سئو و متادیتای محصول</p>
                <p className="text-[11px] text-blue-300/80 mt-0.5 leading-relaxed">
                  این مقادیر در تگ‌های HTML سربرگ صفحه محصول (`title`، `meta description` و `link canonical`)
                  قرار می‌گیرند و برای شناسایی کالا در موتورهای جستجو استفاده می‌شوند.
                </p>
              </div>
            </div>

            {/* Meta Title */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  عنوان متا (Meta Title):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoFillMetaTitle}
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    پر کردن خودکار
                  </button>
                  <span
                    className={`font-mono text-[10px] ${
                      metaTitle.length >= 30 && metaTitle.length <= 60
                        ? 'text-emerald-400 font-bold'
                        : metaTitle.length > 60
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {metaTitle.length} / ۶۰ کاراکتر (بهینه: ۳۰-۶۰)
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="مثال: پالتو کیمونو اورسایز شیبویی | استودیو مد لنگه"
                className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  توضیحات متا (Meta Description):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoFillMetaDescription}
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    استخراج از شرح
                  </button>
                  <span
                    className={`font-mono text-[10px] ${
                      metaDescription.length >= 120 && metaDescription.length <= 160
                        ? 'text-emerald-400 font-bold'
                        : metaDescription.length > 160
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {metaDescription.length} / ۱۶۰ کاراکتر (بهینه: ۱۲۰-۱۶۰)
                  </span>
                </div>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="خلاصه جذاب و ۱ الی ۲ جمله‌ای از پارچه، دوخت، تیراژ محدود و مزیت رقابتی محصول..."
                className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* Focus Keywords */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                کلمات کلیدی هدف (با کاما یا ویرگول جدا کنید):
              </label>
              <input
                type="text"
                value={focusKeywordsText}
                onChange={(e) => setFocusKeywordsText(e.target.value)}
                placeholder="مثال: پالتو کیمونو، کالکشن شیبویی، پشم مرینوس، لباس دست دوز"
                className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              {focusKeywordsText.trim() && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                  <span className="text-[10px] text-slate-500">کلمات شناسایی‌شده:</span>
                  {focusKeywordsText
                    .split(/[,،]/)
                    .map((k) => k.trim())
                    .filter(Boolean)
                    .map((k, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-800 text-blue-300 px-2 py-0.5 rounded-full border border-slate-700"
                      >
                        #{k}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Canonical URL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  آدرس کانونیکال رسمی (Canonical URL):
                </label>
                <button
                  type="button"
                  onClick={handleAutoFillCanonical}
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <RefreshCw className="w-3 h-3" />
                  تولید از نام لاتین
                </button>
              </div>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://lengeh.studio/products/product-slug"
                className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono text-left focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                dir="ltr"
              />
              <span className="text-[10px] text-slate-500 block">
                جهت جلوگیری از جریمه محتوای تکراری و هدایت تمام اعتبار گوگل به صفحه مرجع کالا.
              </span>
            </div>
          </div>
        )}

        {error && <p className="text-rose-400 font-medium">{error}</p>}

        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            {activeTab === 'details' ? (
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-semibold"
              >
                رفتن به تنظیمات سئو ←
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                → بازگشت به مشخصات و واریانت‌ها
              </button>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" variant="primary" disabled={!canManage}>
              {isEditing ? 'ذخیره محصول و تنظیمات سئو' : 'ثبت نهایی در کاتالوگ'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
