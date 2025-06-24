'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/layout/heroSection';
import Footer from '@/components/layout/footer';
import FilterSection from '@/components/home/FilterSection';
import ScholarshipCard from '@/components/home/ScholarshipCard';
import { getScholarshipStatus } from '@/utility/scholarshipdatautility';
import { authAPI, scholarAPI } from '@/services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Scholarship {
  id: string;
  scholarName: string;
  startDate: string;
  endDate: string;
  description: string;
  category: string;
  tanggal_mulai: string;
  tanggal_akhir: string;
  kategori: string;
}

export default function Home() {
  const router = useRouter();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedActiveFilters, setSelectedActiveFilters] = useState<string[]>([]);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ✅ Autentikasi & Refresh Token
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await authAPI.me();
      if (res.user) {
        if (res.user.role !== 'USER') {
          toast.error('Akses hanya untuk pengguna.');
          router.push('/admin'); // Atau arahkan ke halaman lain
          return;
        }
        setUser(res.user);
      } else {
        router.push('/auth/login');
      }
    } catch {
      try {
        const refreshRes = await authAPI.refreshToken();
        if (refreshRes.user) {
          if (refreshRes.user.role !== 'USER') {
            toast.error('Access Denied');
            router.push('/auth/login'); 
            return;
          }
          setUser(refreshRes.user);
        } else {
          router.push('/auth/login');
        }
      } catch {
        router.push('/auth/login');
      }
    } finally {
      setIsCheckingAuth(false);
    }
  };

  checkAuth();
}, [router]);


  // ✅ Ambil Beasiswa
  useEffect(() => {
    if (isCheckingAuth || !user) return;

    const fetchScholarships = async () => {
      setIsLoading(true);
      try {
        const data = await scholarAPI.getAll();
        setScholarships(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('❌ Fail load scholar:', error);
        toast.error('Fail load scholar.', {
          position: 'top-center',
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, [isCheckingAuth, user]);

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'active') {
      setSelectedActiveFilters(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (type === 'category') {
      setSelectedCategoryFilters(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };

  const filteredScholarships = scholarships.filter(scholar => {
    const status = getScholarshipStatus(
      scholar.tanggal_mulai || scholar.startDate,
      scholar.tanggal_akhir || scholar.endDate
    );

    const isActiveMatch =
      selectedActiveFilters.length === 0 ||
      (selectedActiveFilters.includes('On Going') && status === 'Active') ||
      (selectedActiveFilters.includes('Inactive') && status === 'Inactive');

    const isCategoryMatch =
      selectedCategoryFilters.length === 0 ||
      selectedCategoryFilters.includes(scholar.kategori || scholar.category);

    return isActiveMatch && isCategoryMatch;
  });


  return (
    <div>
      <ToastContainer />
      <Navbar />
      <HeroSection />
      <div className="bg-white py-16 px-6 md:px-16 mt-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900">Found Scholar</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <FilterSection
            isActiveDropdownOpen={true}
            setIsActiveDropdownOpen={() => {}}
            isCategoryDropdownOpen={true}
            setIsCategoryDropdownOpen={() => {}}
            selectedActiveFilters={selectedActiveFilters}
            selectedCategoryFilters={selectedCategoryFilters}
            handleFilterChange={handleFilterChange}
            resetFilters={() => {
              setSelectedActiveFilters([]);
            }}
          />

          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Load scholar...</p>
              </div>
            ) : filteredScholarships.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredScholarships.slice(0, 6).map(s => (
                    <ScholarshipCard
                      key={s.id}
                      id={s.id}
                      scholarName={s.scholarName}
                      startDate={s.startDate || s.tanggal_mulai}
                      endDate={s.endDate || s.tanggal_akhir}
                      description={s.description}
                      category={s.category || s.kategori}
                      onClick={() => router.push(`/scholars/${s.id}`)}
                    />
                  ))}
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    className="text-blue-600 font-semibold hover:underline"
                    onClick={() => router.push('/scholars')}
                  >
                    View More &gt;
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg font-medium mb-4">
                   Scholar not available
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Refresh
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
