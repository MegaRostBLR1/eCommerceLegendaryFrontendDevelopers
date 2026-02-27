import { jwtDecode } from 'jwt-decode';

const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

interface IUserToken {
  status: string;
  token: string;
  exp: number;
}

interface IDecodedUserToken {
  exp: number;
  role: string;
}

export const authorizationService = {
  decodeToken(token: string): IDecodedUserToken {
    return jwtDecode(token);
  },

  setUserInLocalStorage(json: IUserToken): void {
    localStorage.setItem('token', `${json.token}`);
  },

  logoutUser(): void {
    localStorage.removeItem('token');
  },

  isAuthUser(): boolean {
    const userToken: string | null = localStorage.getItem('token');

    if (!userToken) {
      return false;
    }
    const user: IDecodedUserToken = this.decodeToken(userToken);

    return user.exp * 1000 >= Date.now();
  },

  userIsAdmin(): boolean {
    const userToken: string | null = localStorage.getItem('token');

    if (!this.isAuthUser() || !userToken) {
      return false;
    }
    const user: IDecodedUserToken = this.decodeToken(userToken);
    const userRole: string = user.role;

    return userRole === UserRole.ADMIN;
  },
};