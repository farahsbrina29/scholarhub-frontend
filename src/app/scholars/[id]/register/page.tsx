"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { scholarAPI, scholarRegistAPI } from "@/services/api";

type FormData = {
  name: string;
  studentId: string;
  email: string;
  studyProgram : string;
  semester: string;
  reason: string;
  document: File | null;
};

export default function ScholarshipRegistrationForm({
  params: asyncParams,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(asyncParams);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    studentId: "",
    email: "",
    studyProgram: "",
    semester: "",
    reason: "",
    document: null,
  });

  const [scholarshipTitle, setScholarshipTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      try {
        const scholarship = await scholarAPI.getById(id);
        setScholarshipTitle(scholarship.scholarName || "Beasiswa");

        const all = await scholarRegistAPI.getAll();
        const existing = all.find(
          (item: any) =>
            item.scholar_id === parseInt(id) &&
            item.email === formData.email
        );
        if (existing) {
          setIsAlreadyRegistered(true);
        }
      } catch (err) {
        console.error("Error fetching scholarship or registration:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params, formData.email]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2 MB.");
      return;
    }
    setFormData((prev) => ({ ...prev, dokumen: file }));
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { id } = await params;

    if (
      !formData.name ||
      !formData.studentId ||
      !formData.email ||
      !formData.studyProgram ||
      !formData.semester ||
      !formData.reason
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Placeholder dokumen
      const dokumenUrl = "https://example.com/dummy-document.pdf";

      const payload = {
        nama: formData.name,
        nim: formData.studentId,
        email: formData.email,
        program_studi: formData.studyProgram,
        semester: formData.semester,
        alasan_mendaftar: formData.reason,
        dokumen: dokumenUrl,
        tanggal_pendaftaran: formatDate(new Date()),
        nama_beasiswa: scholarshipTitle,
        scholar_id: parseInt(id),
        status: "menunggu persetujuan",
        catatan_admin: "",
      };

      await scholarRegistAPI.create(payload);

      toast.success("Registration submitted successfully!");
      setTimeout(() => {
        window.location.href = "/status";
      }, 2000);
    } catch (error) {
      console.error("Failed to submit:", error);
      toast.error("Failed to submit registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="w-full text-center mt-20 text-xl font-semibold">
        Loading form...
      </div>
    );

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
              onClick={() => (window.location.href = `/status`)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to Status Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-base font-medium mb-1" htmlFor="nama">
                Full Name*
              </label>
              <input
                type="text"
                id="nama"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1" htmlFor="nim">
                Student ID (NIM)*
              </label>
              <input
                type="text"
                id="nim"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1" htmlFor="email">
                Email*
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1" htmlFor="program_studi">
                Study Program*
              </label>
              <input
                type="text"
                id="program_studi"
                value={formData.studyProgram}
                onChange={(e) =>
                  setFormData({ ...formData, studyProgram: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1" htmlFor="semester">
                Semester*
              </label>
              <input
                type="number"
                id="semester"
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">
                Reason for Applying
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">
                Upload Supporting Documents*
              </label>
              <input
                type="file"
                name="dokumen"
                onChange={handleFileChange}
                className="w-full px-4 py-2"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Max file size: 2 MB.</p>
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-3 rounded-md font-semibold ${
                isSubmitting ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
