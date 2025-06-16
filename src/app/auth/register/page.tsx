"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authAPI } from "@/services/api"; // Sesuaikan path

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { 
        position: "top-center", 
        autoClose: 3000 
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!", { 
        position: "top-center", 
        autoClose: 3000 
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await authAPI.register(fullName, email, password);

      toast.success("Account created successfully!", { 
        position: "top-center", 
        autoClose: 2000 
      });
      
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Signup failed";
      toast.error(`Error creating account: ${errorMessage}`, { 
        position: "top-center", 
        autoClose: 3000 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://bwi24jam.co.id/asset/foto_berita/9-beasiswa-yang-mulai-dibuka-tahun-2025-jangan-sampai-terlewat2.jpg')" }}>
      <ToastContainer />

      <div className="flex-1 flex items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-6xl font-bold text-white">Create Your Account!</h1>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black bg-opacity-50">
        <form className="w-full max-w-md space-y-6" onSubmit={handleSignUp}>
          <div>
            <label className="text-white text-sm block">Full Name</label>
            <input 
              type="text" 
              required 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              className="w-full px-4 py-2 rounded-full text-black" 
            />
          </div>

          <div>
            <label className="text-white text-sm block">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2 rounded-full text-black" 
            />
          </div>

          <div className="relative">
            <label className="text-white text-sm block">Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2 rounded-full text-black pr-12" 
            />
            <button 
              type="button" 
              className="absolute right-4 top-7 text-gray-500 hover:text-gray-700" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <div className="relative">
            <label className="text-white text-sm block">Confirm Password</label>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-4 py-2 rounded-full text-black pr-12" 
            />
            <button 
              type="button" 
              className="absolute right-4 top-7 text-gray-500 hover:text-gray-700" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className={`w-full py-2 rounded-full text-white transition-colors ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#143F6B] hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Creating..." : "Sign Up"}
          </button>

          <div className="text-center text-white text-sm">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-400 hover:underline">Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
}