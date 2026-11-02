import {
  Product,
  Variant,
  CollectionItem,
  HeroBanner,
  EditionPiece,
  Order,
  InventoryLog,
  ReturnRequest,
  Customer,
  SupportCase,
  DiscountCode,
  SearchKeywordStat,
  AuditLog,
  RoleKey,
} from '../types';
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
} from '../data/initialData';

const PREFIX = 'lengeh_panel_v1_';

export function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage set failed', e);
  }
}

export function clearStorage(): void {
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith(PREFIX)) {
      localStorage.removeItem(k);
    }
  });
}
