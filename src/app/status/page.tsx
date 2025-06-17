"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
// @ts-ignore
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import { scholarRegistAPI, scholarAPI } from "@/services/api";

type RegistrationData = {
  id: string;
  scholarId: number;
  name: string;
  studentId: string;
  email: string;
  studyProgram: string;
  semester: number;
  note: string;
  document: string;
  status: string;
  registDate: string;
  createdAt: string;
  updatedAt: string;
};

export default function StatusPage() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) return;

        const allRegistrations: RegistrationData[] = await scholarRegistAPI.getAll();
        const filtered = allRegistrations.filter(
          (item) => item.email === userEmail
        );

        setRegistrations(filtered);
      } catch (error) {
        console.error("Failed to fetch registrations", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const getBadgeIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === "disetujui" || s === "approved")
      return {
        icon: <CheckCircleIcon className="h-10 w-10 text-green-500" />,
        tooltip: "Approved",
      };
    if (s === "tidak disetujui" || s === "rejected")
      return {
        icon: <XCircleIcon className="h-10 w-10 text-red-500" />,
        tooltip: "Rejected",
      };
    if (s.includes("menunggu") || s === "pending")
      return {
        icon: <ClockIcon className="h-10 w-10 text-yellow-500" />,
        tooltip: "Pending",
      };
    return {
      icon: <QuestionMarkCircleIcon className="h-10 w-10 text-gray-500" />,
      tooltip: "Unknown",
    };
  };

  const handleViewDetails = (scholarId: number, registrationId: string) => {
    router.push(`/status/${scholarId}/${registrationId}`);
  };


  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-2xl mt-10">
      <Head>
        <title>My Submitted Scholarships</title>
      </Head>

      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        My Submitted Scholarships
      </h1>

      {registrations.length === 0 ? (
        <p className="text-lg text-center text-gray-500">
          You have not registered for any scholarships yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {registrations.map((reg) => {
            const badge = getBadgeIcon(reg.status);
            return (
              <div
                key={`${reg.scholarId}-${reg.id}`}
                className="relative border rounded-lg p-6 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 bg-white"
              >
                <div className="absolute top-4 right-4">{badge.icon}</div>

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Scholarship #{reg.scholarId}
                </h2>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Registered on:</span>{" "}
                  {new Date(reg.registDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="font-semibold text-gray-700">
                    {reg.status}
                  </span>
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleViewDetails(reg.scholarId, reg.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#143F6B] rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
