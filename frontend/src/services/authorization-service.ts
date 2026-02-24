import { jwtDecode } from 'jwt-decode';

interface UserToken {
  exp: number;
  role: string;
}

export const isAuthUser = () => {
  const userToken: string | null = localStorage.getItem('token');
  if (userToken) {
    const user = jwtDecode(userToken);
    const userExp: number = user.exp as number;
    return userExp >= Math.floor(Date.now() / 1000);
  }
  return false;
};

export const userIsAdmin = () => {
  const userToken: string | null = localStorage.getItem('token');
  if (isAuthUser()) {
    if (userToken){
      const user = jwtDecode<UserToken>(userToken);
      const userRole = user.role;
      return userRole === "admin";
    }
  }
  return false;
};
