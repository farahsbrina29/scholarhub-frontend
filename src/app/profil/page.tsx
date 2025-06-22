'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, userAPI } from '@/services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/layout/Navbar';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAPI.me();
        if (res.user) {
          setUser(res.user);
          setName(res.user.name);
          setEmail(res.user.email);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleUpdate = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      await userAPI.update(user.id, { name, email });
      toast.success('Update success');
    } catch (error) {
      toast.error('Update fail');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    const confirmDelete = confirm('Are you sure delete your account?');
    if (!confirmDelete) return;

    try {
      await userAPI.delete(user.id);
      toast.success('Delete success');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      toast.error('Fail delete account.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Load profil...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-10">
        <div className="bg-white shadow-md rounded-xl w-full max-w-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">User Profile</h1>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updating}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={updating}
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className={`px-4 py-2 rounded text-white ${
                updating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {updating ? 'Save...' : 'Save change'}
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
