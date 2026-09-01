import api from './api';
import type { Match } from '../types';

export const matchService = {
  getAll: () => api.get<Match[]>('/matches'),
  getFixture: () => api.get<Match[]>('/fixture'),
};
