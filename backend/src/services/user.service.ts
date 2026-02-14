import { dbService } from './db/db.service';
import { UserResponse } from '../models/users/user-response.model';
import { CreateUser } from '../models/users/create-user.model';
import { UpdateUser } from '../models/users/update-user.model';

export const userService = {
    getCandidate: async (email: string, visible?: boolean): Promise<UserResponse | null> => {
        return await dbService.getUserByEmail(email, visible);
    },

    getUserById: async (id: number): Promise<UserResponse | null> => {
        return await dbService.getUserById(id);
    },
    getAllUsers: async (): Promise<UserResponse[]> => {
        return await dbService.allUsers();
    },
    createUser: async (dto: CreateUser): Promise<UserResponse> => {
        return await dbService.createUser(dto);
    },
    updateUser: async (id: number, dto: UpdateUser): Promise<UserResponse> => {
        return await dbService.updateUser(id, dto);
    },
    removeUser: async (id: number): Promise<UserResponse> => {
        return await userService.updateUser(id, { visible: false });
    },
};
