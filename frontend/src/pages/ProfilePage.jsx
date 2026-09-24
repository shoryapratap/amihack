import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Mail, Building2, Key } from 'lucide-react';

export default function ProfilePage() {
  const { user, switchRole, availableRoles } = useAuth();

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Active Persona & Profile</h2>
          <p className="text-xs text-slate-400 mt-1">
            Development Mode: You can switch roles instantaneously without logging in.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
            <User className="w-5 h-5 text-slate-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Name</span>
              <span className="text-sm font-bold text-slate-800">{user?.name || 'Active User'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
            <Mail className="w-5 h-5 text-slate-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
              <span className="text-sm font-semibold text-slate-700">{user?.email || 'N/A'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-sky-500" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Role</span>
                <span className="text-sm font-bold text-sky-700">{user?.role}</span>
              </div>
            </div>

            <div className="flex gap-1.5">
              {Object.keys(availableRoles || {}).map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => switchRole(roleKey)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    user?.role === roleKey
                      ? 'bg-[#151c2e] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {roleKey}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
