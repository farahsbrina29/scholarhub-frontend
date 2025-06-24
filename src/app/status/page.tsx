"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { authAPI, scholarRegistAPI } from "@/services/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StatusPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const authRes = await authAPI.me();
        const userObj = authRes.user ?? authRes;
        const data = await scholarRegistAPI.getByUserId(userObj.id);
        setRegistrations(data);
      } catch (error: any) {
        console.error(error);
        // if unauthorized, try refresh
        if (error.response?.status === 401) {
          try {
            const refreshRes = await authAPI.refreshToken();
            const userObj = refreshRes.user ?? refreshRes;
            const data = await scholarRegistAPI.getByUserId(userObj.id);
            setRegistrations(data);
          } catch (refreshError) {
            console.error("Refresh token failed", refreshError);
            toast.error("Session expired. Redirecting to login...");
            router.push("/auth/login");
          }
        } else {
          toast.error("Failed to load registrations");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const friendlyStatus = (raw: string) => {
    if (raw === "waiting_for_result") return "Waiting for Result";
    if (raw === "accepted") return "Accepted";
    if (raw === "rejected") return "Rejected";
    return raw;
  };

  const filtered = registrations.filter((reg) => {
    if (!filterStatus) return true;
    return reg.status === filterStatus;
  });

  const onClickDetail = (id: number) => {
    router.push(`/status/${id}`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8 md:px-16">
        <Head>
          <title>My Submitted Scholarships</title>
        </Head>
        <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-6 border-l-8 border-blue-600 pl-4">
            My Scholarship Registrations
          </h1>

          {/* Filter Dropdown */}
          <div className="mb-6 flex items-center gap-4">
            <label htmlFor="statusFilter" className="font-medium">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-md px-4 py-2"
            >
              <option value="">All</option>
              <option value="waiting_for_result">Waiting for Result</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400">No registrations found.</p>
          ) : (
            <ul className="space-y-4">
              {filtered.map((reg) => (
                <li
                  key={reg.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() => onClickDetail(reg.id)}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{reg.scholar?.scholarName}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        reg.status === 'accepted'
                          ? 'bg-green-200 text-green-800'
                          : reg.status === 'rejected'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {friendlyStatus(reg.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Registered on: {new Date(reg.registDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Period: {new Date(reg.scholar.startDate).toLocaleDateString()} -{' '}
                    {new Date(reg.scholar.endDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
