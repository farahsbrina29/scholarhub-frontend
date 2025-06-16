const monthsIndo = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Parsing dari format DD-MM-YYYY ke objek Date
export function parseCustomDate(dateString: string) {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // Bulan dikurangi 1 karena indeks bulan mulai dari 0
}

// Format objek Date menjadi "20 November 2024"
export function formatCustomDate(dateString: string) {
  const date = new Date(dateString); // langsung dari ISO string
  const day = date.getDate();
  const month = monthsIndo[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function getScholarshipStatus(
  startDate: string,
  endDate: string
): string {
  const today = new Date();
  const start = new Date(startDate); // langsung dari ISO string
  const end = new Date(endDate);
  return today >= start && today <= end ? "Active" : "Inactive";
}

export function sortScholarshipsByDate(
  scholarships: Array<{
    startDate: string;
    endDate: string;
  }>,
  sortBy: "startDate" | "endDate",
  order: "asc" | "desc" = "asc"
) {
  return scholarships.sort((a, b) => {
    const dateA = new Date(a[sortBy]); // ISO string
    const dateB = new Date(b[sortBy]);

    return order === "asc"
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
}
