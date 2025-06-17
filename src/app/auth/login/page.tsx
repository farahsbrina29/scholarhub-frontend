"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    const data = await authAPI.login(email, password);

    if (data.access_token && data.refresh_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
  
    }

    toast.success("Login successful! Welcome back!", {
      position: "top-center",
      autoClose: 2000,
    });

    setTimeout(() => router.push("/"), 2000);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Login failed";
    toast.error(`Login failed: ${errorMessage}`, {
      position: "top-center",
      autoClose: 3000,
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="relative flex min-h-screen">
      {/* Background image */}
      <Image
      src="/assets/signin.png"
      alt="Background"
      fill
      className="z-0 object-cover"
      quality={100}
      priority
    />


      {/* Content */}
      <ToastContainer />
      <div className="relative z-20 flex flex-1">
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white">Welcome!</h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <form className="w-full max-w-md space-y-6" onSubmit={handleLogIn}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-full text-black"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-full text-black pr-12"
              />
              <button
                type="button"
                className="absolute right-4 top-9 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>


            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-full text-white transition-colors ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#143F6B] hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Processing..." : "Sign In"}
            </button>

            <div className="text-center text-white text-sm">
              Don't have an account?{" "}
              <a href="/auth/register" className="text-blue-400 hover:underline">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
