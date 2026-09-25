import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import api from '../../services/api';
import { 
  Truck, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Phone, 
  Mail,
  ShieldCheck,
  MapPin
} from 'lucide-react';

import { Link } from 'react-router-dom';

export default function AdminDrivers() {
  const { searchQuery: globalQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeQuery = localQuery || globalQuery || '';

  const adminNav = [
    { label: 'Overview', to: '/admin/dashboard', active: false },
    { label: 'Donations Ledger', to: '/admin/donations', active: false },
    { label: 'Verified Shelters', to: '/admin/recipients', active: false },
    { label: 'Driver Fleet', to: '/admin/drivers', active: true },
    { label: 'Protection Certificates', to: '/admin/certificates', active: false },
  ];

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await api.getDrivers();
      if (res && res.drivers) {
        setDrivers(res.drivers);
      }
    } catch (err) {
      console.error('Failed to fetch drivers from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filtered = drivers.filter((d) => {
    const q = activeQuery.toLowerCase().trim();
    return (
      !q ||
      d.name?.toLowerCase().includes(q) ||
      d.vehicleNumber?.toLowerCase().includes(q) ||
      d.vehicleType?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Admin Module Sub-Nav */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {adminNav.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
              tab.active
                ? 'bg-[#151c2e] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-slate-600 border border-white shadow-sm hover:text-slate-900'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-600" />
            Volunteer Logistics & Driver Fleet
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Refrigerated transport fleet retrieved live from PostgreSQL surplus_to_shelter.db.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDrivers}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-600' : ''}`} />
          </button>
          <div className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            {drivers.length} Registered Drivers
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search by Driver Name, Vehicle Number, Type..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          />
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((drv, idx) => (
          <div key={drv.id || idx} className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-5 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Truck className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                {drv.status || 'Available'}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{drv.name}</h3>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{drv.vehicleNumber}</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>Type: <strong className="text-slate-800">{drv.vehicleType}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{drv.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{drv.email}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OTP Verified & Food Safety Briefed</span>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 rounded-3xl bg-white/80 p-6 text-slate-400 text-xs">
            No driver records match "{activeQuery}".
          </div>
        )}
      </div>

    </div>
  );
}
