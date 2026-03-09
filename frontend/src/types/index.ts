export type Category = {
  id: number;
  name: string;
  description?: string;
};

export type Service = {
  id: number;
  name: string;
  discount?: number;
  amount: number;
  workersCount: number;
  duration: string;
  description: string;
  categories: Category[];
};

export type ServicesData = {
  page: number;
  count: number;
  pages: number;
  data?: Service[];
};

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  role: UserRole;
}

export type UpdateUserDto = Omit<User, 'id' | 'role'> & {
  id?: number;
  role?: UserRole;
};