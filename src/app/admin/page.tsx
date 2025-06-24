'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import AdminSidebar from '@/components/admin/SideBar';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        // ✅ Coba akses protected endpoint (opsional)
        await authAPI.adminOnly(); // Ini optional, untuk validasi server-side

        // ✅ Ambil data user
        const res = await authAPI.me();

        // 🔒 Periksa role-nya
        if (res.user?.role !== 'ADMIN') {
          throw new Error('Access Denied');
        }

        setAdminData(res.user);
      } catch (err: any) {
        try {
          // 🔁 Coba refresh token jika gagal
          const refreshRes = await authAPI.refreshToken();
          if (refreshRes.user?.role === 'ADMIN') {
            setAdminData(refreshRes.user);
            return;
          } else {
            throw new Error('Access Denied');
          }
        } catch (refreshErr: any) {
          setError(refreshErr.message || 'Gagal autentikasi admin.');
          setTimeout(() => router.push('/auth/login'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, [router]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          {loading && <p className="text-gray-700">⏳ Load admin...</p>}

          {!loading && error && (
            <p className="text-red-600 font-semibold">{error}</p>
          )}

          {!loading && adminData && (
            <>
              <h1 className="text-2xl font-bold text-green-700 mb-2">
                ✅Welcome, Admin
              </h1>
              <p className="text-gray-700 mb-2">Email: {adminData.email}</p>
              <p className="text-sm text-gray-500">Role: {adminData.role}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
