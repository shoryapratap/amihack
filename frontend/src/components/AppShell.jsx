import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  LayoutGrid,
  CalendarDays,
  Truck,
  Building2,
  FileCheck,
  CircleHelp,
  Flag,
  Search,
  Bell,
  Settings,
  X,
  MapPin
} from 'lucide-react';

export default function AppShell({ children }) {
  const { user, switchRole, availableRoles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Overview' },
    { to: '/ngo/dashboard', icon: CalendarDays, label: 'Schedule' },
    { to: '/ngo/restaurants', icon: MapPin, label: 'Nearby Restaurants' },
    { to: '/driver/dashboard', icon: Truck, label: 'Dispatch' },
    { to: '/admin/dashboard', icon: Building2, label: 'Operations' },
    { to: '/verify/CERT-2026-001', icon: FileCheck, label: 'Audit Log' },
  ];

  const getPageHeading = () => {
    if (location.pathname === '/ngo/restaurants') return 'Nearby Restaurants';
    if (location.pathname.startsWith('/ngo')) return 'Schedule';
    if (location.pathname.startsWith('/driver')) return 'Dispatch';
    if (location.pathname.startsWith('/admin')) return 'Operations';
    if (location.pathname.startsWith('/verify')) return 'Audit Record';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen w-full flex">
      
      {/* ======================================================== */}
      {/* LEFT VERTICAL NAVBAR */}
      {/* ======================================================== */}
      <aside className="w-20 sm:w-24 shrink-0 flex flex-col items-center justify-between py-6 sm:py-8 sticky top-0 h-screen z-30 select-none">
        
        {/* Top Brand Circle */}
        <button
          onClick={() => navigate('/ngo/dashboard')}
          className="w-11 h-11 rounded-full bg-white/90 hover:bg-white border border-white shadow-sm flex items-center justify-center transition-transform hover:scale-105"
        >
          <Heart className="w-5 h-5 text-sky-500 fill-sky-400" />
        </button>

        {/* Central Vertical Pill Dock */}
        <div className="p-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-sm flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-[#151c2e] text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-800 hover:bg-white/80'
                  }`
                }
                title={item.label}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Utility Icons */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="w-11 h-11 rounded-full bg-white/80 hover:bg-white border border-white shadow-sm text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
            title="Help"
          >
            <CircleHelp className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="w-11 h-11 rounded-full bg-white/80 hover:bg-white border border-white shadow-sm text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
            title="Report"
          >
            <Flag className="w-5 h-5" />
          </button>
        </div>

      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 pr-4 sm:pr-8 py-6 sm:py-8 pl-1 sm:pl-3">
        
        {/* TOP HEADER BAR */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          
          {/* Left: Clean Heading (e.g. "Schedule") */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {getPageHeading()}
            </h1>
          </div>

          {/* Center: Search Pill */}
          <div className="relative flex-1 max-w-xl mx-auto sm:mx-0">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/85 backdrop-blur-md border border-white/80 shadow-sm text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition"
              />
            </div>
          </div>

          {/* Right: Notifications, Settings, and User Avatar */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 p-1.5 pl-3 rounded-full bg-white/85 backdrop-blur-md border border-white/80 shadow-sm">
              
              <button
                className="relative text-slate-500 hover:text-slate-800 p-2 transition rounded-full hover:bg-slate-100"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
              </button>

              <button
                className="text-slate-500 hover:text-slate-800 p-2 transition rounded-full hover:bg-slate-100"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* User Avatar + Account Menu */}
              <div className="relative pl-1">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 p-0.5 rounded-full hover:opacity-90 transition"
                >
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl p-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                      <p className="text-[11px] text-slate-400">{user?.role}</p>
                    </div>
                    <div className="pt-2">
                      <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Switch Account
                      </p>
                      {Object.keys(availableRoles || {}).map((roleKey) => (
                        <button
                          key={roleKey}
                          onClick={() => {
                            switchRole(roleKey);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                            user?.role === roleKey
                              ? 'bg-slate-100 text-slate-900 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{roleKey}</span>
                          {user?.role === roleKey && (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 w-full">
          {children}
        </main>

      </div>

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Help & Guidelines</h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use the schedule board to review and coordinate surplus food distributions. Select partner columns and categories on the left to filter the view.
            </p>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#151c2e] hover:bg-slate-800 text-white font-medium text-xs transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
