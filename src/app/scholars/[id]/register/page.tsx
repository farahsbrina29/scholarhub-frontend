"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { scholarAPI, scholarRegistAPI, authAPI } from "@/services/api";

type FormData = {
  name: string;
  studentId: string;
  email: string;
  studyProgram: string;
  semester: string;
  reason: string;
};

export default function ScholarshipRegistrationForm({
  params: asyncParams,
}: {
  params: Promise<{ id: string }>;
}) {
  const [scholarId, setScholarId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    studentId: "",
    email: "",
    studyProgram: "",
    semester: "",
    reason: "",
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [scholarshipTitle, setScholarshipTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const { id } = await asyncParams;
        setScholarId(id);

        // 1) Panggil me() dan unpack user
        const authRes = await authAPI.me();
        console.log("raw me response:", authRes);
        const userObj = authRes.user ?? authRes;
        setUserId(userObj.id);

        // 2) Ambil detail scholarship
        const scholarship = await scholarAPI.getById(id);
        setScholarshipTitle(scholarship.scholarName || "Beasiswa");

        // 3) Cek apakah sudah terdaftar
        const all = await scholarRegistAPI.getAll();
        const existing = all.find(
          (item: any) =>
            item.scholarId === parseInt(id, 10) &&
            item.userId === userObj.id              // <-- gunakan userObj.id
        );
        if (existing) {
          setIsAlreadyRegistered(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load scholarship data.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [asyncParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scholarId || userId == null) {
      toast.error("Invalid scholarship or user data.");
      return;
    }

    // Validasi singkat
    const errs: string[] = [];
    if (!formData.name.trim()) errs.push("Name is required");
    if (!formData.studentId.trim()) errs.push("Student ID is required");
    if (!formData.email.trim()) errs.push("Email is required");
    if (!formData.studyProgram.trim()) errs.push("Study Program is required");
    if (!formData.semester.trim()) errs.push("Semester is required");
    if (!formData.reason.trim()) errs.push("Reason is required");
    if (errs.length) {
      toast.error(errs.join("\n"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const semNum = parseInt(formData.semester, 10);
    if (isNaN(semNum) || semNum < 1 || semNum > 14) {
      toast.error("Semester must be between 1 and 14");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        studentId: formData.studentId.trim(),
        email: formData.email.trim().toLowerCase(),
        studyProgram: formData.studyProgram.trim(),
        semester: semNum,
        note: formData.reason.trim(),
        scholarId: parseInt(scholarId, 10),
        userId: userId,                           // <-- kirim userId yang benar
      };

      console.log("📤 Payload:", payload);
      await scholarRegistAPI.create(payload);

      toast.success("Registration submitted successfully!");
      setTimeout(() => (window.location.href = "/status"), 1500);
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error("Failed to submit registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full text-center mt-20 text-xl font-semibold">
        Loading form...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <Head>
        <title>Register for {scholarshipTitle}</title>
      </Head>
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Register for {scholarshipTitle}
        </h1>

        {isAlreadyRegistered ? (
          <div className="text-center py-16">
            <p className="text-2xl font-bold text-blue-800 mb-4">
              You have already registered for this scholarship.
            </p>
            <button
              onClick={() => (window.location.href = "/status")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to Status Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
            {/* Input fields */}
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Full Name*
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="studentId">
                Student ID (NIM)*
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="email">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="studyProgram">
                Study Program*
              </label>
              <input
                type="text"
                id="studyProgram"
                name="studyProgram"
                value={formData.studyProgram}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="semester">
                Semester*
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Semester</option>
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <option key={sem} value={sem.toString()}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="reason">
                Reason for Applying*
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Please explain why you are applying for this scholarship..."
                required
              />
            </div>
            

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-3 rounded-md font-semibold transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
