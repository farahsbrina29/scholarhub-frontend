"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  getScholarshipStatus,
  formatCustomDate,
} from "@/utility/scholarshipdatautility";
import { scholarAPI, authAPI } from "@/services/api";

export default function ScholarDetail() {
  const params = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        // Cek apakah user login
        await authAPI.me();
        
        const id = params?.id as string;
        const data = await scholarAPI.getById(id);
        setScholarship(data);
      } catch (error: any) {
        console.error("Error:", error);

        if (error?.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/login");
        } else {
          toast.error("Gagal memuat data beasiswa.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarship();
  }, [params, router]);

  if (isLoading) {
    return <div className="text-center py-16 text-gray-500 text-base">Loading...</div>;
  }

  if (!scholarship) {
    return <div className="text-center py-16 text-red-500 text-base">Beasiswa tidak ditemukan.</div>;
  }

  const isScholarshipActive =
    getScholarshipStatus(scholarship.startDate, scholarship.endDate) === "Active";

  return (
    <div className="bg-white py-6 px-6 max-w-3xl mx-auto shadow-md rounded-lg border border-gray-200 mt-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        {scholarship.scholarName}
      </h1>
      <p className="text-base text-gray-700 mb-3">
        <strong>Date:</strong> {formatCustomDate(scholarship.startDate)} -{" "}
        {formatCustomDate(scholarship.endDate)}
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            isScholarshipActive
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          }`}
        >
          {getScholarshipStatus(scholarship.startDate, scholarship.endDate)}
        </span>
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
          {scholarship.category}
        </span>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Description</h2>
        <p className="text-sm text-gray-700">{scholarship.description}</p>
      </div>
      <hr className="my-4" />
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Requirements</h2>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {Array.isArray(scholarship.scholarRequirement) ? (
            scholarship.scholarRequirement.map((req: string, index: number) => (
              <li key={index}>{req}</li>
            ))
          ) : (
            <p>{scholarship.scholarRequirement || "No requirements available."}</p>
          )}
        </ul>
      </div>
      <hr className="my-4" />
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Contact</h2>
        <p className="text-sm text-gray-700">{scholarship.contact}</p>
      </div>
      <hr className="my-4" />
      <Link href={isScholarshipActive ? `/scholars/${scholarship.id}/register` : "#"}>
        <button
          className={`w-full py-2 rounded-md text-base font-medium transition duration-200 ${
            isScholarshipActive
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
          disabled={!isScholarshipActive}
        >
          {isScholarshipActive ? "Register Now" : "Closed"}
        </button>
      </Link>
    </div>
  );
}
