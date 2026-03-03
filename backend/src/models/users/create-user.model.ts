import { User } from '@prisma/client';
import { UserRole } from '../../enums/user-role.enum';

export type CreateUser = Pick<User, 'email' | 'password' | 'firstName' | 'lastName' | 'patronymic'> & {
    role?: UserRole;
};
