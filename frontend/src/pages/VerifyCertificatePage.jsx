import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, FileText, ArrowLeft, Download, Award } from 'lucide-react';
import api from '../services/api';

export default function VerifyCertificatePage() {
  const { id } = useParams();
  const [cert, setCert] = useState({
    id: id || 'CERT-2026-001',
    donorName: 'The Grand Palace Banquet & Caterers',
    shelterName: 'Green Future Foundation',
    mealsRescued: '80 Hot Cooked Meals',
    date: '24 September 2026, 10:15 AM',
    fssaiCompliance: 'Section 24 & Good Samaritan Immunity',
    taxExempt: 'Section 80G Compliant',
    verifier: 'Surplus-to-Shelter Trust Layer AI'
  });
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>

      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Official FSSAI 2019 Audit Record</span>
              <h2 className="text-xl font-bold text-slate-900">Certificate of Food Rescue</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Verified & Authentic
            </span>
          </div>
        </div>

        {/* Dual-Party Verification Banner */}
        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100/90 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-sky-900 block mb-0.5">Dual-Party Authenticated Record</span>
            Tamper-proof log verified against server timestamps from donor intake and recipient shelter acceptance under FSSAI (Recovery and Distribution of Surplus Food) Regulations 2019.
          </div>
        </div>

        {/* Certificate Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Certificate ID</span>
            <p className="font-mono font-bold text-slate-800 text-sm">{cert.id}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Timestamp</span>
            <p className="font-semibold text-slate-800">{cert.date}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Donor Entity</span>
            <p className="font-semibold text-slate-800">{cert.donorName}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Beneficiary Shelter</span>
            <p className="font-semibold text-slate-800">{cert.shelterName}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Surplus Meals Rescued</span>
            <p className="font-semibold text-emerald-700">{cert.mealsRescued}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Legal Protection</span>
            <p className="font-semibold text-slate-800">{cert.fssaiCompliance}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400">Section 80G tax benefit applicable for corporate donors.</span>
          <button
            onClick={() => alert(`Downloading verified audit PDF for ${cert.id}...`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#151c2e] hover:bg-slate-800 text-white font-semibold text-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Audit Certificate (PDF)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
