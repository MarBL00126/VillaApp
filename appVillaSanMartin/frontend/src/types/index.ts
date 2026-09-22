// ── Auth ──────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

// ── Team ──────────────────────────────────────────────
export interface Team {
  id: number;
  name: string;
  city: string;
  shortName: string;
  logoUrl: string;
  stadium: string;
  category: string;
  primaryTeam: boolean;
  active: boolean;
}

// ── Player ────────────────────────────────────────────
export interface Player {
  id: number;
  name: string;
  surname: string;
  position: string;
  shirtNumber: number;
  height: number;
  nationality: string;
  birthDate: string;
  team: Team;
  biography?: string;
  imageUrl?: string;
  active?: boolean;
  favoriteCount?: number;
}

// ── Match ─────────────────────────────────────────────
export interface Match {
  id: number;
  matchDate: string;
  isLocal: boolean;
  opponent: string;
  teamPoints: number;
  opponentPoints: number;
  team: Team;
}

// ── Stats ─────────────────────────────────────────────
export interface PlayerStats {
  id: number;
  player: Player;
  playedGames: number;
  totalMinutes: number;
  totalPoints: number;
  madeFreeThrows: number;
  attemptedFreeThrows: number;
  madeTwoPointers: number;
  attemptedTwoPointers: number;
  madeThreePointers: number;
  attemptedThreePointers: number;
  totalRebounds: number;
  totalAssists: number;
  totalBlocks: number;
  totalTurnovers: number;
  totalSteals: number;
  totalFouls: number;
  totalValoration: number;
}
// ── TicketType ─────────────────────────────────────────────
export interface TicketType {
  id: number;
  match:Match;
  name:string;
  price:number;
  totalQuantity:number;
  availableQuantity:number;
  createdAt:string; 
}

export interface ProductCategory { id: number; name: string; slug: string; active: boolean; }
export interface Product { id: number; category: ProductCategory; name: string; description: string; price: number; imageUrl: string; active: boolean; }
export interface ProductVariant { id: number; label: string; stock: number; }
export interface FavoriteProduct { id: number; product: Product; createdAt: string; }
export interface CartItem { id: number; product: Product; variant: ProductVariant | null; quantity: number; unitPrice: number; }
export interface Cart { id: number; items: CartItem[]; }
export interface Coupon { id: number; code: string; discountPct: number; }
export interface ShopOrder { id: number; subtotal: number; discount: number; totalAmount: number; status: string; createdAt: string; items: ShopOrderItem[]; coupon: Coupon | null; }
export interface ShopOrderItem { id: number; product: Product; variant: ProductVariant | null; quantity: number; unitPrice: number; }
export interface NewsCategory { id: number; name: string; slug: string; }
export interface News { id: number; title: string; summary: string; content: string; imageUrl: string; featured: boolean; author: string; publishedAt: string; category: NewsCategory; }
export interface FavoriteNews { id: number; news: News; createdAt: string; }
export interface Gallery { id: number; title: string; coverImageUrl: string; eventDate: string; }
export interface Photo { id: number; imageUrl: string; caption: string; sortOrder: number; }
export interface Video { id: number; title: string; description: string; url: string; thumbnail: string; type: string; publishedAt: string; }
export interface CantinaInfo { id: number; address: string; phone: string; email: string; schedule: string; paymentMethods: string; mapsUrl: string; isOpen: boolean; }
export interface CantinaMenuCategory { id: number; name: string; sortOrder: number; }
export interface CantinaMenuItem { id: number; category: CantinaMenuCategory; name: string; description: string; price: number; imageUrl: string; available: boolean; }
export interface CantinaOrder { id: number; orderNumber: string; status: string; totalAmount: number; paymentMethod: string; createdAt: string; items: CantinaOrderItem[]; }
export interface CantinaOrderItem { id: number; menuItem: CantinaMenuItem; quantity: number; unitPrice: number; }

