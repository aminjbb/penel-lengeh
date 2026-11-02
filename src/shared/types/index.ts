export type RoleKey =
  | 'owner'
  | 'catalog_operator'
  | 'content_editor'
  | 'warehouse'
  | 'support'
  | 'finance'
  | 'analyst';

export interface UserRoleInfo {
  key: RoleKey;
  titleFa: string;
  description: string;
  badgeColor: string;
  allowedSections: string[];
}

export type PermissionKey =
  | 'view_dashboard'
  | 'manage_catalog'
  | 'manage_collections'
  | 'manage_inventory'
  | 'manage_orders'
  | 'process_refunds'
  | 'manage_shipments'
  | 'manage_returns'
  | 'view_customer_private_data'
  | 'manage_marketing'
  | 'view_audit_logs'
  | 'manage_settings';

export interface ProductSeo {
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  canonicalUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  titleFa: string;
  category: string;
  audience: 'زنانه' | 'مردانه' | 'یونیسکس';
  collectionId: 'shibui' | 'outspoken' | 'capsule';
  status: 'published' | 'draft' | 'archived';
  basePrice: number;
  description: string;
  materials: string;
  careInstructions: string;
  sizeGuide: string;
  images: string[];
  isLimitedEdition: boolean;
  editionLimit?: number;
  seo?: ProductSeo;
  createdAt: string;
}

export interface Variant {
  id: string;
  productId: string;
  sku: string;
  colorName: string;
  colorHex: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Free';
  stockHealthy: number;
  stockQuarantine: number;
  stockReserved: number;
  price: number;
  isActive: boolean;
}

export interface CollectionItem {
  id: string;
  slug: string;
  title: string;
  titleFa: string;
  subtitle: string;
  concept: string;
  story: string;
  heroImage: string;
  lookbook: string[];
  isActive: boolean;
  releaseDate: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  collectionTag: string;
  isActive: boolean;
}

export interface InventoryLog {
  id: string;
  sku: string;
  productName: string;
  variantDesc: string;
  changeAmount: number;
  resultingHealthy: number;
  reason: 'initial_stock' | 'sale_reserved' | 'sale_fulfilled' | 'return_quarantined' | 'stocktake_adjustment' | 'damage';
  operator: string;
  timestamp: string;
  notes: string;
}

export interface EditionPiece {
  id: string;
  serialNumber: string; // e.g. LGH-SHB-001/050
  editionName: string;
  pieceNumber: number;
  totalPieces: number;
  sku: string;
  productName: string;
  status: 'available' | 'allocated' | 'quarantined' | 'revoked';
  orderId?: string;
  customerNameMasked?: string;
  productionDate: string;
  craftsman: string;
  materialNote: string;
  certificateVersion: number;
  certificateHistory: {
    version: number;
    issuedAt: string;
    reason: string;
    operator: string;
  }[];
}

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'success'
  | 'failed'
  | 'refunded'
  | 'partial_refund'
  | 'discrepancy';

export interface OrderLine {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  pieceSerial?: string;
}

export interface OrderTimelineEvent {
  status: string;
  title: string;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhoneMasked: string;
  customerPhoneFull: string;
  items: OrderLine[];
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentGateway: string;
  transactionReference: string;
  idempotencyKey: string;
  shippingAddress: {
    province: string;
    city: string;
    postalAddress: string;
    postalCode: string;
    receiverName: string;
    receiverPhone: string;
  };
  carrier: string;
  trackingCode?: string;
  createdAt: string;
  timeline: OrderTimelineEvent[];
  refundDetails?: {
    amount: number;
    reason: string;
    refundedAt: string;
    approvedBy: string;
  };
}

export interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  carrier: 'peyk' | 'pishtaz' | 'tipax';
  trackingCode: string;
  status: 'packing' | 'handed_over' | 'in_transit' | 'delivered' | 'failed';
  dispatchedAt?: string;
  weightKg: number;
  shippingFee: number;
}

export interface ReturnRequest {
  id: string;
  rmaNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  pieceSerial?: string;
  sku: string;
  productName: string;
  returnReason: 'size_mismatch' | 'defect' | 'change_of_mind' | 'item_not_matched';
  qcStatus: 'pending' | 'approved_healthy' | 'approved_repairable' | 'rejected';
  resolution: 'exchange' | 'refund' | 'rejected';
  notes: string;
  requestedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface CustomerAddress {
  id: string;
  title: string;
  fullAddress: string;
  postalCode: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phoneMasked: string;
  phoneFull: string;
  email: string;
  totalOrders: number;
  totalSpend: number;
  registeredAt: string;
  addresses: CustomerAddress[];
  consentMarketing: boolean;
}

export interface SupportCase {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  subject: string;
  priority: 'urgent' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  operatorNotes: string[];
  createdAt: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface SearchKeywordStat {
  keyword: string;
  count: number;
  hasResults: boolean;
  convertedOrders: number;
}

export interface AuditLog {
  id: string;
  action: string;
  category: 'auth' | 'catalog' | 'inventory' | 'edition' | 'order' | 'refund' | 'setting';
  actorName: string;
  actorRole: string;
  timestamp: string;
  details: string;
  beforeSnapshot?: string;
  afterSnapshot?: string;
}
