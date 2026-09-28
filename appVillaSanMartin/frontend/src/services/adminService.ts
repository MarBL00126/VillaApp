import api from './api';
import type {
  AdminDashboardFull,
  AppConfig,
  CantinaMenuCategory,
  CantinaMenuItem,
  CantinaOrder,
  Match,
  Membership,
  Product,
  ProductVariant,
  Player,
} from '../types';

export interface PlayerPayload {
  name: string;
  surname: string;
  position: string;
  shirtNumber: number;
  height: number;
  nationality: string;
  birthDate: string;
  teamId?: number;
  biography?: string;
  imageUrl?: string;
  active: boolean;
}

export interface MatchPayload {
  matchDate: string;
  isLocal: boolean;
  opponent: string;
  teamPoints: number;
  opponentPoints: number;
  teamId?: number;
}

export interface CategoryPayload {
  name: string;
  sortOrder: number;
}

export interface MenuItemPayload {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  available: boolean;
}

export interface AdminResourceInfo {
  key: string;
  label: string;
  description: string;
}

export const adminService = {
  getDashboard: () => api.get<Record<string, number>>('/admin/dashboard').then((r) => r.data),
  getDashboardFull: () => api.get<AdminDashboardFull>('/admin/dashboard/full').then((r) => r.data),

  getPlayers: () => api.get<Player[]>('/admin/players').then((r) => r.data),
  savePlayer: (player: PlayerPayload, id?: number) =>
    (id ? api.put<Player>(`/admin/players/${id}`, player) : api.post<Player>('/admin/players', player)).then((r) => r.data),
  setPlayerActive: (id: number, active: boolean) =>
    api.put<Player>(`/admin/players/${id}/active`, { active }).then((r) => r.data),

  getMatches: () => api.get<Match[]>('/admin/matches').then((r) => r.data),
  saveMatch: (match: MatchPayload, id?: number) =>
    (id ? api.put<Match>(`/admin/matches/${id}`, match) : api.post<Match>('/admin/matches', match)).then((r) => r.data),
  deleteMatch: (id: number) => api.delete(`/admin/matches/${id}`),

  getCantinaCategories: () => api.get<CantinaMenuCategory[]>('/admin/cantina/categories').then((r) => r.data),
  saveCantinaCategory: (category: CategoryPayload, id?: number) =>
    (id
      ? api.put<CantinaMenuCategory>(`/admin/cantina/categories/${id}`, category)
      : api.post<CantinaMenuCategory>('/admin/cantina/categories', category)
    ).then((r) => r.data),

  getCantinaItems: () => api.get<CantinaMenuItem[]>('/admin/cantina/items').then((r) => r.data),
  saveCantinaItem: (item: MenuItemPayload, id?: number) =>
    (id ? api.put<CantinaMenuItem>(`/admin/cantina/items/${id}`, item) : api.post<CantinaMenuItem>('/admin/cantina/items', item)).then((r) => r.data),
  setCantinaItemAvailable: (id: number, available: boolean) =>
    api.put<CantinaMenuItem>(`/admin/cantina/items/${id}/available`, { available }).then((r) => r.data),

  getCanteenOrders: () => api.get<CantinaOrder[]>('/admin/orders/cantina').then((r) => r.data),
  setCanteenOrderStatus: (id: number, status: string) =>
    api.put<CantinaOrder>(`/admin/orders/cantina/${id}/status`, { status }).then((r) => r.data),

  getProductsAdmin: () => api.get<Product[]>('/admin/products').then((r) => r.data),
  setProductVariantStock: (productId: number, variantId: number, stock: number) =>
    api.put<ProductVariant>(`/admin/products/${productId}/stock/${variantId}`, { stock }).then((r) => r.data),

  getMembers: () => api.get<Membership[]>('/admin/members').then((r) => r.data),
  setMemberStatus: (id: number, status: string) =>
    api.put<Membership>(`/admin/members/${id}/status`, { status }).then((r) => r.data),

  getConfig: () => api.get<AppConfig[]>('/admin/config').then((r) => r.data),
  setConfigValue: (key: string, value: string) =>
    api.put<AppConfig>(`/admin/config/${encodeURIComponent(key)}`, { value }).then((r) => r.data),

  getResources: () => api.get<AdminResourceInfo[]>('/admin/resources').then((r) => r.data),
  getResourceRows: (resource: string) => api.get<Record<string, unknown>[]>(`/admin/resources/${resource}`).then((r) => r.data),
  createResourceRow: (resource: string, row: Record<string, unknown>) =>
    api.post<Record<string, unknown>>(`/admin/resources/${resource}`, row).then((r) => r.data),
  updateResourceRow: (resource: string, id: number, row: Record<string, unknown>) =>
    api.put<Record<string, unknown>>(`/admin/resources/${resource}/${id}`, row).then((r) => r.data),
  deleteResourceRow: (resource: string, id: number) => api.delete(`/admin/resources/${resource}/${id}`),
};
