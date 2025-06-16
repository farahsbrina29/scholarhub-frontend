import React from "react";
import { formatCustomDate, getScholarshipStatus } from "@/utility/scholarshipdatautility";

interface ScholarshipCardProps {
  id: string;
  scholarName: string;
  startDate: string;
  endDate: string;
  description: string;
  category: string;
  onClick: (id: string) => void;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  id,
  scholarName,
  startDate,
  endDate,
  description,
  category,
  onClick,
}) => {
  const status = getScholarshipStatus(startDate, endDate);

  return (
    <div
      onClick={() => onClick(id)}
      className="cursor-pointer p-6 mb-6 border rounded-lg bg-white"
    >
      <h2 className="text-lg font-bold mb-1 text-black">{scholarName}</h2>
      <p className="text-gray-700 text-sm mb-4">
        {formatCustomDate(startDate)} - {formatCustomDate(endDate)}
      </p>
      <p className="text-gray-800 mb-4 text-sm">{description}</p>

      <div className="flex items-center space-x-2 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === "Active"
              ? "bg-green-200 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
          {category}
        </span>
      </div>

      <button
        className="text-blue-600 font-semibold text-sm hover:underline"
        onClick={(e) => {
          e.stopPropagation();
          onClick(id);
        }}
      >
        Read More
      </button>
    </div>
  );
};

export default ScholarshipCard;
