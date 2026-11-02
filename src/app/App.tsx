import React, { useState } from 'react';
import { useStore } from './providers/StoreContext';
import { canAccessSection, ROLES_CONFIG } from '../shared/lib/permissions';
import { Sidebar } from '../widgets/sidebar/Sidebar';
import { Topbar } from '../widgets/topbar/Topbar';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { CatalogPage } from '../pages/catalog/CatalogPage';
import { CollectionsPage } from '../pages/collections/CollectionsPage';
import { InventoryPage } from '../pages/inventory/InventoryPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { ShipmentsPage } from '../pages/shipments/ShipmentsPage';
import { CustomersPage } from '../pages/customers/CustomersPage';
import { MarketingPage } from '../pages/marketing/MarketingPage';
import { AuditLogsPage } from '../pages/audit-logs/AuditLogsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { AuthenticityCheckerModal } from '../features/authenticity-checker/AuthenticityCheckerModal';
import { ProductModal } from '../features/product-modal/ProductModal';
import { Product } from '../shared/types';
import { Lock, ShieldAlert } from 'lucide-react';
import { Button } from '../shared/ui/Button';

export const App: React.FC = () => {
  const { role, setRole } = useStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyInitialSerial, setVerifyInitialSerial] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const tabTitles: Record<string, string> = {
    dashboard: 'داشبورد عملیات و شاخص‌ها',
    catalog: 'کاتالوگ و واریانت‌ها',
    collections: 'کالکشن‌ها و محتوا',
    inventory: 'انبار و گردش موجودی',
    orders: 'سفارش‌ها و تطبیق مالی',
    shipments: 'ارسال و کنترل کیفیت مرجوعی',
    customers: 'مشتریان و پرونده‌های پشتیبانی',
    marketing: 'بازاریابی و تحلیل جستجو',
    audit: 'ثبت رویدادهای حساس (Audit Trail)',
    settings: 'تنظیمات و ماتریس نقش‌ها',
  };

  const handleOpenVerifyPiece = (serial: string) => {
    setVerifyInitialSerial(serial);
    setIsVerifyModalOpen(true);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const isCurrentTabAllowed = canAccessSection(role, activeTab);

  const renderActiveTabContent = () => {
    if (!isCurrentTabAllowed) {
      return (
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-100">
              دسترسی غیرمجاز با نقش فعلی
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              نقش فعال شما «{ROLES_CONFIG[role].titleFa}» دسترسی مجاز برای مشاهده این بخش را ندارد.
              برای مشاهده، لطفاً از نوار بالای صفحه نقش کاربری خود را به «مالک یا مدیر کل» یا نقش مجاز تغییر دهید.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('dashboard')}
            >
              بازگشت به داشبورد
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setRole('owner')}
            >
              تغییر نقش به مالک / مدیر کل
            </Button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenProductModal={handleOpenAddProduct}
            onOpenVerifyModal={() => handleOpenVerifyPiece('LGH-SHB-001/050')}
          />
        );
      case 'catalog':
        return (
          <CatalogPage
            onOpenAddProduct={handleOpenAddProduct}
            onOpenEditProduct={handleOpenEditProduct}
            onNavigateToInventory={() => setActiveTab('inventory')}
          />
        );
      case 'collections':
        return <CollectionsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'orders':
        return <OrdersPage onOpenVerifyPiece={handleOpenVerifyPiece} />;
      case 'shipments':
        return <ShipmentsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'marketing':
        return <MarketingPage />;
      case 'audit':
        return <AuditLogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenProductModal={handleOpenAddProduct}
            onOpenVerifyModal={() => handleOpenVerifyPiece('LGH-SHB-001/050')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100 flex flex-row selection:bg-blue-600/30 selection:text-blue-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenVerifyModal={() => handleOpenVerifyPiece('LGH-SHB-001/050')}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          activeTabTitle={tabTitles[activeTab] || 'پنل لنگه'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveTabContent()}
        </main>
      </div>

      {/* Global Modals */}
      <AuthenticityCheckerModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        initialSerial={verifyInitialSerial}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={editingProduct}
      />
    </div>
  );
};
