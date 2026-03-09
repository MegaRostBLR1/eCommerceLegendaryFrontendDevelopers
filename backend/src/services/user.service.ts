import { dbService } from './db/db.service';
import { UserResponse } from '../models/users/user-response.model';
import { CreateUser } from '../models/users/create-user.model';
import { UpdateUser } from '../models/users/update-user.model';
import { hashEssence } from './authorization.service';
import { UsersResponse } from '../models/users/users-many-response.model';
import { PageCountQuery } from '../models/query/user-query.model';
import { USER_SELECT } from './db/constants/user.select';
import { Prisma } from '@prisma/client';

export const userService = {
    getCandidate: async (email: string, visible?: boolean, select?: Prisma.UserSelect): Promise<UserResponse | null> => {
        return await dbService.getUserByEmail(email, visible, select || USER_SELECT);
    },

    getUserById: async (id: number): Promise<UserResponse | null> => {
        return await dbService.getUserById(id);
    },
    getAllUsers: async ({ page: p, count: c }: PageCountQuery): Promise<UsersResponse> => {
        const page = p ? Number(p) : 1;
        const count = c ? Number(c) : 10;
        const usersCount = await dbService.usersCount();

        return {
            page,
            count,
            pages: Math.ceil(usersCount / count),
            data: await dbService.allUsers(page, count),
        };
    },
    createUser: async (dto: CreateUser): Promise<UserResponse> => {
        const { password, ...data } = dto;

        return await dbService.createUser({
            ...data,
            password: await hashEssence(password),
        });
    },
    updateUser: async (id: number, dto: UpdateUser): Promise<UserResponse> => {
        return await dbService.updateUser(id, dto);
    },
    removeUser: async (id: number): Promise<UserResponse> => {
        return await userService.updateUser(id, { visible: false });
    },
};
