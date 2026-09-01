import api from './api';
import type { Player } from '../types';

export const playerService = {
  getAll: () => api.get<Player[]>('/players'),
  getById: (id: number) => api.get<Player>(`/players/${id}`),
  getByTeam: (teamId: number) => api.get<Player[]>(`/players/team/${teamId}`),
};
