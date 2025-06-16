'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/layout/heroSection';
import Footer from '@/components/layout/footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterSection from '@/components/home/FilterSection';
import ScholarshipCard from '@/components/home/ScholarshipCard';
import { getScholarshipStatus } from '@/utility/scholarshipdatautility';
import { getScholars } from '@/services/api';

export default function Home() {
  const router = useRouter();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [isActiveDropdownOpen, setIsActiveDropdownOpen] = useState(true);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(true);
  const [selectedActiveFilters, setSelectedActiveFilters] = useState<string[]>([]);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Fungsi refresh token tanpa utils
  const refreshAccessToken = async (): Promise<string | null> => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) return null;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        return data.access_token;
      }

      return null;
    } catch (error) {
      console.error('❌ Gagal refresh token:', error);
      return null;
    }
  };

  // Auth check
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        let token = localStorage.getItem('access_token');
        if (!token) throw new Error('Token tidak ditemukan');

        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Date.now() / 1000;

          if (payload.exp && payload.exp < currentTime) {
            console.log('⚠️ Token expired, mencoba refresh...');
            const newToken = await refreshAccessToken();
            if (!newToken) throw new Error('Refresh gagal');
            token = newToken;
          }
        }

        setIsLoggedIn(true);
      } catch (error) {
        console.warn('❌ Gagal autentikasi:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        toast.error('Silakan login kembali.');
        router.push('/auth/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [router]);

  // Fetch scholarships
  useEffect(() => {
    if (!isLoggedIn || isCheckingAuth) return;

    const fetchScholarships = async () => {
      setIsLoading(true);
      try {
        const data = await getScholars();
        setScholarships(data);
      } catch (error: any) {
        console.error('❌ Gagal fetch:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
          router.push('/auth/login');
        } else {
          toast.error('Gagal memuat data beasiswa.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, [isLoggedIn, isCheckingAuth, router]);

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === 'active') {
      setSelectedActiveFilters((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    } else if (filterType === 'category') {
      setSelectedCategoryFilters((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    }
  };

  const resetFilters = () => {
    setSelectedActiveFilters([]);
    setSelectedCategoryFilters([]);
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const status = getScholarshipStatus(scholarship.tanggal_mulai, scholarship.tanggal_akhir);
    const isActiveMatch =
      selectedActiveFilters.length === 0 ||
      (selectedActiveFilters.includes('Masih Berlangsung') && status === 'Active') ||
      (selectedActiveFilters.includes('Akan Berakhir') && status === 'Inactive');
    const isCategoryMatch =
      selectedCategoryFilters.length === 0 || selectedCategoryFilters.includes(scholarship.kategori);

    return isActiveMatch && isCategoryMatch;
  });

  const handleCardClick = (id: string) => {
    window.location.href = `/scholars/${id}`;
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Memverifikasi Akses</h2>
          <p className="text-gray-600">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div>
      <Navbar />
      <HeroSection />
      <div className="bg-white py-16 px-16 mt-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900">Found Scholar</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <FilterSection
            isActiveDropdownOpen={isActiveDropdownOpen}
            setIsActiveDropdownOpen={setIsActiveDropdownOpen}
            isCategoryDropdownOpen={isCategoryDropdownOpen}
            setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
            selectedActiveFilters={selectedActiveFilters}
            selectedCategoryFilters={selectedCategoryFilters}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
          />

          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Memuat data beasiswa...</p>
              </div>
            ) : filteredScholarships.length > 0 ? (
              <>
                <div
                  className={`grid ${
                    filteredScholarships.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
                  } gap-8`}
                >
                  {filteredScholarships.slice(0, 6).map((scholarship) => (
                    <ScholarshipCard
                      key={scholarship.id}
                      id={scholarship.id}
                      scholarName={scholarship.scholarName}
                      startDate={scholarship.startDate}
                      endDate={scholarship.endDate}
                      description={scholarship.description}
                      category={scholarship.category}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    className="text-blue-600 font-semibold hover:underline transition-colors duration-200"
                    onClick={() => router.push('/scholars')}
                  >
                    View More &gt;
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg font-medium mb-4">
                  Tidak ada beasiswa yang tersedia saat ini.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Muat Ulang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
