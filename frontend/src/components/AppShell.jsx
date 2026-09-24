import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
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
  MapPin,
  User,
  LogOut,
  CheckCircle2,
  Check,
  Trash2
} from 'lucide-react';

export default function AppShell({ children }) {
  const { user, switchRole, availableRoles, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Notification Feed State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New Surplus Donation Ready',
      desc: 'The Grand Palace Banquet reported 80 hot cooked meals available for pickup.',
      time: '5m ago',
      read: false,
      link: '/ngo/restaurants',
      type: 'donation'
    },
    {
      id: 'notif-2',
      title: 'Volunteer Driver Assigned',
      desc: 'Refrigerated Van MH-12-AB-1234 assigned for pickup PK-901.',
      time: '25m ago',
      read: false,
      link: '/driver/dashboard',
      type: 'dispatch'
    },
    {
      id: 'notif-3',
      title: 'Audit Record Certified',
      desc: 'Certificate CERT-2026-092 confirmed under Section 24 FSSAI.',
      time: '1h ago',
      read: false,
      link: '/verify/CERT-2026-001',
      type: 'certificate'
    },
    {
      id: 'notif-4',
      title: 'Nearby Partner Outreach',
      desc: 'WhatsApp outreach delivered to Haldiram Sweets & Dining.',
      time: '3h ago',
      read: true,
      link: '/ngo/restaurants',
      type: 'outreach'
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setShowNotifications(false);
    if (notif.link) navigate(notif.link);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    logout();
    setShowRoleMenu(false);
    navigate('/login');
  };

  // If on Login or Signup page, render clean auth wrapper without sidebar
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Overview' },
    { to: '/ngo/dashboard', icon: CalendarDays, label: 'Schedule' },
    { to: '/ngo/restaurants', icon: MapPin, label: 'Nearby Restaurants' },
    { to: '/driver/dashboard', icon: Truck, label: 'Dispatch' },
    { to: '/admin/dashboard', icon: Building2, label: 'Operations' },
    { to: '/verify/CERT-2026-001', icon: FileCheck, label: 'Audit Log' },
  ];

  const getPageHeading = () => {
    if (location.pathname === '/profile') return 'User Profile';
    if (location.pathname === '/settings') return 'Account Settings';
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
          className="w-11 h-11 rounded-full bg-white/90 hover:bg-white border border-white shadow-sm flex items-center justify-center transition-transform hover:scale-105 overflow-hidden p-1.5"
          title="Surplus-to-Shelter"
        >
          <img
            src="/SSLOGO.png"
            alt="Surplus-to-Shelter Logo"
            className="w-full h-full object-contain"
          />
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
            onClick={() => navigate('/settings')}
            className="w-11 h-11 rounded-full bg-white/80 hover:bg-white border border-white shadow-sm text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
            title="Account Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 pr-4 sm:pr-8 py-6 sm:py-8 pl-1 sm:pl-3 relative z-10">
        
        {/* TOP HEADER BAR */}
        <header
          className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8"
          style={{ zIndex: 100 }}
        >
          
          {/* Left: Clean Heading (e.g. "Schedule", "User Profile") */}
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
                placeholder="Search surplus donations, shelters, drivers..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/85 backdrop-blur-md border border-white/80 shadow-sm text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition"
              />
            </div>
          </div>

          {/* Right: Notifications, Settings, and User Avatar */}
          <div
            className="flex items-center gap-3 self-end sm:self-auto relative"
            style={{ zIndex: 100 }}
          >
            {/* Click-outside backdrop for active dropdowns */}
            {(showNotifications || showRoleMenu) && (
              <div
                className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] transition-opacity"
                style={{ zIndex: 90 }}
                onClick={() => {
                  setShowNotifications(false);
                  setShowRoleMenu(false);
                }}
              />
            )}

            <div
              className="flex items-center gap-1.5 p-1.5 pl-3 rounded-full bg-white/95 backdrop-blur-md border border-white/90 shadow-sm relative"
              style={{ zIndex: 100 }}
            >
              
              {/* Notification Bell Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowRoleMenu(false);
                  }}
                  className={`relative p-2 transition rounded-full hover:bg-slate-100 ${
                    showNotifications ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
                  )}
                </button>

                {/* Notifications Floating Popover */}
                {showNotifications && (
                  <div
                    className="absolute right-0 mt-3 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] p-4 space-y-3"
                    style={{ zIndex: 110 }}
                  >
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px]">
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-sky-600 hover:underline font-semibold"
                          >
                            Mark read
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            type="button"
                            onClick={clearNotifications}
                            className="text-slate-400 hover:text-slate-600 p-1"
                            title="Clear all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notification List */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No notifications right now
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3 rounded-2xl border transition cursor-pointer select-none text-xs space-y-1 ${
                              n.read
                                ? 'bg-slate-50/70 border-slate-100/90 text-slate-600 hover:bg-slate-100/80'
                                : 'bg-sky-50/60 border-sky-100 text-slate-800 font-medium hover:bg-sky-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 truncate pr-2">
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                                {n.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {n.desc}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 text-center">
                      <Link
                        to="/ngo/dashboard"
                        onClick={() => setShowNotifications(false)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                      >
                        View food rescue schedule →
                      </Link>
                    </div>

                  </div>
                )}
              </div>

              {/* Settings Button */}
              <button
                type="button"
                onClick={() => {
                  navigate('/settings');
                  setShowNotifications(false);
                  setShowRoleMenu(false);
                }}
                className="text-slate-500 hover:text-slate-800 p-2 transition rounded-full hover:bg-slate-100"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* User Avatar + Account Menu */}
              <div className="relative pl-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleMenu(!showRoleMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-0.5 rounded-full hover:opacity-90 transition"
                  title="Account Menu"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'}
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                </button>

                {showRoleMenu && (
                  <div
                    className="absolute right-0 mt-3 w-60 max-w-[calc(100vw-2rem)] rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] p-3 space-y-2"
                    style={{ zIndex: 110 }}
                  >
                    
                    {/* User Identity Header */}
                    <div className="px-3 py-2 border-b border-slate-100 space-y-0.5">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Active User'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email || 'user@surplus.org'}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {user?.role} Portal
                      </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-1 text-xs font-semibold">
                      <Link
                        to="/profile"
                        onClick={() => setShowRoleMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>View Profile</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setShowRoleMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Account Settings</span>
                      </Link>
                    </div>

                    {/* Switch Persona */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Switch Active Role
                      </p>
                      {Object.keys(availableRoles || {}).map((roleKey) => (
                        <button
                          key={roleKey}
                          type="button"
                          onClick={() => {
                            switchRole(roleKey);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                            user?.role === roleKey
                              ? 'bg-sky-50 text-sky-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{roleKey} Portal</span>
                          {user?.role === roleKey && (
                            <Check className="w-3.5 h-3.5 text-sky-600 stroke-[3]" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Auth Actions */}
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <Link
                        to="/login"
                        onClick={() => setShowRoleMenu(false)}
                        className="block px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition"
                      >
                        Sign in with another account
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>

        </header>

        {/* Page Content */}
        <main
          className="flex-1 w-full relative"
          style={{ zIndex: 1 }}
        >
          {children}
        </main>

      </div>

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Help & Guidelines</h3>
              <button
                type="button"
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
              type="button"
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
