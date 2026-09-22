import api from './api';

export const newsService = {
  getNews: () => api.get('/news').then(r => r.data),
  getFeaturedNews: () => api.get('/news/featured').then(r => r.data),
  getNewsById: (id: number) => api.get(`/news/${id}`).then(r => r.data),
  searchNews: (query: string) => api.get(`/news/search`, { params: { query } }).then(r => r.data),
  getCategories: () => api.get('/news/categories').then(r => r.data),
  getFavoriteNews: () => api.get('/favorites/news').then(r => r.data),
  addFavorite: (newsId: number) => api.post(`/favorites/news/${newsId}`).then(r => r.data),
  removeFavorite: (newsId: number) => api.delete(`/favorites/news/${newsId}`).then(r => r.data),
};
