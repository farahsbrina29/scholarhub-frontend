// app/scholars/page.tsx  (atau pages/scholars/index.tsx jika pakai pages/)
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import ScholarshipCard from "@/components/scholars/ScholarshipCard";
import { getScholars } from "@/services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getScholarshipStatus } from "@/utility/scholarshipdatautility";

interface Scholar {
  id: string;
  scholarName: string;
  startDate: string;
  endDate: string;
  description: string;
  category: string;
}

export default function ScholarPage() {
  const [scholarships, setScholarships] = useState<Scholar[]>([]);
  const [selectedMasaAktif, setSelectedMasaAktif] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getScholars();
        // map API fields → interface Scholar
        const mapped = data.map((item: any): Scholar => ({
          id: item.id,
          scholarName: item.scholarName,
          startDate: item.startDate,
          endDate: item.endDate,
          description: item.description,
          category: item.category,
        }));
        setScholarships(mapped);
      } catch (e) {
        console.error("Error fetching scholarships:", e);
        toast.error("Gagal memuat data beasiswa.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filtered = scholarships.filter(s => {
    const status = getScholarshipStatus(s.startDate, s.endDate);
    const masaOk =
      !selectedMasaAktif ||
      (selectedMasaAktif === "Sedang Berlangsung" && status === "Active") ||
      (selectedMasaAktif === "Akan Berakhir" && status === "Inactive");
    const jenisOk = !selectedJenis || s.category === selectedJenis;
    return masaOk && jenisOk;
  });

  const onClickCard = (id: string) => window.location.href = `/scholars/${id}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8 md:px-16">
        <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-10 border-l-8 border-blue-600 pl-4">
            Found Scholar
          </h1>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-10">
            <select
              value={selectedMasaAktif}
              onChange={e => setSelectedMasaAktif(e.target.value)}
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Masa Aktif</option>
              <option value="Sedang Berlangsung">Sedang Berlangsung</option>
              <option value="Akan Berakhir">Akan Berakhir</option>
            </select>
            <select
              value={selectedJenis}
              onChange={e => setSelectedJenis(e.target.value)}
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Jenis Beasiswa</option>
              <option value="Lingkungan">Lingkungan</option>
              <option value="Akademik">Akademik</option>
            </select>
          </div>

          {/* List */}
          {isLoading ? (
            <p className="text-center text-gray-500 text-lg">Loading...</p>
          ) : filtered.length > 0 ? (
            filtered.map(s => (
              <ScholarshipCard
                key={s.id}
                id={s.id}
                scholarName={s.scholarName}
                startDate={s.startDate}
                endDate={s.endDate}
                description={s.description}
                category={s.category}
                onClick={onClickCard}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 text-lg font-medium">
              Tidak ada beasiswa yang tersedia.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
