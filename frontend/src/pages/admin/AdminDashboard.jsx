import React from 'react';
import { ShieldCheck, TrendingUp, Users, HeartHandshake, CheckCircle2, AlertCircle, FileText, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const kpis = [
    { label: 'Total Meals Rescued', value: '14,820', change: '+18.4% this week', icon: HeartHandshake, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Active Verified Shelters', value: '42', change: '100% Darpan & FSSAI', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Average Feasibility Match', value: '94.2%', change: '< 35 mins transit', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Tax & Audit Certificates', value: '318', change: '80G & FSSAI Compliant', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const recentRescues = [
    { donor: 'Taj Palace Banquet', shelter: 'Green Future Shelter', meals: '80 Meals', status: 'Completed', fssaiId: '10000000000001', certId: 'CERT-2026-089' },
    { donor: 'ITC Rajputana Kitchen', shelter: 'Anand Dham Seva', meals: '120 Meals', status: 'In Transit', fssaiId: '10000000000002', certId: 'CERT-2026-090' },
    { donor: 'BigBasket Fresh Hub', shelter: 'Hope Child Care', meals: '70 kg Produce', status: 'Delivered', fssaiId: '10000000000008', certId: 'CERT-2026-091' },
    { donor: 'Oberoi Convention Center', shelter: 'Seva Rasoi Trust', meals: '90 Meals', status: 'Scheduled', fssaiId: '10000000000003', certId: 'CERT-2026-092' },
  ];

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{kpi.label}</span>
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
            </div>
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Automated Compliance Active
            </span>
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
                <th className="pb-3 px-3">Rescue Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {recentRescues.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-3 font-bold text-slate-800">{row.donor}</td>
                  <td className="py-3.5 px-3 font-medium text-slate-600">{row.shelter}</td>
                  <td className="py-3.5 px-3 text-slate-600">{row.meals}</td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-sky-700">{row.fssaiId}</td>
                  <td className="py-3.5 px-3">
                    <a
                      href={`/verify/${row.certId}`}
                      className="font-mono text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      {row.certId}
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      row.status === 'Completed' || row.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : row.status === 'In Transit'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
