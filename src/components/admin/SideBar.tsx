'use client';

import { useRouter } from 'next/navigation';
import { FaUser, FaGraduationCap, FaChalkboardTeacher, FaSignOutAlt } from 'react-icons/fa';
import { authAPI } from '@/services/api';
import { toast } from 'react-toastify';

export default function AdminSidebar() {
  const router = useRouter();


  const navItems = [
    { label: 'User', icon: <FaUser />, path: '/admin/userTable' },
    { label: 'Scholar', icon: <FaGraduationCap />, path: '/admin/scholarTable' },
    { label: 'Workshop', icon: <FaChalkboardTeacher />, path: '/admin/workshopTable' },
  ];

  const handleLogout = async () => {
  try {
    await authAPI.logout(); // 🔐 Panggil endpoint logout
    toast.success('Berhasil logout', {
      position: 'top-center',
      autoClose: 1500,
    });
    setTimeout(() => {
      router.push('/auth/login');
    }, 1600);
  } catch (error) {
    toast.error('Gagal logout. Silakan coba lagi.');
  }
};

  return (
    <div className="min-h-screen w-64 bg-[#143F6B] text-white shadow-lg flex flex-col py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Admin Panel</h1>
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className="flex items-center gap-3 text-left px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
        <hr className="my-4 border-gray-500" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
