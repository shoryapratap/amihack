import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Truck, LayoutDashboard, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Navbar() {
  const { user, switchRole, availableRoles } = useAuth();

  const navItems = [
    { to: '/', label: 'Overview', icon: HeartHandshake },
    { to: '/ngo/dashboard', label: 'NGO Portal', icon: Building2 },
    { to: '/driver/dashboard', label: 'Driver Portal', icon: Truck },
    { to: '/admin/dashboard', label: 'Admin Hub', icon: LayoutDashboard },
    { to: '/verify/CERT-2026-001', label: 'Verify Cert', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight flex items-center gap-2">
              Surplus-to-Shelter
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Dev Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Zero-Barrier Direct Access</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Role Quick Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-inner">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">
            Role:
          </span>
          <div className="flex items-center gap-1">
            {Object.keys(availableRoles || {}).map((roleKey) => {
              const isSelected = user?.role === roleKey;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => switchRole(roleKey)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={`Switch active persona to ${roleKey}`}
                >
                  {roleKey}
                </button>
              );
            })}
          </div>
          <span className="h-4 w-px bg-slate-800 hidden sm:inline" />
          <span className="text-xs text-slate-300 font-medium truncate max-w-[120px] hidden sm:inline" title={user?.name}>
            {user?.name?.split(' ')[0]}
          </span>
        </div>

      </div>
    </header>
  );
}
