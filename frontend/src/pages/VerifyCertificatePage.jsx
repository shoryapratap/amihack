import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function VerifyCertificatePage() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const data = await api.verifyCertificate(id);
        setCert(data);
      } catch (err) {
        setError('Certificate record not found or invalid.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCert();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="text-xl font-bold text-white">Surplus-to-Shelter</div>
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold">
            OFFICIAL FSSAI 2019 AUDIT RECORD
          </div>
        </div>

        {loading && <div className="text-center py-12 text-slate-400">Verifying tamper-resistant record...</div>}

        {error && (
          <div className="text-center py-12 space-y-4">
            <div className="text-rose-400 text-lg font-semibold">{error}</div>
            <Link to="/" className="inline-block text-emerald-400 hover:underline">Return to Home</Link>
          </div>
        )}

        {cert && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
              <div>
                <h3 className="font-semibold text-emerald-300">Dual-Party Authenticated Donation</h3>
                <p className="text-xs text-slate-400 mt-1">Verified against immutable server timestamps from both donor intake and recipient NGO acceptance.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Certificate ID</span>
                <span className="font-mono text-slate-200">{cert.id || id}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Legal Regulation</span>
                <span className="text-slate-200">FSSAI 2019 Clause 3(1)</span>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link to="/" className="text-sm text-slate-400 hover:text-white transition">← Return to Surplus-to-Shelter</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
