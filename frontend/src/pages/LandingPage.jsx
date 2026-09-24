import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Truck, LayoutDashboard, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const portals = [
    {
      title: 'NGO Shelter Portal',
      description: 'Review incoming surplus food matches, inspect feasibility scores, and accept food before safe-use windows expire.',
      to: '/ngo/dashboard',
      icon: Building2,
      badge: 'Schedule & Feasibility',
      color: 'bg-sky-50 text-sky-600',
    },
    {
      title: 'Driver Logistics Portal',
      description: 'Route optimization, active food rescue pickup manifests, temperature integrity logs, and one-tap confirmations.',
      to: '/driver/dashboard',
      icon: Truck,
      badge: 'Rapid Dispatch',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Admin Command Center',
      description: 'Live food rescue telemetry, donor trust layer audit, AI matching KPIs, and real-time shelter distribution map.',
      to: '/admin/dashboard',
      icon: LayoutDashboard,
      badge: 'Operations Hub',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Trust & Verification Layer',
      description: 'Verify FSSAI 2019 Good Samaritan compliance, Darpan IDs, and public audit certificates for tax-exempt donors.',
      to: '/verify/CERT-2026-001',
      icon: ShieldCheck,
      badge: 'Section 24 Immunity',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <div className="space-y-8 py-2">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading and Actions */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Connecting surplus food to verified shelters before safe-use windows expire.
            </h2>

            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl">
              Surplus-to-Shelter coordinates donors, volunteer refrigerated drivers, and verified NGOs with automated feasibility matching and full FSSAI 2019 Good Samaritan legal liability immunity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/ngo/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#151c2e] hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-transform active:scale-95"
              >
                <span>Explore Rescue Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition"
              >
                <span>View Admin Audit Hub</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Food Donation Image */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200/80 group">
              <img
                src="/food-donation-hero.jpg"
                alt="Volunteers packaging nutritious food donations for shelters"
                className="w-full h-64 sm:h-72 lg:h-80 object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* 4 Core Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {portals.map((portal) => {
          const Icon = portal.icon;
          return (
            <Link
              key={portal.to}
              to={portal.to}
              className="group p-6 rounded-3xl bg-white/80 hover:bg-white backdrop-blur-xl border border-white/80 hover:border-sky-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-2xl ${portal.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    {portal.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-1.5">
                  {portal.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {portal.description}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                <span>Open Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
