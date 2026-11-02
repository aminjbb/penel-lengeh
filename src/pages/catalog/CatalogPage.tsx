import React, { useState } from 'react';
import { useStore } from '../../app/providers/StoreContext';
import { formatPrice } from '../../shared/lib/formatters';
import { Product } from '../../shared/types';
import { Button } from '../../shared/ui/Button';
import { Badge } from '../../shared/ui/Badge';
import { Card } from '../../shared/ui/Card';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Plus, Search, Filter, Edit3, Sparkles, Eye, Shirt, Globe } from 'lucide-react';

interface CatalogPageProps {
  onOpenAddProduct: () => void;
  onOpenEditProduct: (product: Product) => void;
  onNavigateToInventory: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  onOpenAddProduct,
  onOpenEditProduct,
  onNavigateToInventory,
}) => {
  const { products, variants, checkPermission } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const canManage = checkPermission('manage_catalog');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.titleFa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCollection =
      selectedCollection === 'all' || p.collectionId === selectedCollection;

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCollection && matchesCategory;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Shirt className="w-5 h-5 text-blue-400" />
            کاتالوگ محصولات و کالکشن‌های لنگه
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            مدیریت محصولات، مشخصات متریال، واریانت‌های رنگ و سایز، و سقف تیراژ نسخه‌های محدود
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={onOpenAddProduct}
          disabled={!canManage}
        >
          افزودن محصول جدید
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            placeholder="جستجو بر اساس نام محصول، دسته یا متریال..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151824] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 pr-9"
          />
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="w-full bg-[#151824] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">همه کالکشن‌ها</option>
            <option value="shibui">کالکشن SHIBUI</option>
            <option value="outspoken">کالکشن OUTSPOKEN</option>
            <option value="capsule">کپسول فصلی</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#151824] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="محصولی یافت نشد"
          description="با تغییر فیلترها یا عبارت جستجو دوباره تلاش نمایید."
          action={
            canManage ? (
              <Button size="sm" variant="outline" onClick={onOpenAddProduct}>
                ایجاد اولین محصول
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const productVariants = variants.filter((v) => v.productId === product.id);
            const totalStock = productVariants.reduce(
              (sum, v) => sum + v.stockHealthy,
              0
            );

            return (
              <Card
                key={product.id}
                className="overflow-hidden flex flex-col justify-between group border-slate-800/80 hover:border-blue-500/40 p-0 bg-[#151823]"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] bg-[#0c0e14] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.titleFa}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151823] via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                    <Badge variant="blue">
                      {product.collectionId.toUpperCase()}
                    </Badge>
                    <Badge variant="zinc">
                      {product.audience}
                    </Badge>
                    {product.seo?.metaTitle && (
                      <Badge variant="cyan" title={`سئو: ${product.seo.metaTitle}`}>
                        <Globe className="w-2.5 h-2.5 inline" />
                        سئو
                      </Badge>
                    )}
                  </div>

                  {product.isLimitedEdition && (
                    <div className="absolute bottom-3 right-3 bg-[#0f1117]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-blue-500/40 text-[10px] text-blue-300 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      تیراژ محدود: {product.editionLimit} نسخه
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3">
                    <Badge variant={totalStock > 0 ? 'emerald' : 'rose'}>
                      {totalStock > 0 ? `${totalStock} عدد در انبار` : 'عدم موجودی'}
                    </Badge>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-blue-300 transition-colors mt-0.5">
                      {product.titleFa}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500" dir="ltr">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Variants pill list */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block mb-1.5">
                      واریانت‌ها ({productVariants.length} رنگ و سایز):
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {productVariants.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center gap-1 px-2 py-0.5 bg-[#0e1017] rounded border border-slate-800 text-[10px] text-slate-300"
                        >
                          <span
                            className="w-2 h-2 rounded-full border border-white/20"
                            style={{ backgroundColor: v.colorHex }}
                          />
                          <span>{v.size}</span>
                          <span className="text-slate-500">({v.stockHealthy})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">قیمت پایه:</span>
                      <span className="text-sm font-bold text-blue-300 font-mono">
                        {formatPrice(product.basePrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={onNavigateToInventory}
                        title="مشاهده موجودی در کاردکس انبار"
                      >
                        انبار
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<Edit3 className="w-3.5 h-3.5" />}
                        onClick={() => onOpenEditProduct(product)}
                        disabled={!canManage}
                      >
                        ویرایش
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
