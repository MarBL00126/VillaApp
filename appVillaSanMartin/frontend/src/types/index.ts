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
