'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success('Berhasil logout');
    router.push('/auth/login');
  };

  return (
    <nav className="bg-[#143F6B] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-bold">
          <Link href="/">ScholarHub</Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } absolute top-16 left-0 w-full bg-[#143F6B] z-50 md:static md:w-auto md:flex md:items-center`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0 p-4 md:p-0">
            <Link
              href="/"
              className={`px-3 py-1 ${
                pathname === '/'
                  ? 'text-white font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Home
            </Link>
            <Link
              href="/scholars"
              className={`px-3 py-1 ${
                pathname === '/scholars'
                  ? 'text-white font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Scholars
            </Link>
            <Link
              href="/status"
              className={`px-3 py-1 ${
                pathname === '/status'
                  ? 'text-white font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Status
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1 ${
                pathname === '/about'
                  ? 'text-white font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              About
            </Link>

            {/* Tombol Logout */}
            <button
              onClick={handleLogout}
               className={`px-3 py-1 ${
                pathname === '/about'
                  ? 'text-white font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
