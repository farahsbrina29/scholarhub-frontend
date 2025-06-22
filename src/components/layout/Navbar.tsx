'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { authAPI } from '@/services/api';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
  try {
    await authAPI.logout();
    toast.success('logout success');
    router.push('/auth/login');
  } catch (err) {
    toast.error('logout fail');
    console.error(err);
  }
};


  const navLinkClass = (path: string) =>
    `px-3 py-1 ${pathname === path ? 'text-white font-bold' : 'text-gray-400 hover:text-gray-200'}`;

  return (
    <nav className="bg-[#143F6B] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <div className="text-3xl font-bold">
          <Link href="/">ScholarHub</Link>
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Main Nav */}
        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } absolute top-16 left-0 w-full bg-[#143F6B] z-50 md:static md:w-auto md:flex md:items-center`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0 p-4 md:p-0">
            <Link href="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link href="/scholars" className={navLinkClass('/scholars')}>
              Scholar
            </Link>
            <Link href="/status" className={navLinkClass('/status')}>
              Status
            </Link>
            <Link href="/workshop" className={navLinkClass('/workshop')}>
              Workshop
            </Link>
            <Link href="/about" className={navLinkClass('/about')}>
              About
            </Link>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative ml-4 hidden md:block">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <FiUser size={22} />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50">
              <Link
                href="/profil"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                Profil
              </Link>
            
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
