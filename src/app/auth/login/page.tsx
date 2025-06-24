"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authAPI } from "@/services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await authAPI.login(email, password);

    // ❗Tunda dulu sebelum panggil /auth/me, agar cookie access_token tersimpan
    setTimeout(async () => {
      try {
        const res = await authAPI.me();
        const role = res.user?.role || "USER";
        const targetPath = role === "ADMIN" ? "/admin" : "/";

        toast.success("Login success!", {
          position: "top-center",
          autoClose: 1500,
          onClose: () => router.push(targetPath),
        });
      } catch (err) {
        console.error("Gagal ambil user setelah login:", err);
        toast.error("Login berhasil, tapi gagal ambil data user", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }, 300); // jeda 300ms agar cookie terset

  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message?.includes("Invalid")
        ? "Email or password wrong"
        : error?.message?.includes("Network") || error?.message?.includes("Failed to fetch")
        ? "Check your network"
        : error.message || "Login gagal.";

    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 4000,
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex bg-[#143F6B]">
      <ToastContainer />

     {/* Kiri - Welcome & ScholarHub */}
    <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-2">
      <h1 className="text-5xl font-bold text-white text-center">
        Welcome!
      </h1>
      <h1 className="text-5xl font-semibold text-white text-center tracking-wide">
        ScholarHub
      </h1>
    </div>

      

      {/* Kanan - Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <form
          className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
          onSubmit={handleLogIn}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#143F6B]"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 pr-10 focus:outline-none focus:ring-2 focus:ring-[#143F6B]"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md text-white font-semibold transition-all ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#143F6B] hover:bg-blue-800"
            }`}
          >
            {isLoading ? "Loading..." : "Sign In"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Dont have a account?{" "}
            <a href="/auth/register" className="text-blue-600 hover:underline font-medium">
              Register now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
