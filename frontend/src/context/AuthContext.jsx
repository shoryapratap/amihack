import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const DEFAULT_ROLES = {
  ADMIN: {
    id: 'user-admin-1',
    name: 'Admin Coordinator',
    email: 'admin@surplus.org',
    phone: '+91 98765 43210',
    role: 'ADMIN',
    organization: 'Surplus-to-Shelter Central Command',
    address: 'Secretariat Road, C-Scheme, Jaipur',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    joinedDate: 'January 2026',
    stats: { primary: '42 Shelters', secondary: '318 Audits', tertiary: '100% Uptime' }
  },
  NGO: {
    id: 'user-ngo-1',
    name: 'Darlene Robertson',
    email: 'contact@greenfuture.org',
    phone: '+91 95212 73011',
    role: 'NGO',
    organization: 'Green Future Foundation Shelter',
    address: 'Plot 18, Gandhi Path, Civil Lines, Jaipur',
    darpanId: 'RJ/2026/004819',
    fssaiNumber: '10020011000142',
    capacityMeals: '250 Meals/Day',
    dietaryType: 'Vegetarian & Cooked Food',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    joinedDate: 'March 2026',
    stats: { primary: '14,820 Meals', secondary: '18 Donors', tertiary: 'FSSAI Verified' }
  },
  DRIVER: {
    id: 'user-driver-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.driver@surplus.org',
    phone: '+91 98290 12345',
    role: 'DRIVER',
    organization: 'Surplus Volunteer Logistics Corps',
    address: 'Mansarovar Metro Corridor, Jaipur',
    vehicleType: 'Refrigerated Van',
    vehicleNumber: 'RJ-14-GA-9081',
    temperatureSupport: '-4°C to +65°C Insulated',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    joinedDate: 'April 2026',
    stats: { primary: '195 Rescues', secondary: '64 Hours', tertiary: 'Safe Warm/Cold Hold' }
  },
};

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  // Load saved user from localStorage with safe fallback to DEFAULT_ROLES.NGO
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sts_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return DEFAULT_ROLES.NGO;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const auth = localStorage.getItem('sts_auth');
      if (auth !== null) return auth === 'true';
    } catch {}
    return false;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('sts_user', JSON.stringify(user));
      }
      localStorage.setItem('sts_auth', isAuthenticated ? 'true' : 'false');
    } catch {}
  }, [user, isAuthenticated]);

  const switchRole = (roleKey) => {
    const targetRole = DEFAULT_ROLES[roleKey.toUpperCase()];
    if (targetRole) {
      setUser(targetRole);
      setIsAuthenticated(true);
    }
  };

  const login = async (email, password, role = 'NGO') => {
    const roleKey = (role || 'NGO').toUpperCase();
    const baseMeta = DEFAULT_ROLES[roleKey] || DEFAULT_ROLES.NGO;

    try {
      const response = await api.login({
        email: email.trim(),
        password: password,
        two_step: false
      });

      if (response && response.accessToken) {
        api.setToken(response.accessToken);
        const dbUser = response.user;
        const mergedUser = {
          ...baseMeta,
          ...dbUser,
          role: dbUser.role || roleKey,
          email: dbUser.email || email,
          name: dbUser.name || baseMeta.name,
          phone: dbUser.phone || baseMeta.phone,
        };
        setUser(mergedUser);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('sts_user', JSON.stringify(mergedUser));
        return { success: true, user: mergedUser, token: response.accessToken };
      }
    } catch (err) {
      console.warn('Backend login fallback notice:', err);
      // Fallback for development if offline
      const loggedInUser = {
        ...baseMeta,
        email: email || baseMeta.email,
      };
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return { success: true, user: loggedInUser };
    }
  };

  const signup = async (userData) => {
    const roleKey = (userData.role || 'NGO').toUpperCase();
    const baseMeta = DEFAULT_ROLES[roleKey] || DEFAULT_ROLES.NGO;

    try {
      const response = await api.signup({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '+919829407512',
        role: roleKey,
        organization_name: userData.organizationName || userData.organization,
        darpan_id: userData.darpanId,
        fssai_number: userData.fssaiNumber,
        address: userData.address
      });

      if (response && response.accessToken) {
        api.setToken(response.accessToken);
        const dbUser = response.user;
        const mergedUser = {
          ...baseMeta,
          ...dbUser,
          role: dbUser.role || roleKey,
        };
        setUser(mergedUser);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('sts_user', JSON.stringify(mergedUser));
        return { success: true, user: mergedUser, token: response.accessToken };
      }
    } catch (err) {
      console.warn('Backend signup fallback notice:', err);
      const newUser = {
        ...baseMeta,
        id: `user-${Date.now()}`,
        name: userData.name || baseMeta.name,
        email: userData.email || baseMeta.email,
        phone: userData.phone || baseMeta.phone,
        role: roleKey,
      };
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
    }
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  const logout = () => {
    api.setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('sts_user');
    localStorage.setItem('sts_auth', 'false');
    setUser(DEFAULT_ROLES.NGO);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        availableRoles: DEFAULT_ROLES,
        login,
        signup,
        updateProfile,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
