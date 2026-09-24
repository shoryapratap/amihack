import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Download,
  Share2,
  Copy,
  FileText,
  Calendar,
  Clock,
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Printer,
  QrCode,
  AlertTriangle,
  Lock,
  ExternalLink
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';

export default function VerifyCertificatePage() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCertificate(id || 'CERT-2026-001');
      if (res.certificate) {
        setCert(res.certificate);
      } else {
        throw new Error('Certificate data not found in response');
      }
    } catch (err) {
      console.error('Failed to load certificate:', err);
      setError(err.message || 'Certificate not found in registry');
    } finally {
      setLoading(false);
    }
  };

  const copyVerificationLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const shareToWhatsApp = () => {
    if (!cert) return;
    const text = encodeURIComponent(
      `📜 Official FSSAI 2019 Good Samaritan Donation Protection Certificate for ${cert.donor?.name}.\nVerified Record ID: ${cert.id}\nVerify Live: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Querying Official FSSAI Audit Registry...</p>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>

        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-rose-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Certificate Verification Failed</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {error || `No authentic certificate record was found matching ID '${id}'. Dual-confirmation may be pending or the identifier is invalid.`}
          </p>
          <div className="pt-2">
            <Link
              to="/ngo/restaurants"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
            >
              Explore Certified Food Rescues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatTimestamp = (iso) => {
    if (!iso) return 'Pending Server Timestamp';
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6 print:py-0 print:max-w-none">
      
      {/* Top Utility Bar (Hidden during print) */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link to="/ngo/restaurants" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Surplus Map</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={copyVerificationLink}
            className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
          <button
            onClick={shareToWhatsApp}
            className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share WhatsApp</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-full bg-[#151c2e] hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Certificate Container */}
      <div className="rounded-3xl bg-white border-2 border-slate-200/90 p-6 sm:p-10 shadow-lg space-y-8 relative overflow-hidden print:border-none print:shadow-none print:p-4">
        
        {/* Decorative Official Guilloche Top Border */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-sky-600 via-emerald-600 to-amber-500" />

        {/* Certificate Header with Emblem & Seals */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0 shadow-inner">
              <Award className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                  Government of India Compliance
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  FSSAI Act 2006 / Surplus Reg. 2019
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Donation Protection Certificate
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Official Good Samaritan Liability Immunity & Safe Food Recovery Audit Log
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-black border-2 border-emerald-300 flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>DUAL-PARTY AUTHENTICATED</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-400">
              REGISTRY ID: {cert.id}
            </span>
          </div>
        </div>

        {/* Legal Immunity Hero Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 border border-sky-200/80 space-y-3">
          <div className="flex items-center gap-2 text-sky-900 font-black text-sm">
            <Lock className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Statutory Immunity Protection — {cert.legalProtection?.clauseCited}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-serif italic bg-white/90 p-4 rounded-xl border border-sky-100 shadow-sm">
            "{cert.legalProtection?.regulationText}"
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-medium pt-1">
            <span>✓ Civil & Criminal Liability Immunity Active</span>
            <span>✓ FSSAI Schedule 4 Hygienic Standards Certified</span>
            <span>✓ Eligible for Section 80G / CSR Records</span>
          </div>
        </div>

        {/* Dual-Party Timestamp Verification Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>Dual-Confirmation Chain of Custody</span>
            <div className="h-px bg-slate-200 flex-1" />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Step 1: Donor Intake */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Step 1: Donor WhatsApp Offer
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">{cert.donor?.name}</h4>
              <div className="space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cert.donor?.phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cert.donor?.address}</span>
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500">Immutable Server Timestamp:</span>
                <span className="font-mono font-bold text-slate-800">{formatTimestamp(cert.donor?.submittedAt)}</span>
              </div>
            </div>

            {/* Step 2: NGO Shelter Acceptance */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Step 2: NGO Shelter Acceptance
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">{cert.recipient?.name}</h4>
              <div className="space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>NITI Aayog DARPAN: {cert.recipient?.darpanId}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>FSSAI License: {cert.recipient?.fssaiLicense}</span>
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500">Accepted By & Timestamp:</span>
                <span className="font-mono font-bold text-slate-800">{formatTimestamp(cert.recipient?.acceptedAt)}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Rescued Food Specifics */}
        <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3 text-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Rescued Food & Packaging Declaration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Items / Quantities</span>
              <p className="font-bold text-slate-800 text-sm">{cert.donation?.description}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Classification</span>
              <p className="font-semibold text-slate-800">{cert.donation?.category}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Safe Handling Audit</span>
              <p className="font-semibold text-emerald-700">{cert.donation?.hygieneStandard}</p>
            </div>
          </div>
        </div>

        {/* Cryptographic Seal & Live QR Code */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800">
              Live Digital Verification
            </span>
            <h4 className="text-base font-bold text-white">
              Scan to Verify Directly from Database
            </h4>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              Anyone, including regulatory food safety officers or legal counsel, can scan this code to fetch the live, unedited server record from the database.
            </p>
            <div className="pt-2 text-[10px] font-mono text-slate-400 break-all">
              <span className="text-sky-300 font-bold">SHA-256 HASH:</span> {cert.security?.tamperProofHash}
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl shrink-0 shadow-md text-center">
            <QRCodeSVG
              value={cert.security?.verificationUrl || window.location.href}
              size={120}
              level="H"
              includeMargin={false}
            />
            <span className="block mt-1 text-[9px] font-bold text-slate-700 uppercase tracking-tighter">
              Verified Authenticity
            </span>
          </div>
        </div>

        {/* Official Footer */}
        <div className="border-t border-slate-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            Surplus-to-Shelter AI Platform • In compliance with FSSAI (Recovery and Distribution of Surplus Food) Regulations, 2019.
          </div>
          <div className="font-mono text-slate-400 text-[10px]">
            Issued: {formatTimestamp(cert.issuedAt)}
          </div>
        </div>

      </div>

    </div>
  );
}
