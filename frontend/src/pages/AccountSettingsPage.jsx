import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  Bell,
  Shield,
  Key,
  CheckCircle2,
  Save,
  LogOut,
  Truck,
  Mail,
  Phone,
  MapPin,
  FileCheck
} from 'lucide-react';

export default function AccountSettingsPage() {
  const { user, updateProfile, switchRole, availableRoles, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('general');
  const [savedToast, setSavedToast] = useState(false);

  // Form states initialized with current user
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 95212 73011',
    organization: user?.organization || '',
    address: user?.address || 'Civil Lines, Jaipur, Rajasthan',
    fssaiNumber: user?.fssaiNumber || '10020011000142',
    darpanId: user?.darpanId || 'RJ/2026/004819',
    capacityMeals: user?.capacityMeals || '250 Meals/Day',
    vehicleType: user?.vehicleType || 'Refrigerated Van',
    vehicleNumber: user?.vehicleNumber || 'RJ-14-GA-9081',
  });

  // Notification toggles
  const [notifications, setNotifications] = useState({
    whatsappSurplusAlerts: true,
    emailDailyDigest: true,
    driverDispatchUpdates: true,
    certificateGeneration: true,
    soundAlerts: false,
  });

  // Password state
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'general', label: 'General Profile', icon: User },
    { id: 'organization', label: 'Organization & Compliance', icon: Building2 },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#151c2e] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Account preferences updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Account Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your account identity, operational credentials, and alert preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Tabs + Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Nav Pills */}
        <div className="md:col-span-4 space-y-2">
          <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-3 shadow-sm space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#151c2e] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Persona Switcher in Settings */}
          <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-5 shadow-sm space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Quick Role Switch (Dev)
            </span>
            <div className="space-y-1.5">
              {Object.keys(availableRoles || {}).map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => switchRole(roleKey)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    user?.role === roleKey
                      ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  <span>{roleKey}</span>
                  {user?.role === roleKey && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Settings Form Panel */}
        <div className="md:col-span-8">
          <form onSubmit={handleSave} className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* TAB 1: General Profile */}
            {activeTab === 'general' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                  <p className="text-xs text-slate-400">Update how your contact name appears across rescue manifests.</p>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80'}
                    alt="Profile Avatar"
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-800">{formData.name}</div>
                    <div className="text-xs text-slate-500">{user?.role} Portal Account</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Full Display Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Contact Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700 block">Account Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700 block">Physical Location / Dispatch Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Organization & Compliance */}
            {activeTab === 'organization' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Organization & Compliance</h3>
                  <p className="text-xs text-slate-400">Legal registration details and FSSAI statutory credentials.</p>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700 block">Organization Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">FSSAI Registration No</label>
                    <input
                      type="text"
                      name="fssaiNumber"
                      value={formData.fssaiNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">NGO Darpan Registration</label>
                    <input
                      type="text"
                      name="darpanId"
                      value={formData.darpanId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono shadow-sm"
                    />
                  </div>
                </div>

                {user?.role === 'DRIVER' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Vehicle Type</label>
                      <input
                        type="text"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Vehicle Plate Number</label>
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono shadow-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-xs pt-2">
                    <label className="font-bold text-slate-700 block">Daily Food Handling Capacity</label>
                    <input
                      type="text"
                      name="capacityMeals"
                      value={formData.capacityMeals}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Notifications & Dispatch Alerts</h3>
                  <p className="text-xs text-slate-400">Choose how and when you receive urgent surplus food alerts.</p>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">WhatsApp Surplus Alert</div>
                      <p className="text-slate-400 text-[11px]">Instant WhatsApp ping when a nearby restaurant confirms surplus.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.whatsappSurplusAlerts}
                      onChange={() => handleToggle('whatsappSurplusAlerts')}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400"
                    />
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Driver Dispatch Updates</div>
                      <p className="text-slate-400 text-[11px]">Receive notification when volunteer driver marks cargo in transit.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.driverDispatchUpdates}
                      onChange={() => handleToggle('driverDispatchUpdates')}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400"
                    />
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Audit Certificate Issuance</div>
                      <p className="text-slate-400 text-[11px]">Notify when Section 24 digital certificate is signed and sealed.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.certificateGeneration}
                      onChange={() => handleToggle('certificateGeneration')}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400"
                    />
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Daily Digest Email</div>
                      <p className="text-slate-400 text-[11px]">Receive end-of-day summary of total rescued meals and safe transfers.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailDailyDigest}
                      onChange={() => handleToggle('emailDailyDigest')}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Security */}
            {activeTab === 'security' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Security & Access</h3>
                  <p className="text-xs text-slate-400">Change your portal login password and review active sessions.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Current Password</label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">New Password</label>
                      <input
                        type="password"
                        value={passwords.newPass}
                        onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800">Active Session</div>
                    <div className="text-slate-400 text-[11px]">Logged in via Chrome on Windows • Jaipur, India</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Current Device
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#151c2e] hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-transform active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
