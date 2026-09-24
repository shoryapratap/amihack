import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Truck, ShieldCheck, Heart, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') || 'NGO').toUpperCase();
  
  const [selectedRole, setSelectedRole] = useState(
    ['NGO', 'DRIVER', 'ADMIN'].includes(initialRole) ? initialRole : 'NGO'
  );
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const roleMeta = {
    NGO: {
      title: 'NGO & Shelter Portal',
      desc: 'Review surplus matches, manage shelter inventory, and claim donations.',
      icon: Building2,
      demoEmail: 'contact@greenfuture.org',
      demoPassword: 'NgoPassword@123',
      defaultPath: '/ngo/dashboard',
      color: 'text-sky-600',
      activeBg: 'bg-sky-50 border-sky-300 text-sky-900',
    },
    DRIVER: {
      title: 'Volunteer Driver Dispatch',
      desc: 'Access refrigerated route manifests, safe hold logs, and pickup orders.',
      icon: Truck,
      demoEmail: 'rajesh.driver@surplus.org',
      demoPassword: 'DriverPassword@123',
      defaultPath: '/driver/dashboard',
      color: 'text-amber-600',
      activeBg: 'bg-amber-50 border-amber-300 text-amber-900',
    },
    ADMIN: {
      title: 'Central Command & Audit',
      desc: 'Monitor donor trust records, FSSAI Section 24 compliance, and telemetry.',
      icon: ShieldCheck,
      demoEmail: 'admin@surplus.org',
      demoPassword: 'AdminPassword@123',
      defaultPath: '/admin/dashboard',
      color: 'text-indigo-600',
      activeBg: 'bg-indigo-50 border-indigo-300 text-indigo-900',
    },
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setError('');
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const meta = roleMeta[selectedRole];
      await login(meta.demoEmail, meta.demoPassword, selectedRole);
      navigate(meta.defaultPath);
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const meta = roleMeta[selectedRole];
      const targetEmail = email.trim() || meta.demoEmail;
      const targetPassword = password.trim() || meta.demoPassword;
      await login(targetEmail, targetPassword, selectedRole);
      navigate(meta.defaultPath);
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const ActiveIcon = roleMeta[selectedRole].icon;

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center relative">
      
      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between text-xs">
        <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold transition">
          <span>← Back to Overview</span>
        </Link>
        <span className="text-slate-400 font-medium">Surplus-to-Shelter Portal</span>
      </div>

      <div className="w-full max-w-md rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-6 h-6 text-sky-500 fill-sky-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Choose your organization role to access your dedicated food rescue dashboard.
          </p>
        </div>

        {/* 3-Role Segmented Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Select Account Role
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60">
            {Object.keys(roleMeta).map((roleKey) => {
              const r = roleMeta[roleKey];
              const Icon = r.icon;
              const isSelected = selectedRole === roleKey;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleRoleSelect(roleKey)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? r.color : 'text-slate-400'}`} />
                  <span>{roleKey === 'NGO' ? 'NGO' : roleKey === 'DRIVER' ? 'Driver' : 'Admin'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Context Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-100 flex items-start gap-3">
          <ActiveIcon className={`w-4 h-4 ${roleMeta[selectedRole].color} shrink-0 mt-0.5`} />
          <div className="text-xs">
            <div className="font-bold text-slate-800">{roleMeta[selectedRole].title}</div>
            <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
              {roleMeta[selectedRole].desc}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleMeta[selectedRole].demoEmail}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">
                Password
              </label>
              <button
                type="button"
                className="text-[11px] text-sky-600 hover:underline font-semibold"
                onClick={() => alert('Demo mode: Click "Quick Demo Sign In" below or enter any password.')}
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#151c2e] hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : `Sign In as ${selectedRole}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo 1-Click Access */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition"
          >
            Quick 1-Click Demo Sign In ({roleMeta[selectedRole].demoEmail})
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Need a new organization or driver account? </span>
          <Link
            to={`/signup?role=${selectedRole.toLowerCase()}`}
            className="font-bold text-sky-600 hover:underline"
          >
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}
