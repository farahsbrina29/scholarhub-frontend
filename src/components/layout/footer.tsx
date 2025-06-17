import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#143F6B] text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left px-6">

        {/* Section 1: About */}
        <div className="flex flex-col items-center md:items-start justify-between h-full">
          <div>
            <h2 className="text-3xl font-bold mb-6">ScholarHub</h2>
            <p className="text-lg leading-relaxed">
              Scholar Hub menyediakan informasi beasiswa untuk Pelajar Indonesia
              dalam mempersiapkan studi lanjut baik di dalam negeri maupun di luar
              negeri.
            </p>
          </div>
        </div>

        
        <div className="hidden md:block" />

      
        <div className="flex flex-col justify-end mt-10 md:mt-0">
          <h3 className="text-2xl font-semibold mb-6">Contact Us</h3>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center justify-center md:justify-start">
              <span className="mr-4">📧</span> scholarhub@mail.com
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <span className="mr-4">📞</span> +628512345678
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <span className="mr-4">📸</span> @scholarhub.id
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <span className="mr-4">📍</span> Scholar Office, Makassar,
              Sulawesi Selatan
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="border-t border-gray-400 mt-12"></div>
    </footer>
  );
};

export default Footer;
