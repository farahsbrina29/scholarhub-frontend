import React from "react";

interface FilterSectionProps {
  selectedMasaAktif: string;
  setSelectedMasaAktif: (value: string) => void;
  selectedJenis: string;
  setSelectedJenis: (value: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  selectedMasaAktif,
  setSelectedMasaAktif,
  selectedJenis,
  setSelectedJenis,
}) => {
  return (
    <div className="dropdown-container">
      <div className="dropdown-wrapper">
        <select
          className="styled-dropdown"
          value={selectedMasaAktif}
          onChange={(e) => setSelectedMasaAktif(e.target.value)}
        >
          <option value="">Masa Aktif</option>
          <option value="Sedang Berlangsung">Sedang Berlangsung</option>
          <option value="Akan Berakhir">Akan Berakhir</option>
        </select>
        <div className="dropdown-icon">▼</div>
      </div>

      <div className="dropdown-wrapper">
        <select
          className="styled-dropdown"
          value={selectedJenis}
          onChange={(e) => setSelectedJenis(e.target.value)}
        >
          <option value="">Jenis Beasiswa</option>
          <option value="Akademik">Akademik</option>
          <option value="Non Akademik">Non Akademik</option>
          <option value="Bantuan">Bantuan</option>
          <option value="Penelitian">Penelitian</option>
        </select>
        <div className="dropdown-icon">▼</div>
      </div>
    </div>
  );
};

export default FilterSection;
