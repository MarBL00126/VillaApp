import api from './api';

export const cantinaService = {
  getInfo: () => api.get('/cantina/info').then(r => r.data),
  getMenu: () => api.get('/cantina/menu').then(r => r.data),
  getMenuCategories: () => api.get('/cantina/categories').then(r => r.data),
  createOrder: (order: any) => api.post('/cantina/orders', order).then(r => r.data),
  trackOrder: (orderNumber: string) => api.get(`/cantina/orders/${orderNumber}`).then(r => r.data),
  getMyOrders: () => api.get('/cantina/orders/my').then(r => r.data),
};
