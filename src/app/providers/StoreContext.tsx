import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoleKey,
  Product,
  Variant,
  CollectionItem,
  HeroBanner,
  EditionPiece,
  Order,
  OrderStatus,
  InventoryLog,
  ReturnRequest,
  Customer,
  SupportCase,
  DiscountCode,
  SearchKeywordStat,
  AuditLog,
  PermissionKey,
} from '../../shared/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_VARIANTS,
  INITIAL_COLLECTIONS,
  INITIAL_HERO_BANNERS,
  INITIAL_EDITION_PIECES,
  INITIAL_ORDERS,
  INITIAL_INVENTORY_LOGS,
  INITIAL_RETURNS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPORT_CASES,
  INITIAL_DISCOUNT_CODES,
  INITIAL_SEARCH_KEYWORDS,
  INITIAL_AUDIT_LOGS,
} from '../../shared/data/initialData';
import { getStored, setStored, clearStorage } from '../../shared/lib/storage';
import { hasPermission, ROLES_CONFIG } from '../../shared/lib/permissions';

interface StoreContextType {
  role: RoleKey;
  setRole: (role: RoleKey) => void;
  checkPermission: (perm: PermissionKey) => boolean;

  products: Product[];
  variants: Variant[];
  collections: CollectionItem[];
  heroBanners: HeroBanner[];
  editionPieces: EditionPiece[];
  orders: Order[];
  inventoryLogs: InventoryLog[];
  returns: ReturnRequest[];
  customers: Customer[];
  supportCases: SupportCase[];
  discountCodes: DiscountCode[];
  searchKeywords: SearchKeywordStat[];
  auditLogs: AuditLog[];

  // Mutations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>, initialVariants: Omit<Variant, 'id' | 'productId'>[]) => void;
  updateProduct: (product: Product) => void;
  adjustInventory: (sku: string, change: number, reason: InventoryLog['reason'], notes: string) => boolean;
  issueDuplicateCertificate: (pieceId: string, reason: string) => boolean;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => boolean;
  processRefund: (orderId: string, amount: number, reason: string) => { success: boolean; error?: string };
  updateReturnQC: (returnId: string, qcStatus: ReturnRequest['qcStatus'], resolution: ReturnRequest['resolution'], notes: string) => boolean;
  addSupportNote: (caseId: string, note: string) => void;
  addDiscountCode: (discount: Omit<DiscountCode, 'id' | 'timesUsed'>) => void;
  toggleDiscountActive: (id: string) => void;
  addCollection: (col: Omit<CollectionItem, 'id'>) => void;
  updateCollection: (col: CollectionItem) => void;
  deleteCollection: (id: string) => { success: boolean; error?: string };
  addHeroBanner: (banner: Omit<HeroBanner, 'id'>) => void;
  updateHeroBanner: (banner: HeroBanner) => void;
  deleteHeroBanner: (id: string) => boolean;
  resetAllData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<RoleKey>(() => getStored('active_role', 'owner'));
  const [products, setProducts] = useState<Product[]>(() => getStored('products', INITIAL_PRODUCTS));
  const [variants, setVariants] = useState<Variant[]>(() => getStored('variants', INITIAL_VARIANTS));
  const [collections, setCollections] = useState<CollectionItem[]>(() => getStored('collections', INITIAL_COLLECTIONS));
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>(() => getStored('hero_banners', INITIAL_HERO_BANNERS));
  const [editionPieces, setEditionPieces] = useState<EditionPiece[]>(() => getStored('edition_pieces', INITIAL_EDITION_PIECES));
  const [orders, setOrders] = useState<Order[]>(() => getStored('orders', INITIAL_ORDERS));
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => getStored('inventory_logs', INITIAL_INVENTORY_LOGS));
  const [returns, setReturns] = useState<ReturnRequest[]>(() => getStored('returns', INITIAL_RETURNS));
  const [customers, setCustomers] = useState<Customer[]>(() => getStored('customers', INITIAL_CUSTOMERS));
  const [supportCases, setSupportCases] = useState<SupportCase[]>(() => getStored('support_cases', INITIAL_SUPPORT_CASES));
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(() => getStored('discount_codes', INITIAL_DISCOUNT_CODES));
  const [searchKeywords, setSearchKeywords] = useState<SearchKeywordStat[]>(() => getStored('search_keywords', INITIAL_SEARCH_KEYWORDS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStored('audit_logs', INITIAL_AUDIT_LOGS));

  const setRole = (newRole: RoleKey) => {
    setRoleState(newRole);
    setStored('active_role', newRole);
    appendAuditLog({
      action: 'تغییر نقش کاربری جاری',
      category: 'auth',
      details: `جابجایی نقش فعال به «${ROLES_CONFIG[newRole].titleFa}»`,
    });
  };

  const checkPermission = (perm: PermissionKey) => hasPermission(role, perm);

  const appendAuditLog = (entry: {
    action: string;
    category: AuditLog['category'];
    details: string;
    beforeSnapshot?: string;
    afterSnapshot?: string;
  }) => {
    const roleInfo = ROLES_CONFIG[role];
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      action: entry.action,
      category: entry.category,
      actorName: `${roleInfo.titleFa} (اپراتور جاری)`,
      actorRole: role,
      timestamp: new Date().toISOString(),
      details: entry.details,
      beforeSnapshot: entry.beforeSnapshot,
      afterSnapshot: entry.afterSnapshot,
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      setStored('audit_logs', updated);
      return updated;
    });
  };

  const addProduct = (
    prodData: Omit<Product, 'id' | 'createdAt'>,
    varData: Omit<Variant, 'id' | 'productId'>[]
  ) => {
    const newProdId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: newProdId,
      createdAt: new Date().toISOString(),
    };
    const newVariants: Variant[] = varData.map((v, i) => ({
      ...v,
      id: `var-${newProdId}-${i + 1}`,
      productId: newProdId,
    }));

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      setStored('products', updated);
      return updated;
    });

    setVariants((prev) => {
      const updated = [...newVariants, ...prev];
      setStored('variants', updated);
      return updated;
    });

    appendAuditLog({
      action: 'افزودن محصول جدید',
      category: 'catalog',
      details: `محصول «${newProduct.titleFa}» با ${newVariants.length} واریانت ایجاد شد.`,
      afterSnapshot: `SKUs: ${newVariants.map((v) => v.sku).join(', ')}`,
    });
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      setStored('products', next);
      return next;
    });
    appendAuditLog({
      action: 'ویرایش اطلاعات محصول',
      category: 'catalog',
      details: `ویرایش اطلاعات «${updated.titleFa}» (${updated.name})`,
    });
  };

  const adjustInventory = (
    sku: string,
    change: number,
    reason: InventoryLog['reason'],
    notes: string
  ): boolean => {
    const targetVariant = variants.find((v) => v.sku === sku);
    if (!targetVariant) return false;

    const oldHealthy = targetVariant.stockHealthy;
    const newHealthy = Math.max(0, oldHealthy + change);

    const updatedVariants = variants.map((v) =>
      v.sku === sku ? { ...v, stockHealthy: newHealthy } : v
    );
    setVariants(updatedVariants);
    setStored('variants', updatedVariants);

    const prod = products.find((p) => p.id === targetVariant.productId);
    const newLog: InventoryLog = {
      id: `log-${Date.now()}`,
      sku,
      productName: prod?.titleFa || 'محصول لنگه',
      variantDesc: `${targetVariant.colorName} - ${targetVariant.size}`,
      changeAmount: change,
      resultingHealthy: newHealthy,
      reason,
      operator: ROLES_CONFIG[role].titleFa,
      timestamp: new Date().toISOString(),
      notes,
    };

    setInventoryLogs((prev) => {
      const next = [newLog, ...prev];
      setStored('inventory_logs', next);
      return next;
    });

    appendAuditLog({
      action: 'اصلاح موجودی انبار',
      category: 'inventory',
      details: `تغییر ${change >= 0 ? '+' : ''}${change} عدد موجودی سالم SKU: ${sku}`,
      beforeSnapshot: `موجودی سالم: ${oldHealthy}`,
      afterSnapshot: `موجودی سالم: ${newHealthy}`,
    });

    return true;
  };

  const issueDuplicateCertificate = (pieceId: string, reason: string): boolean => {
    const piece = editionPieces.find((p) => p.id === pieceId);
    if (!piece) return false;

    const newVersion = piece.certificateVersion + 1;
    const historyEntry = {
      version: newVersion,
      issuedAt: new Date().toISOString(),
      reason,
      operator: ROLES_CONFIG[role].titleFa,
    };

    const updatedPieces = editionPieces.map((p) =>
      p.id === pieceId
        ? {
            ...p,
            certificateVersion: newVersion,
            certificateHistory: [historyEntry, ...p.certificateHistory],
          }
        : p
    );

    setEditionPieces(updatedPieces);
    setStored('edition_pieces', updatedPieces);

    appendAuditLog({
      action: 'صدور شناسنامه المثنی',
      category: 'edition',
      details: `صدور نسخه ${newVersion} شناسنامه قطعه ${piece.serialNumber}. علت: ${reason}`,
      beforeSnapshot: `نسخه شناسنامه: ${piece.certificateVersion}`,
      afterSnapshot: `نسخه شناسنامه: ${newVersion}`,
    });

    return true;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    note?: string
  ): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    const statusTitles: Record<OrderStatus, string> = {
      pending_payment: 'در انتظار پرداخت',
      confirmed: 'تأیید سفارش',
      processing: 'در حال آماده‌سازی و بسته‌بندی لوکس',
      shipped: 'ارسال مرسوله به حامل',
      delivered: 'تحویل نهایی به خریدار',
      cancelled: 'لغو سفارش',
    };

    const newTimelineEvent = {
      status: newStatus,
      title: statusTitles[newStatus],
      timestamp: new Date().toISOString(),
      actor: ROLES_CONFIG[role].titleFa,
      note,
    };

    const updatedOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: newStatus,
            timeline: [newTimelineEvent, ...o.timeline],
          }
        : o
    );

    setOrders(updatedOrders);
    setStored('orders', updatedOrders);

    appendAuditLog({
      action: 'تغییر وضعیت سفارش',
      category: 'order',
      details: `سفارش ${order.orderNumber} به وضعیت «${statusTitles[newStatus]}» تغییر یافت.`,
      beforeSnapshot: `وضعیت: ${order.status}`,
      afterSnapshot: `وضعیت: ${newStatus}`,
    });

    return true;
  };

  const processRefund = (
    orderId: string,
    amount: number,
    reason: string
  ): { success: boolean; error?: string } => {
    if (role !== 'owner' && role !== 'finance') {
      return { success: false, error: 'شما دسترسی لازم برای صدور بازپرداخت مالی را ندارید. (نیازمند نقش مدیر کل یا مالی)' };
    }

    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'سفارش یافت نشد.' };
    if (order.paymentStatus === 'refunded') {
      return { success: false, error: 'این سفارش قبلاً استرداد شده است.' };
    }
    if (amount <= 0 || amount > order.finalAmount) {
      return { success: false, error: 'مبلغ بازپرداخت نامعتبر است یا از مبلغ پرداختی سفارش بیشتر است.' };
    }

    const updatedOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            paymentStatus: (amount === o.finalAmount ? 'refunded' : 'partial_refund') as Order['paymentStatus'],
            refundDetails: {
              amount,
              reason,
              refundedAt: new Date().toISOString(),
              approvedBy: ROLES_CONFIG[role].titleFa,
            },
            timeline: [
              {
                status: 'refunded',
                title: `تأیید و اجرای استرداد وجه مبلغ ${amount.toLocaleString('fa-IR')} تومان`,
                timestamp: new Date().toISOString(),
                actor: ROLES_CONFIG[role].titleFa,
                note: reason,
              },
              ...o.timeline,
            ],
          }
        : o
    );

    setOrders(updatedOrders);
    setStored('orders', updatedOrders);

    appendAuditLog({
      action: 'اجرای استرداد مالی (Refund)',
      category: 'refund',
      details: `استرداد وجه مبلغ ${amount.toLocaleString('fa-IR')} تومان برای سفارش ${order.orderNumber}. علت: ${reason}`,
      beforeSnapshot: `وضعیت پرداخت: ${order.paymentStatus}`,
      afterSnapshot: `وضعیت پرداخت: refunded`,
    });

    return { success: true };
  };

  const updateReturnQC = (
    returnId: string,
    qcStatus: ReturnRequest['qcStatus'],
    resolution: ReturnRequest['resolution'],
    notes: string
  ): boolean => {
    const ret = returns.find((r) => r.id === returnId);
    if (!ret) return false;

    const updatedReturns = returns.map((r) =>
      r.id === returnId
        ? {
            ...r,
            qcStatus,
            resolution,
            notes,
            resolvedAt: new Date().toISOString(),
            resolvedBy: ROLES_CONFIG[role].titleFa,
          }
        : r
    );

    setReturns(updatedReturns);
    setStored('returns', updatedReturns);

    appendAuditLog({
      action: 'ثبت نتیجه کنترل کیفیت مرجوعی (QC)',
      category: 'order',
      details: `پرونده ${ret.rmaNumber}: نتیجه QC به «${qcStatus}» و راهکار به «${resolution}» ثبت شد.`,
    });

    return true;
  };

  const addSupportNote = (caseId: string, note: string) => {
    const updated = supportCases.map((c) =>
      c.id === caseId
        ? {
            ...c,
            operatorNotes: [`[${ROLES_CONFIG[role].titleFa}]: ${note}`, ...c.operatorNotes],
          }
        : c
    );
    setSupportCases(updated);
    setStored('support_cases', updated);
  };

  const addDiscountCode = (data: Omit<DiscountCode, 'id' | 'timesUsed'>) => {
    const newCode: DiscountCode = {
      ...data,
      id: `disc-${Date.now()}`,
      timesUsed: 0,
    };
    const updated = [newCode, ...discountCodes];
    setDiscountCodes(updated);
    setStored('discount_codes', updated);

    appendAuditLog({
      action: 'ایجاد کد تخفیف جدید',
      category: 'catalog',
      details: `کد تخفیف ${newCode.code} با اعتبار تا ${newCode.expiryDate} ایجاد شد.`,
    });
  };

  const toggleDiscountActive = (id: string) => {
    const updated = discountCodes.map((d) =>
      d.id === id ? { ...d, isActive: !d.isActive } : d
    );
    setDiscountCodes(updated);
    setStored('discount_codes', updated);
  };

  const addCollection = (colData: Omit<CollectionItem, 'id'>) => {
    const newId = colData.slug.trim().toLowerCase() || `col-${Date.now()}`;
    const newCol: CollectionItem = {
      ...colData,
      id: newId,
    };
    const next = [...collections, newCol];
    setCollections(next);
    setStored('collections', next);
    appendAuditLog({
      action: 'ایجاد کالکشن جدید',
      category: 'catalog',
      details: `کالکشن «${newCol.title}» (${newCol.titleFa}) به کاتالوگ افزوده شد.`,
    });
  };

  const updateCollection = (col: CollectionItem) => {
    const next = collections.map((c) => (c.id === col.id ? col : c));
    setCollections(next);
    setStored('collections', next);
    appendAuditLog({
      action: 'ویرایش اطلاعات کالکشن',
      category: 'catalog',
      details: `ویرایش اطلاعات کالکشن «${col.title}» (${col.titleFa})`,
    });
  };

  const deleteCollection = (id: string): { success: boolean; error?: string } => {
    const target = collections.find((c) => c.id === id);
    if (!target) return { success: false, error: 'کالکشن یافت نشد.' };

    // Check active product dependencies
    const relatedProducts = products.filter(
      (p) => p.collectionId === target.slug || p.collectionId === target.id
    );
    if (relatedProducts.length > 0) {
      return {
        success: false,
        error: `امکان حذف کالکشن «${target.title}» وجود ندارد زیرا ${relatedProducts.length} محصول فعال (${relatedProducts.map((p) => p.titleFa).join('، ')}) به این کالکشن متصل هستند. لطفاً ابتدا در کاتالوگ کالکشن این محصولات را تغییر دهید.`,
      };
    }

    const next = collections.filter((c) => c.id !== id);
    setCollections(next);
    setStored('collections', next);
    appendAuditLog({
      action: 'حذف کالکشن',
      category: 'catalog',
      details: `کالکشن «${target.title}» (${target.titleFa}) از سیستم حذف گردید.`,
    });
    return { success: true };
  };

  const addHeroBanner = (bannerData: Omit<HeroBanner, 'id'>) => {
    const newBanner: HeroBanner = {
      ...bannerData,
      id: `hero-${Date.now()}`,
    };
    const next = [newBanner, ...heroBanners];
    setHeroBanners(next);
    setStored('hero_banners', next);
    appendAuditLog({
      action: 'افزودن بنر هیرو جدید',
      category: 'catalog',
      details: `بنر هیرو «${newBanner.title}» برای تگ ${newBanner.collectionTag} ایجاد شد.`,
    });
  };

  const deleteHeroBanner = (id: string): boolean => {
    const target = heroBanners.find((b) => b.id === id);
    if (!target) return false;
    const next = heroBanners.filter((b) => b.id !== id);
    setHeroBanners(next);
    setStored('hero_banners', next);
    appendAuditLog({
      action: 'حذف بنر هیرو',
      category: 'catalog',
      details: `بنر هیرو «${target.title}» حذف گردید.`,
    });
    return true;
  };

  const updateHeroBanner = (banner: HeroBanner) => {
    const updated = heroBanners.map((b) => (b.id === banner.id ? banner : b));
    setHeroBanners(updated);
    setStored('hero_banners', updated);
    appendAuditLog({
      action: 'ویرایش بنر هیرو صفحه اول',
      category: 'catalog',
      details: `بنر هیرو «${banner.title}» به‌روزرسانی شد.`,
    });
  };

  const resetAllData = () => {
    clearStorage();
    setProducts(INITIAL_PRODUCTS);
    setVariants(INITIAL_VARIANTS);
    setCollections(INITIAL_COLLECTIONS);
    setHeroBanners(INITIAL_HERO_BANNERS);
    setEditionPieces(INITIAL_EDITION_PIECES);
    setOrders(INITIAL_ORDERS);
    setInventoryLogs(INITIAL_INVENTORY_LOGS);
    setReturns(INITIAL_RETURNS);
    setCustomers(INITIAL_CUSTOMERS);
    setSupportCases(INITIAL_SUPPORT_CASES);
    setDiscountCodes(INITIAL_DISCOUNT_CODES);
    setSearchKeywords(INITIAL_SEARCH_KEYWORDS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setRoleState('owner');
  };

  return (
    <StoreContext.Provider
      value={{
        role,
        setRole,
        checkPermission,
        products,
        variants,
        collections,
        heroBanners,
        editionPieces,
        orders,
        inventoryLogs,
        returns,
        customers,
        supportCases,
        discountCodes,
        searchKeywords,
        auditLogs,
        addProduct,
        updateProduct,
        adjustInventory,
        issueDuplicateCertificate,
        updateOrderStatus,
        processRefund,
        updateReturnQC,
        addSupportNote,
        addDiscountCode,
        toggleDiscountActive,
        addCollection,
        updateCollection,
        deleteCollection,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        resetAllData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
