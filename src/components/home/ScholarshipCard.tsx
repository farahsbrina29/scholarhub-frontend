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
  return (
    <div
      className="border rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick(id)}
    >
      <h3 className="text-xl font-bold mb-2 text-black">{scholarName}</h3>
      <p className="text-black text-sm mb-4">
        {formatCustomDate(startDate)} - {formatCustomDate(endDate)}
      </p>
      <p className="text-black text-sm mb-4">
        {description}.
      </p>
      <div className="flex items-center space-x-2 mb-4">
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            getScholarshipStatus(startDate, endDate) === "Active"
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          }`}
        >
          {getScholarshipStatus(startDate, endDate)}
        </span>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
          {category}
        </span>
      </div>
      <button className="text-blue-600 font-semibold hover:underline">
        See Details
      </button>
    </div>
  );
};

export default ScholarshipCard;
