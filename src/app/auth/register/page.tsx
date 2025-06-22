"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authAPI } from "@/services/api";

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
        autoClose: 3000,
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.register(fullName, email, password);
      toast.success("Account created successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Signup failed";
      toast.error(`Error: ${errorMessage}`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#143F6B]">
      <ToastContainer />

      {/* Kiri - Welcome & ScholarHub */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-2">
        <h1 className="text-5xl font-bold text-white text-center">Create Your Account!</h1>
        <h2 className="text-5xl font-semibold text-white text-center tracking-wide">ScholarHub</h2>
      </div>

      {/* Kanan - Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <form
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
          onSubmit={handleSignUp}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded-full text-black"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-full text-black"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-full text-black pr-12"
              placeholder="Enter password"
            />
            <button
              type="button"
              className="absolute right-4 top-9 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-full text-black pr-12"
              placeholder="Confirm password"
            />
            <button
              type="button"
              className="absolute right-4 top-9 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
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

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
