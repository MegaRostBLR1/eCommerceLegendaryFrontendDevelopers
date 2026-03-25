import { createContext } from 'react';

export interface AuthContextType {
  isAuth: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  updateAuth: () => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
