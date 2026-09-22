import api from './api';

export const mediaService = {
  getGalleries: () => api.get('/galleries').then(r => r.data),
  getGallery: (id: number) => api.get(`/galleries/${id}`).then(r => r.data),
  getGalleryPhotos: (id: number) => api.get(`/galleries/${id}/photos`).then(r => r.data),
  getVideos: () => api.get('/videos').then(r => r.data),
  getVideo: (id: number) => api.get(`/videos/${id}`).then(r => r.data),
  getVideosByType: (type: string) => api.get(`/videos/type/${type}`).then(r => r.data),
};
