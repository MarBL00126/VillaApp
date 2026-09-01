import api from './api';
import type { PlayerStats } from '../types';

export const statsService = {
  getAll: () => api.get<PlayerStats[]>('/stats'),
  getByPlayerId: (playerId: number) => api.get<PlayerStats>(`/stats/player/${playerId}`),
};
