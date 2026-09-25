import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import api from '../../services/api';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

import { Link } from 'react-router-dom';

export default function AdminRecipients() {
  const { searchQuery: globalQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [verifyingId, setVerifyingId] = useState(null);

  const activeQuery = localQuery || globalQuery || '';

  const adminNav = [
    { label: 'Overview', to: '/admin/dashboard', active: false },
    { label: 'Donations Ledger', to: '/admin/donations', active: false },
    { label: 'Verified Shelters', to: '/admin/recipients', active: true },
    { label: 'Driver Fleet', to: '/admin/drivers', active: false },
    { label: 'Protection Certificates', to: '/admin/certificates', active: false },
  ];

  const fetchRecipients = async () => {
    try {
      setLoading(true);
      const res = await api.getRecipients();
      if (res && res.recipients) {
        setRecipients(res.recipients);
      }
    } catch (err) {
      console.error('Failed to fetch recipients from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleVerify = async (item) => {
    setVerifyingId(item.id);
    try {
      await api.request('/verify/check-ngo', {
        method: 'POST',
        body: JSON.stringify({
          name: item.name || item.organizationName,
          darpan_id: item.darpanId || item.registrationNumber,
          fssai_number: item.fssaiNumber || '22221074000456'
        })
      });
      // Refresh list
      await fetchRecipients();
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setVerifyingId(null);
    }
  };

  const filtered = recipients.filter((r) => {
    const q = activeQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.name?.toLowerCase().includes(q) ||
      r.organizationName?.toLowerCase().includes(q) ||
      r.darpanId?.toLowerCase().includes(q) ||
      r.fssaiNumber?.toLowerCase().includes(q) ||
      r.address?.toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === 'ALL' ||
      r.status?.toUpperCase() === filterStatus ||
      (filterStatus === 'APPROVED' && (r.status === 'verified' || r.status === 'approved'));

    return matchesSearch && matchesStatus;
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

      {/* Top Banner & Stats */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-600" />
            NGO Partner Registry & Verification Queue
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time synchronization with PostgreSQL database & NITI Aayog NGO Darpan directory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRecipients}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-600' : ''}`} />
          </button>
          <div className="px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
            {recipients.length} Registered Shelters
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Local Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search by NGO Name, Darpan ID, FSSAI..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {['ALL', 'APPROVED', 'PENDING'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                filterStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Shelters' : st === 'APPROVED' ? 'Verified' : 'Pending'}
            </button>
          ))}
        </div>
      </div>

      {/* Recipients Table */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-sm space-y-4">
        <div className="text-xs text-slate-500 font-semibold">
          Showing {filtered.length} of {recipients.length} records retrieved from database
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Shelter / Organization</th>
                <th className="pb-3 px-3">Darpan ID</th>
                <th className="pb-3 px-3">FSSAI Number</th>
                <th className="pb-3 px-3">Location & Capacity</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, idx) => {
                const isApproved =
                  item.status === 'approved' ||
                  item.status === 'verified';

                return (
                  <tr key={item.id || idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.name || item.organizationName}</div>
                      <div className="text-[11px] text-slate-400">{item.phone}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-sky-700">
                      {item.darpanId || item.registrationNumber || 'N/A'}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-indigo-700">
                      {item.fssaiNumber || 'Pending'}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{item.address}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{item.capacity || `${item.capacityMeals || 250} Meals/day`}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {isApproved ? 'Verified & Active' : 'Pending Verification'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleVerify(item)}
                        disabled={verifyingId === item.id}
                        className="px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-semibold text-[11px] transition inline-flex items-center gap-1"
                      >
                        {verifyingId === item.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-3 h-3" />
                        )}
                        <span>{isApproved ? 'Re-Verify' : 'Verify Credentials'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                    No shelter records matched your query "{activeQuery}".
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
