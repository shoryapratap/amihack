import React, { createContext, useContext, useState } from 'react';

const ROLES = {
  ADMIN: {
    id: 'user-admin-1',
    name: 'Admin Coordinator',
    email: 'admin@surplus.org',
    role: 'ADMIN',
  },
  NGO: {
    id: 'user-ngo-1',
    name: 'Green Future Foundation',
    email: 'contact@greenfuture.org',
    role: 'NGO',
    darpanId: 'DL/2026/000001',
    fssaiNumber: '10000000000001',
  },
  DRIVER: {
    id: 'user-driver-1',
    name: 'Rajesh Kumar (Volunteer Driver)',
    email: 'rajesh.driver@surplus.org',
    role: 'DRIVER',
    vehicle: 'Refrigerated Van (MH-12-AB-1234)',
  },
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default to ADMIN so all views and permissions are available immediately without login
  const [user, setUser] = useState(ROLES.ADMIN);
  const [loading] = useState(false);

  const switchRole = (roleKey) => {
    if (ROLES[roleKey]) {
      setUser(ROLES[roleKey]);
    }
  };

  const login = async () => {
    return { user };
  };

  const logout = () => {
    // Keep user active or switch to demo NGO
    setUser(ROLES.NGO);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        availableRoles: ROLES,
        login,
        logout,
        loading,
        isAuthenticated: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

