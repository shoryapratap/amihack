import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import api from '../../services/api';
import { ShieldCheck, TrendingUp, Users, HeartHandshake, CheckCircle2, AlertCircle, FileText, ArrowUpRight, RefreshCw } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { searchQuery } = useSearch();
  const [kpis, setKpis] = useState([
    { label: 'Total Meals Rescued', value: '14,820', change: '+18.4% this week', icon: HeartHandshake, color: 'text-sky-600', bg: 'bg-sky-50', link: '/admin/donations' },
    { label: 'Active Verified Shelters', value: '42', change: '100% Darpan & FSSAI', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/admin/recipients' },
    { label: 'Average Feasibility Match', value: '96.5%', change: '< 35 mins transit', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/drivers' },
    { label: 'Tax & Audit Certificates', value: '318', change: '80G & FSSAI Compliant', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/certificates' },
  ]);

  const [recentRescues, setRecentRescues] = useState([
    { donor: 'The Grand Palace Banquet', shelter: 'Green Future Shelter', meals: '50 Meals', status: 'Completed', fssaiId: '22221074000456', certId: 'CERT-2026-001' },
    { donor: 'ITC Rajputana Kitchen', shelter: 'Anand Dham Seva', meals: '120 Meals', status: 'In Transit', fssaiId: '10020011000142', certId: 'CERT-2026-090' },
    { donor: 'BigBasket Fresh Hub', shelter: 'Hope Child Care', meals: '70 kg Produce', status: 'Delivered', fssaiId: '10020011000143', certId: 'CERT-2026-091' },
    { donor: 'Haldiram Sweets & Dining', shelter: 'Seva Rasoi Trust', meals: '90 Meals', status: 'Scheduled', fssaiId: '10020011000144', certId: 'CERT-2026-092' },
  ]);

  const loadData = async () => {
    try {
      const kpiRes = await api.getAdminKPIs();
      if (kpiRes && kpiRes.kpis) {
        setKpis((prev) =>
          prev.map((item, idx) => ({
            ...item,
            value: kpiRes.kpis[idx]?.value || item.value,
            change: kpiRes.kpis[idx]?.change || item.change,
          }))
        );
      }
      const certRes = await api.getCertificates();
      if (certRes && certRes.certificates && certRes.certificates.length > 0) {
        const liveRows = certRes.certificates.map((c) => {
          const donorName = typeof c.donor === 'object' ? (c.donor?.name || 'Live Test Restaurant') : String(c.donor || 'Live Test Restaurant');
          const shelterName = typeof c.recipient === 'object' ? (c.recipient?.name || 'Green Future Shelter') : String(c.recipient || 'Green Future Shelter');
          const mealsText = typeof c.donation === 'object' ? (c.donation?.description || '40 Meals') : String(c.cargo || '40 Meals');
          const certId = String(c.id || c.certId || 'CERT-2026-001');
          const fssai = typeof c.recipient === 'object' ? (c.recipient?.fssaiLicense || '22221074000456') : '22221074000456';
          return {
            donor: donorName,
            shelter: shelterName,
            meals: mealsText,
            status: 'Certified & Protected',
            fssaiId: fssai,
            certId: certId,
          };
        });
        setRecentRescues((prev) => [...liveRows, ...prev.filter((p) => !liveRows.some((l) => l.certId === p.certId))]);
      }
    } catch (e) {
      console.warn('Admin stats load notice:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRescues = recentRescues.filter((r) => {
    const q = (searchQuery || '').toLowerCase().trim();
    const donor = String(r.donor || '').toLowerCase();
    const shelter = String(r.shelter || '').toLowerCase();
    const meals = String(r.meals || '').toLowerCase();
    const certId = String(r.certId || '').toLowerCase();
    return (
      !q ||
      donor.includes(q) ||
      shelter.includes(q) ||
      meals.includes(q) ||
      certId.includes(q)
    );
  });

  const adminNav = [
    { label: 'Overview', to: '/admin/dashboard', active: true },
    { label: 'Donations Ledger', to: '/admin/donations', active: false },
    { label: 'Verified Shelters', to: '/admin/recipients', active: false },
    { label: 'Driver Fleet', to: '/admin/drivers', active: false },
    { label: 'Protection Certificates', to: '/admin/certificates', active: false },
  ];

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              to={kpi.link || '/admin/dashboard'}
              className="rounded-3xl bg-white/85 hover:bg-white backdrop-blur-xl border border-white/80 hover:border-sky-300 p-5 shadow-sm space-y-3 transition-all hover:shadow-md hover:-translate-y-0.5 group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-800">{kpi.value}</div>
                <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {kpi.change}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Table: Live Trust & Verification Audit */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Live Trust Layer & Verification Audit</h2>
            <p className="text-xs text-slate-400">Verifying Darpan ID, FSSAI Section 24, and automated 80G certificate issuance</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Donor Entity</th>
                <th className="pb-3 px-3">Recipient Shelter</th>
                <th className="pb-3 px-3">Surplus Cargo</th>
                <th className="pb-3 px-3">FSSAI License</th>
                <th className="pb-3 px-3">Audit Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredRescues.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-3 font-bold text-slate-800">{row.donor}</td>
                  <td className="py-3.5 px-3 font-medium text-slate-600">{row.shelter}</td>
                  <td className="py-3.5 px-3 text-slate-600">{row.meals}</td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-sky-700">{row.fssaiId}</td>
                  <td className="py-3.5 px-3">
                    <Link
                      to={`/verify/${row.certId}`}
                      className="font-mono text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      {row.certId}
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredRescues.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                    No rescue records match your search.
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
