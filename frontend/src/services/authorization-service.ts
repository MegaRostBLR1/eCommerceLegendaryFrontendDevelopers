import { jwtDecode } from 'jwt-decode';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

interface IUserToken {
  status: string;
  token: string;
  exp: number;
}

interface IDecodedUserToken {
  id: number;
  exp: number;
  role: UserRole;
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
    const userToken = localStorage.getItem('token');
    if (!userToken) return false;

    try {
      const user = this.decodeToken(userToken);
      return user && user.exp * 1000 >= Date.now();
    } catch {
      return false;
    }
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

  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded: IDecodedUserToken = this.decodeToken(token);
      return decoded.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
