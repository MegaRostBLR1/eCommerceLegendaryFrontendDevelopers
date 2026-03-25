import React, { useState } from 'react';
import { authorizationService } from '../services/authorization-service';
import { AuthContext } from './AuthContextType';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState(() => authorizationService.isAuthUser());
  const [isAdmin, setIsAdmin] = useState(() =>
    authorizationService.userIsAdmin()
  );
  const [userEmail, setUserEmail] = useState(
    () => authorizationService.getUser()?.email || null
  );
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const updateAuth = () => {
    setIsAuth(authorizationService.isAuthUser());
    setIsAdmin(authorizationService.userIsAdmin());
    setUserEmail(authorizationService.getUser()?.email || null);
  };

  const logout = () => {
    authorizationService.logoutUser();
    updateAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        isAdmin,
        userEmail,
        updateAuth,
        logout,
        isLoginModalOpen,
        setLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
