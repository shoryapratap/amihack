import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // Try loading saved user from localStorage, fallback to NGO
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sts_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ROLES.NGO;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('sts_auth') !== 'false';
    } catch {}
    return true;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('sts_user', JSON.stringify(user));
        localStorage.setItem('sts_auth', 'true');
      } else {
        localStorage.removeItem('sts_user');
        localStorage.setItem('sts_auth', 'false');
      }
    } catch {}
  }, [user]);

  const switchRole = (roleKey) => {
    const targetRole = DEFAULT_ROLES[roleKey.toUpperCase()];
    if (targetRole) {
      setUser(targetRole);
      setIsAuthenticated(true);
    }
  };

  const login = async (email, password, role = 'NGO') => {
    const roleKey = (role || 'NGO').toUpperCase();
    const baseUser = DEFAULT_ROLES[roleKey] || DEFAULT_ROLES.NGO;
    
    const loggedInUser = {
      ...baseUser,
      email: email || baseUser.email,
    };

    setUser(loggedInUser);
    setIsAuthenticated(true);
    return { user: loggedInUser };
  };

  const signup = async (userData) => {
    const roleKey = (userData.role || 'NGO').toUpperCase();
    const baseUser = DEFAULT_ROLES[roleKey] || DEFAULT_ROLES.NGO;

    const newUser = {
      ...baseUser,
      id: `user-${Date.now()}`,
      name: userData.name || baseUser.name,
      email: userData.email || baseUser.email,
      phone: userData.phone || baseUser.phone,
      organization: userData.organizationName || userData.organization || baseUser.organization,
      fssaiNumber: userData.fssaiNumber || baseUser.fssaiNumber,
      darpanId: userData.darpanId || baseUser.darpanId,
      vehicleType: userData.vehicleType || baseUser.vehicleType,
      vehicleNumber: userData.vehicleNumber || baseUser.vehicleNumber,
      role: roleKey,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    return { user: newUser };
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
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
