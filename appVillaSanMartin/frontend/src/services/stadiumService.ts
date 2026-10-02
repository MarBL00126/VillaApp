import api from './api';

export const stadiumService = {
  getInfo: () => api.get('/stadiums').then(r => r.data),
  getSectors: () => api.get('/stadiums/sectors').then(r => r.data),
  getServices: (type?: string) => api.get('/stadiums/services', { params: type ? { type } : undefined }).then(r => r.data),
};

export const accessService = {
  scan: (qrCode: string, gate: string, matchId?: number) =>
    api.post('/access/scan', { qrCode, gate, matchId }).then(r => r.data),
  getLogs: (matchId: number) => api.get(`/access/logs/${matchId}`).then(r => r.data),
  getSummary: (matchId: number) => api.get(`/access/logs/${matchId}/summary`).then(r => r.data),
};

export const pressService = {
  request: (data: object) => api.post('/press', data).then(r => r.data),
  getMy: () => api.get('/press/my').then(r => r.data),
  getCard: (id: number) => api.get(`/press/${id}/card`).then(r => r.data),
  getAdmin: (matchId?: number, status?: string) =>
    api.get('/press/admin', { params: { matchId, status } }).then(r => r.data),
  approve: (id: number, sectorId: number, gate: string) =>
    api.patch(`/press/${id}/approve`, { sectorId, gate }).then(r => r.data),
  reject: (id: number, notes: string) =>
    api.patch(`/press/${id}/reject`, { notes }).then(r => r.data),
  revoke: (id: number) => api.patch(`/press/${id}/revoke`).then(r => r.data),
};
