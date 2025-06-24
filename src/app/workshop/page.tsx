"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/footer';
import { workshopAPI, authAPI } from '@/services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: number;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

interface Workshop {
  id: string;
  nameWorkshop: string;
  description: string;
  date: string;
  linkWorkshop: string;
}

export default function WorkshopPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  // Check authentication and role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authAPI.me();
        const userObj = res.user ?? res;
        if (userObj.role !== 'USER') {
          toast.error('Akses hanya untuk pengguna.');
          router.push('/admin');
          return;
        }
        setUser(userObj);
      } catch {
        try {
          const refreshRes = await authAPI.refreshToken();
          const userObj = refreshRes.user ?? refreshRes;
          if (userObj.role !== 'USER') {
            toast.error('Akses hanya untuk pengguna.');
            router.push('/auth/login');
            return;
          }
          setUser(userObj);
        } catch {
          router.push('/auth/login');
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch workshops
  useEffect(() => {
    if (isCheckingAuth === false) {
      (async () => {
        try {
          const data = await workshopAPI.getAll();
          setWorkshops(data);
        } catch (error) {
          console.error('Error fetching workshops:', error);
          toast.error('Fail fetch workshop');
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [isCheckingAuth]);



  return (
    <>
      <ToastContainer />
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8 md:px-16">
        <section className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-10 border-l-8 border-blue-600 pl-4">
            Newest Workshop
          </h1>

          {isLoading ? (
            <p className="text-center text-gray-500 text-lg">Loading...</p>
          ) : workshops.length > 0 ? (
            <div className="space-y-6">
              {workshops.map((w) => {
                const isUpcoming = new Date(w.date) > new Date();

                return (
                  <div
                    key={w.id}
                    className="border border-gray-200 rounded-md p-6 shadow-sm hover:shadow-lg transition"
                  >
                    <h2 className="text-2xl font-bold text-[#143F6B] mb-2">
                      {w.nameWorkshop}
                    </h2>
                    <p className="text-gray-600 mb-2">{w.description}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      Date: {new Date(w.date).toLocaleDateString('id-ID')}
                    </p>
                    <a
                      href={isUpcoming ? w.linkWorkshop : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block font-semibold ${
                        isUpcoming
                          ? 'text-blue-600 hover:underline'
                          : 'text-gray-400 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      {isUpcoming ? 'Link Workshop' : 'Link Workshop Expired'}
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-lg font-medium">
              Workshop not available
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
