import React from "react";

const HeroSection = () => {
  return (
    <div
      className="relative h-screen bg-cover"
      style={{
        backgroundImage: `url('/assets/signup.jpg')`,  // Ganti dengan path gambar yang diinginkan
        backgroundPosition: 'center 70%',
        backgroundAttachment: 'fixed',  // Efek parallax
        overflow: 'hidden',  // Menyembunyikan bagian gambar yang keluar dari rounded corners
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',  // Efek bayangan di bawah
      }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        style={{
        }}
      ></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-6xl md:text-7xl font-bold">
          Found Your Scholar Dream
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-medium">
          Welcome To Scholar Hub
        </p>
      </div>
    </div>
  );
};

export default HeroSection;