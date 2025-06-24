import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor untuk handle refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika token expired (401) dan belum dicoba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('🔄 Attempting token refresh...');
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('✅ Token refreshed successfully');
        return api(originalRequest); // Ulangi request asli
      } catch (refreshError) {
        console.error('🔁 Gagal refresh token:', refreshError);
        // Clear any stored auth state
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      console.error('❌ Register failed:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      console.log('🚪 Attempting logout...');
      const response = await api.post('/auth/logout', {});
      console.log('✅ Logout successful');
      return response.data;
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  },

  me: async () => {
    try {
      console.log('👤 Fetching user data...');
      console.log('🍪 Cookies available:', document.cookie);
      
      const response = await api.get('/auth/me');
      console.log('✅ User data fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch user data:', error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error) {
      console.error('❌ Refresh token failed:', error);
      throw error;
    }
  },

  // Check auth status
  checkStatus: async () => {
    try {
      const response = await api.get('/auth/status');
      return response.data;
    } catch (error) {
      console.error('❌ Check status failed:', error);
      throw error;
    }
  }

};

export const userAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/user');
      return res.data;
    } catch (error) {
      console.error('❌ Get all users failed:', error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const res = await api.get(`/user/${id}`);
      return res.data;
    } catch (error) {
      console.error(`❌ Get user ${id} failed:`, error);
      throw error;
    }
  },

  update: async (id: number, data: { name?: string; email?: string; password?: string }) => {
    try {
      const res = await api.patch(`/user/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(`❌ Update user ${id} failed:`, error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const res = await api.delete(`/user/${id}`);
      return res.data;
    } catch (error) {
      console.error(`❌ Delete user ${id} failed:`, error);
      throw error;
    }
  },
}

// ======================
// Scholar APIs
// ======================
export const scholarAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/scholar');
      return response.data;
    } catch (error) {
      console.error('❌ Get all scholars failed:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/scholar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Get scholar ${id} failed:`, error);
      throw error;
    }
  },

  create: async (scholarData: any) => {
    try {
      const response = await api.post('/scholar', scholarData);
      return response.data;
    } catch (error) {
      console.error('❌ Create scholar failed:', error);
      throw error;
    }
  },

  update: async (id: string, scholarData: any) => {
    try {
      const response = await api.put(`/scholar/${id}`, scholarData);
      return response.data;
    } catch (error) {
      console.error(`❌ Update scholar ${id} failed:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/scholar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Delete scholar ${id} failed:`, error);
      throw error;
    }
  },
};

// ================================
// Pendaftaran Beasiswa APIs
// ================================
export const scholarRegistAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/scholar-regist');
      return response.data;
    } catch (error) {
      console.error('❌ Get all scholar registrations failed:', error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get(`/scholar-regist/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Get scholar registration ${id} failed:`, error);
      throw error;
    }
  },

  create: async (data: any) => {
    try {
      const response = await api.post('/scholar-regist', data);
      return response.data;
    } catch (error) {
      console.error('❌ Create scholar registration failed:', error);
      throw error;
    }
  },

  update: async (id: number, data: any) => {
    try {
      const response = await api.put(`/scholar-regist/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`❌ Update scholar registration ${id} failed:`, error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const response = await api.delete(`/scholar-regist/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Delete scholar registration ${id} failed:`, error);
      throw error;
    }
  },
  
  getByUserId: async (userId: number) => {
    try {
      const response = await api.get(`/scholar-regist/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Get scholar registrations for user ${userId} failed:`, error);
      throw error;
    }
  },
};

export const workshopAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/workshop');
      return response.data;
    } catch (error) {
      console.error('❌ Get all workshops failed:', error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get(`/workshop/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Get workshop ${id} failed:`, error);
      throw error;
    }
  },

  create: async (workshopData: any) => {
    try {
      const response = await api.post('/workshop', workshopData);
      return response.data;
    } catch (error) {
      console.error('❌ Create workshop failed:', error);
      throw error;
    }
  },

  update: async (id: number, workshopData: any) => {
    try {
      const response = await api.patch(`/workshop/${id}`, workshopData);
      return response.data;
    } catch (error) {
      console.error(`❌ Update workshop ${id} failed:`, error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const response = await api.delete(`/workshop/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Delete workshop ${id} failed:`, error);
      throw error;
    }
  },
};

// ======================
// Utility functions
// ======================

// Helper untuk debug cookies
export const debugCookies = () => {
  if (typeof document !== 'undefined') {
    console.log('🍪 Current cookies:', document.cookie);
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    console.log('🍪 Parsed cookies:', cookies);
    return cookies;
  }
  return {};
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