import { dbService } from './db/db.service';
import { UserResponse } from '../models/users/user-response.model';
import { CreateUser } from '../models/users/create-user.model';
import { UpdateUser } from '../models/users/update-user.model';
import { hashEssence } from './authorization.service';
import { UsersQuery } from '../models/query/user-query.model';
import { UsersResponse } from '../models/users/users-many-response.model';

export const userService = {
    getCandidate: async (email: string, visible?: boolean): Promise<UserResponse | null> => {
        return await dbService.getUserByEmail(email, visible);
    },

    getUserById: async (id: number): Promise<UserResponse | null> => {
        return await dbService.getUserById(id);
    },
    getAllUsers: async ({ page: p, count: c }: UsersQuery): Promise<UsersResponse> => {
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
