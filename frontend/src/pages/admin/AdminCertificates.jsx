import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import api from '../../services/api';
import { 
  FileCheck, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  ArrowUpRight, 
  Download,
  Calendar,
  Building2,
  ExternalLink
} from 'lucide-react';

export default function AdminCertificates() {
  const { searchQuery: globalQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeQuery = localQuery || globalQuery || '';

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.getCertificates();
      if (res && res.certificates) {
        setCertificates(res.certificates);
      }
    } catch (err) {
      console.error('Failed to fetch certificates from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filtered = certificates.filter((c) => {
    const q = activeQuery.toLowerCase().trim();
    return (
      !q ||
      c.certId?.toLowerCase().includes(q) ||
      c.donor?.toLowerCase().includes(q) ||
      c.recipient?.toLowerCase().includes(q) ||
      c.clause?.toLowerCase().includes(q) ||
      c.cargo?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-emerald-600" />
            FSSAI Section 24 Legal Protection Certificates
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable digital certificates issued under FSSAI 2019 Regulations from PostgreSQL surplus_to_shelter.db.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCertificates}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            {certificates.length} Issued Certificates
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
            placeholder="Search by Certificate ID, Donor, Shelter..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
        </div>
      </div>

      {/* Certificates Table */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-sm space-y-4">
        <div className="text-xs text-slate-500 font-semibold">
          Showing {filtered.length} of {certificates.length} verifiable certificates
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Certificate ID</th>
                <th className="pb-3 px-3">Donor Restaurant</th>
                <th className="pb-3 px-3">Beneficiary Shelter</th>
                <th className="pb-3 px-3">Cargo Batch</th>
                <th className="pb-3 px-3">Statutory Protection Clause</th>
                <th className="pb-3 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c, idx) => (
                <tr key={c.id || idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-3 font-mono text-[11px] font-bold text-indigo-700">
                    {c.certId}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    {c.donor}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-700">
                    {c.recipient}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {c.cargo}
                  </td>
                  <td className="py-3.5 px-3 text-[11px] text-slate-500 max-w-xs truncate">
                    <span className="font-semibold text-emerald-700">FSSAI 2019</span>: {c.clause}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <a
                      href={`/verify/${c.certId}`}
                      className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200 transition inline-flex items-center gap-1"
                    >
                      <span>Verify</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                    No certificates matched "{activeQuery}".
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
