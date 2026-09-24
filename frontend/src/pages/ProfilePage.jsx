import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Award,
  ArrowRight
} from 'lucide-react';

export default function ProfilePage() {
  const { user, switchRole, availableRoles, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleTitleMap = {
    NGO: 'NGO Shelter Coordinator',
    DRIVER: 'Volunteer Rescue Driver',
    ADMIN: 'System & Audit Administrator',
  };

  const roleColorMap = {
    NGO: 'bg-sky-50 text-sky-700 border-sky-200',
    DRIVER: 'bg-amber-50 text-amber-700 border-amber-200',
    ADMIN: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      
      {/* Top Profile Hero Card */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 sm:p-8 shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User Avatar'}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white shadow-md"
              />
              <span className="w-4 h-4 rounded-full bg-emerald-500 absolute bottom-1 right-1 ring-2 ring-white" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{user?.name || 'Active User'}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${roleColorMap[user?.role] || 'bg-slate-100 text-slate-700'}`}>
                  {roleTitleMap[user?.role] || user?.role}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.organization || 'Registered Entity'}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {user?.address?.split(',').slice(-2).join(',') || 'Jaipur, India'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {user?.joinedDate || '2026'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Link
              to="/settings"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-sm transition"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              {user?.role === 'NGO' ? 'Meals Rescued' : user?.role === 'DRIVER' ? 'Completed Runs' : 'Monitored Shelters'}
            </span>
            <div className="text-xl font-black text-slate-800 mt-0.5">
              {user?.stats?.primary || '14,820'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              {user?.role === 'NGO' ? 'Donors Connected' : user?.role === 'DRIVER' ? 'Logistics Hours' : 'Audit Records'}
            </span>
            <div className="text-xl font-black text-slate-800 mt-0.5">
              {user?.stats?.secondary || '18 Donors'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Regulatory Status
            </span>
            <div className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{user?.stats?.tertiary || 'FSSAI Compliant'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Cols: Credentials & Details */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Identity & Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user?.email}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user?.phone}
                </span>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Address</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {user?.address}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Compliance & Regulatory Credentials</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">FSSAI License / Registration</span>
                <span className="font-mono font-bold text-slate-800 text-sm">
                  {user?.fssaiNumber || '10020011000142'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">NGO Darpan Unique ID</span>
                <span className="font-mono font-bold text-slate-800 text-sm">
                  {user?.darpanId || 'RJ/2026/004819'}
                </span>
              </div>

              {user?.role === 'DRIVER' && (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Vehicle Specification</span>
                    <span className="font-bold text-slate-800">
                      {user?.vehicleType || 'Refrigerated Van'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">License Plate</span>
                    <span className="font-mono font-bold text-slate-800">
                      {user?.vehicleNumber || 'RJ-14-GA-9081'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Quick Actions & Switch Role */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Switch Active Role</h3>
              <p className="text-xs text-slate-400 mt-0.5">Test different persona views instantly.</p>
            </div>

            <div className="space-y-2">
              {Object.keys(availableRoles || {}).map((roleKey) => {
                const isSelected = user?.role === roleKey;
                return (
                  <button
                    key={roleKey}
                    onClick={() => switchRole(roleKey)}
                    className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-[#151c2e] text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    <span>{roleKey} Portal</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-5 shadow-sm space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Quick Shortcuts
            </span>
            <div className="space-y-1.5">
              <Link
                to="/settings"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold transition"
              >
                <span>Account Preferences</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                to={user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'DRIVER' ? '/driver/dashboard' : '/ngo/dashboard'}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold transition"
              >
                <span>Return to My Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
