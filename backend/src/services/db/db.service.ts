import { Prisma, PrismaClient } from '@prisma/client';
import { UserRole } from '../../enums/user-role.enum';
import { ReqBody } from '../../models/common/request-body.model';
import { UserResponse } from '../../models/users/user-response.model';
import { USER_SELECT } from './constants/user.select';

const db = new PrismaClient();

export const disconnectDb = async (): Promise<void> => {
    await db.$disconnect();
};

export const dbService = {
    createUser: async (data: ReqBody, role?: UserRole): Promise<UserResponse> => {
        return await db.user.create({
            data: {
                ...data,
                role: role as string,
            },
            select: USER_SELECT,
        });
    },

    getUserByEmail: async (email: string, visible?: boolean): Promise<UserResponse | null> => {
        return await db.user.findFirst({ where: { email, visible }, select: USER_SELECT });
    },

    allUsers: async (): Promise<UserResponse[]> => {
        return await db.user.findMany({ where: { visible: true }, select: USER_SELECT });
    },

    getUserById: async (id: number, visible?: boolean): Promise<UserResponse | null> => {
        return await db.user.findFirst({ where: { id, visible }, select: USER_SELECT });
    },

    updateUser: async (id: number, data: Prisma.UserUncheckedUpdateInput): Promise<UserResponse> => {
        return await db.user.update({ where: { id }, data, select: USER_SELECT });
    },
};
