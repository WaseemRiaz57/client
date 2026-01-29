import axiosInstance from './axios';

// Auth token management
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-token', token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth-token');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
  }
};

// Auth API
export const authAPI = {
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    axiosInstance.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    axiosInstance.post('/auth/login', data),

  logout: () => axiosInstance.post('/auth/logout'),

  getProfile: () => axiosInstance.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getAll: (params?: Record<string, any>) =>
    axiosInstance.get('/products', { params }),

  getById: (id: string) =>
    axiosInstance.get(`/products/${id}`),

  getFeatured: () =>
    axiosInstance.get('/products/featured'),

  addReview: (id: string, data: { rating: number; comment: string }) =>
    axiosInstance.post(`/products/${id}/reviews`, data),
};

// Admin Products API
export const adminProductsAPI = {
  create: (formData: FormData) =>
    axiosInstance.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, formData: FormData) =>
    axiosInstance.put(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: string) =>
    axiosInstance.delete(`/admin/products/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => axiosInstance.get('/admin/dashboard/stats'),

  getOrderStats: () => axiosInstance.get('/admin/dashboard/orders-stats'),
};

export default axiosInstance;
