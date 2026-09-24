import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import api from '../../services/api';
import { 
  HeartHandshake, 
  Search, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin,
  Utensils,
  ExternalLink
} from 'lucide-react';

export default function AdminDonations() {
  const { searchQuery: globalQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState('');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const activeQuery = localQuery || globalQuery || '';

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await api.getDonations();
      if (res && res.donations) {
        setDonations(res.donations);
      }
    } catch (err) {
      console.error('Failed to fetch donations from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const filtered = donations.filter((d) => {
    const q = activeQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      d.foodTitle?.toLowerCase().includes(q) ||
      d.donorName?.toLowerCase().includes(q) ||
      d.pickupAddress?.toLowerCase().includes(q) ||
      d.status?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'ALL' ||
      d.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-indigo-600" />
            Donation History & Lifecycle Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete food rescue ledger retrieved live from PostgreSQL surplus_to_shelter.db.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDonations}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          <div className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
            {donations.length} Active Records
          </div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search by Food Title, Restaurant, Location..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PENDING', 'ACCEPTED', 'DELIVERED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Table */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-sm space-y-4">
        <div className="text-xs text-slate-500 font-semibold">
          Showing {filtered.length} of {donations.length} surplus entries in PostgreSQL
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Food Cargo</th>
                <th className="pb-3 px-3">Donor Restaurant</th>
                <th className="pb-3 px-3">Quantity & Meals</th>
                <th className="pb-3 px-3">Pickup Location</th>
                <th className="pb-3 px-3">Lifecycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d, idx) => (
                <tr key={d.id || idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-slate-400" />
                      {d.foodTitle}
                    </div>
                    <div className="text-[11px] text-slate-400">{d.foodType}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-800">{d.donorName}</div>
                    <div className="text-[11px] text-slate-400">{d.donorPhone}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-800">{d.quantity}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{d.pickupAddress}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3" />
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400 text-xs">
                    No donation entries matched "{activeQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
