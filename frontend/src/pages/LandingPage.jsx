import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-3xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
          🌱 Donor Trust Layer + Zero-Friction Rescue
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Surplus-to-Shelter
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Connecting businesses with surplus edible food to nearby verified shelters before safe-use windows expire — backed by FSSAI 2019 Good Samaritan protection.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link to="/login" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-white transition">
            Sign In
          </Link>
          <Link to="/signup" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-slate-200 border border-slate-700 transition">
            Register NGO / Driver
          </Link>
          <Link to="/admin/dashboard" className="px-6 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold transition">
            Admin Dashboard Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
