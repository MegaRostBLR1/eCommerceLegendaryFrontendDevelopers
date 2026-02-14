import { User } from '@prisma/client';

export type UserResponse = Omit<User, 'date' | 'visible' | 'password'>;
