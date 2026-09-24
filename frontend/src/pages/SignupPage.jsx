import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Truck, ShieldCheck, Heart, ArrowRight, User, Mail, Phone, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') || 'NGO').toUpperCase();

  const [role, setRole] = useState(
    ['NGO', 'DRIVER', 'ADMIN'].includes(initialRole) ? initialRole : 'NGO'
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // NGO specific
    organizationName: '',
    fssaiNumber: '',
    darpanId: '',
    address: '',
    capacityMeals: '150 Meals/Day',
    dietaryPreference: 'Both Veg & Non-Veg',
    // Driver specific
    vehicleType: 'Refrigerated Van',
    vehicleNumber: '',
    operatingZone: 'Jaipur Urban (Civil Lines & MI Road)',
    // Admin specific
    department: 'Surplus Quality & Compliance Board',
    adminPasskey: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const createdUser = await signup({
        ...formData,
        role,
      });

      setSuccess(true);
      setTimeout(() => {
        if (role === 'ADMIN') navigate('/admin/dashboard');
        else if (role === 'DRIVER') navigate('/driver/dashboard');
        else navigate('/ngo/dashboard');
      }, 1200);
    } catch (err) {
      setError(err?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center relative">
      
      {/* Top Navigation Link */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between text-xs">
        <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold transition">
          <span>← Back to Overview</span>
        </Link>
        <span className="text-slate-400 font-medium">Registration Portal</span>
      </div>

      <div className="w-full max-w-xl rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-6 sm:p-10 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-6 h-6 text-sky-500 fill-sky-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create an Account</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Join the Surplus-to-Shelter food rescue network. Choose your organization role below.
          </p>
        </div>

        {/* 3-Way Role Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Select Organization Type
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60">
            <button
              type="button"
              onClick={() => { setRole('NGO'); setError(''); }}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                role === 'NGO'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <Building2 className={`w-4 h-4 ${role === 'NGO' ? 'text-sky-600' : 'text-slate-400'}`} />
              <span>NGO Shelter</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('DRIVER'); setError(''); }}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                role === 'DRIVER'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <Truck className={`w-4 h-4 ${role === 'DRIVER' ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>Rescue Driver</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('ADMIN'); setError(''); }}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                role === 'ADMIN'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${role === 'ADMIN' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Coordinator</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Account created successfully! Launching your {role} portal...</span>
          </div>
        )}

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Basic Identity Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Contact Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Vikram Sharma"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98290 12345"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-slate-700 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@shelter.org"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 shadow-sm"
              />
            </div>
          </div>

          {/* Role-Specific Fields: NGO */}
          {role === 'NGO' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">NGO / Shelter Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="e.g. Anand Dham Seva Sansthan"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/50 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">FSSAI Registration No</label>
                  <input
                    type="text"
                    name="fssaiNumber"
                    value={formData.fssaiNumber}
                    onChange={handleChange}
                    placeholder="14-digit FSSAI ID"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">NGO Darpan Unique ID</label>
                  <input
                    type="text"
                    name="darpanId"
                    value={formData.darpanId}
                    onChange={handleChange}
                    placeholder="RJ/2026/001234"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">Shelter Physical Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Plot number, Street, Area, Jaipur"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Role-Specific Fields: Driver */}
          {role === 'DRIVER' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Vehicle Classification</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                  >
                    <option value="Refrigerated Van">Refrigerated Van (Cold/Hot)</option>
                    <option value="Covered Delivery Tempo">Covered Delivery Tempo</option>
                    <option value="Electric Cargo 3-Wheeler">Electric Cargo 3-Wheeler</option>
                    <option value="Insulated Bike Carrier">Insulated Bike Carrier</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Vehicle Registration Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="RJ-14-GA-1234"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">Primary Operating Zone</label>
                <input
                  type="text"
                  name="operatingZone"
                  value={formData.operatingZone}
                  onChange={handleChange}
                  placeholder="Jaipur City / Mansarovar / Civil Lines"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Role-Specific Fields: Admin */}
          {role === 'ADMIN' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">Department / Supervisory Authority</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Regional Food Safety & Rescue Directorate"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">Admin Security Token (Optional for Demo)</label>
                <input
                  type="password"
                  name="adminPasskey"
                  value={formData.adminPasskey}
                  onChange={handleChange}
                  placeholder="Leave empty for instant demo clearance"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#151c2e] hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Creating Account...' : `Register as ${role}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already registered? </span>
          <Link
            to={`/login?role=${role.toLowerCase()}`}
            className="font-bold text-sky-600 hover:underline"
          >
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
}
