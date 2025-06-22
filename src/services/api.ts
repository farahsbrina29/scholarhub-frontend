import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ⬅️ ini wajib agar cookies dikirim otomatis
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ⛔ Tidak perlu inject token dari localStorage
// Karena kamu pakai httpOnly cookies yang dikirim otomatis

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika token expired (401) dan belum dicoba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        return api(originalRequest); // Ulangi request asli
      } catch (refreshError) {
        console.error('🔁 Gagal refresh token:', refreshError);
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  logout: async () => {
  const response = await api.post('/auth/logout', {}, { withCredentials: true });
  return response.data;
},

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  adminOnly: async () => {
    const response = await axios.get(`/auth/admin-only`, {
      withCredentials: true,
    });
    return response.data;
  }
};
export const userAPI = {
  getAll: async () => {
    const res = await api.get('/user'); // GET semua user (ADMIN)
    return res.data;
  },

  getById: async (id: number) => {
    const res = await api.get(`/user/${id}`); // GET user by ID (ADMIN only)
    return res.data;
  },

  update: async (id: number, data: { name?: string; email?: string; password?: string }) => {
    const res = await api.patch(`/user/${id}`, data);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await api.delete(`/user/${id}`);
    return res.data;
  },
}

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
// src/services/api.ts

export const workshopAPI = {
  getAll: async () => {
    const response = await api.get('/workshop');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/workshop/${id}`);
    return response.data;
  },

  create: async (workshopData: any) => {
    const response = await api.post('/workshop', workshopData);
    return response.data;
  },

  update: async (id: number, workshopData: any) => {
    const response = await api.patch(`/workshop/${id}`, workshopData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/workshop/${id}`);
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
