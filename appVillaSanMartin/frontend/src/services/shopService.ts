import api from './api';

export const shopService = {
  // Products
  getProducts: () => api.get('/products').then(r => r.data),
  getProduct: (id: number) => api.get(`/products/${id}`).then(r => r.data),
  getCategories: () => api.get('/products/categories').then(r => r.data),
  getByCategory: (slug: string) => api.get(`/products/category/${slug}`).then(r => r.data),
  getVariants: (productId: number) => api.get(`/products/${productId}/variants`).then(r => r.data),
  
  // Cart
  getCart: () => api.get('/cart').then(r => r.data),
  addToCart: (productId: number, variantId: number | null, quantity: number) =>
    api.post('/cart/items', { productId, variantId, quantity }).then(r => r.data),
  updateCartItem: (itemId: number, quantity: number) =>
    api.put(`/cart/items/${itemId}`, { quantity }).then(r => r.data),
  removeCartItem: (itemId: number) => api.delete(`/cart/items/${itemId}`).then(r => r.data),
  clearCart: () => api.delete('/cart').then(r => r.data),
  
  // Coupon
  validateCoupon: (code: string, amount: number) =>
    api.post('/coupons/validate', { code, amount }).then(r => r.data),
  
  // Orders
  createOrder: (couponCode?: string) =>
    api.post('/shop/orders', { couponCode }).then(r => r.data),
  getMyOrders: () => api.get('/shop/orders/my').then(r => r.data),
  getOrder: (id: number) => api.get(`/shop/orders/${id}`).then(r => r.data),
  payOrder: (id: number) => api.post(`/shop/orders/${id}/pay`).then(r => r.data),
  
  // Favorites
  getFavorites: () => api.get('/favorites/products').then(r => r.data),
  addFavorite: (productId: number) => api.post(`/favorites/products/${productId}`).then(r => r.data),
  removeFavorite: (productId: number) => api.delete(`/favorites/products/${productId}`).then(r => r.data),
};
