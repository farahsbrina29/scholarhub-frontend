import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Buat instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ✅ Tambahkan interceptor untuk menyisipkan access_token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor response untuk refresh token saat 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika 401 dan belum dicoba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) throw new Error('Refresh token tidak ditemukan');

        // Refresh access token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token,
        });

        const newAccessToken = response.data.access_token;
        localStorage.setItem('access_token', newAccessToken);

        // Set token baru dan ulangi request awal
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('🔁 Gagal refresh token:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// ======================
// Auth APIs
// ======================
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (fullName: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { fullName, email, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

// ======================
// Scholar APIs
// ======================
export const scholarAPI = {
  getAll: async () => {
    const response = await api.get('/scholar');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/scholar/${id}`);
    return response.data;
  },
  create: async (scholarData: any) => {
    const response = await api.post('/scholar', scholarData);
    return response.data;
  },
  update: async (id: string, scholarData: any) => {
    const response = await api.put(`/scholar/${id}`, scholarData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/scholar/${id}`);
    return response.data;
  },
};

// ================================
// Pendaftaran Beasiswa APIs
// ================================
export const scholarRegistAPI = {
  getAll: async () => {
    const response = await api.get('/scholar-regist');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/scholar-regist/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/scholar-regist', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/scholar-regist/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/scholar-regist/${id}`);
    return response.data;
  },
};

// ======================
// Legacy compatibility
// ======================
export async function getScholars() {
  try {
    return await scholarAPI.getAll();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export default api;
