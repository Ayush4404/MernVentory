import React from "react";
import { Link } from "react-router-dom";
import Spline from '@splinetool/react-spline';



  <Spline scene="https://prod.spline.design/5qTWSX1Z0llbrpCj/scene.splinecode" />


export default function Home() {
  return (
        <div className="relative min-h-screen text-white">
      {/* 🌌 Spline Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <Spline scene="https://prod.spline.design/5qTWSX1Z0llbrpCj/scene.splinecode" />
      </div>
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4">
        <div className="text-2xl font-bold">
        Mernventory</div>
        <div className="space-x-4">
          <Link to="/register" className="hover:underline">Register</Link>
          <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Login</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between px-8 py-12 max-w-7xl mx-auto min-h-[80vh]">
        {/* Text Section */}
        <div className=" flex flex-col justify-center items-center md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Inventory & Stock <br /> Management App
          </h1>
          <p className="text-gray-300 max-w-lg">
            A simple and powerful inventory system built for businesses to manage products, stock levels, and categories in real-time.
          </p>
          <button className="border border-white hover:bg-white hover:text-[#0a0a45] transition px-6 py-3 rounded">
            Free Trial 1 Month
          </button>
          <div className="flex gap-8 pt-6">
            <div>
              <div className="text-2xl font-bold">14K+</div>
              <div className="text-sm text-gray-400">Business Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">23K</div>
              <div className="text-sm text-gray-400">Active Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-gray-400">Warehouses</div>
            </div>
          </div>
        </div>

        {/* Right Section with Illustration */}
        <div className=" flex justify-center items-center md:w-1/2 pt-10 md:pt-0">
          <img
            src="/home1.png"
            alt="Inventory Screenshot"
            className="rounded-xl shadow-lg"
          />
        </div>
      </main>
    </div>
  );
}
