import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <div className="space-y-3">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 block uppercase">Name</span>
            <span className="text-lg font-medium text-slate-200">{user?.name || 'User'}</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 block uppercase">Email</span>
            <span className="text-lg font-medium text-slate-200">{user?.email || 'N/A'}</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 block uppercase">Role</span>
            <span className="text-emerald-400 font-semibold">{user?.role || 'GUEST'}</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="px-6 py-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30 font-semibold transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
