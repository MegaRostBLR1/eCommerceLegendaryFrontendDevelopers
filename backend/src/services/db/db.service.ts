import { Prisma, PrismaClient } from '@prisma/client';
import { UserRole } from '../../enums/user-role.enum';
import { ReqBody } from '../../models/common/request-body.model';
import { UserResponse } from '../../models/users/user-response.model';
import { USER_SELECT } from './constants/user.select';
import { CategoryResponse } from '../../models/categories/category-response.model';
import { CATEGORY_SELECT } from './constants/category.select';
import { ServiceData } from '../../models/services/service-data.model';
import { SERVICE_SELECT } from './constants/service.select';

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
    allUsers: async (page: number, count: number): Promise<UserResponse[]> => {
        return await db.user.findMany({ where: { visible: true }, select: USER_SELECT, take: count, skip: (page - 1) * count });
    },
    usersCount: async (): Promise<number> => {
        return await db.user.count({ where: { visible: true } });
    },
    getUserById: async (id: number, visible?: boolean): Promise<UserResponse | null> => {
        return await db.user.findFirst({ where: { id, visible }, select: USER_SELECT });
    },
    updateUser: async (id: number, data: Prisma.UserUncheckedUpdateInput): Promise<UserResponse> => {
        return await db.user.update({ where: { id }, data, select: USER_SELECT });
    },
    getCategories: async (visible: boolean): Promise<CategoryResponse[]> => {
        return await db.category.findMany({ where: { visible }, select: CATEGORY_SELECT });
    },
    getCategoryById: async (id: number, visible?: boolean): Promise<CategoryResponse | null> => {
        return await db.category.findFirst({ where: { id, visible }, select: CATEGORY_SELECT });
    },
    getServicesCategoriesByServiceId: async (serviceId: number): Promise<{ categoryId: number }[]> => {
        return await db.servicesCategories.findMany({ where: { serviceId }, select: { categoryId: true } });
    },
    createCategory: async (data: Prisma.CategoryUncheckedCreateInput): Promise<CategoryResponse> => {
        return await db.category.create({ data, select: CATEGORY_SELECT });
    },
    updateCategory: async (id: number, data: Prisma.CategoryUncheckedUpdateInput): Promise<CategoryResponse> => {
        return await db.category.update({ where: { id }, data, select: CATEGORY_SELECT });
    },
    getServices: async (visible: boolean): Promise<ServiceData[]> => {
        return await db.service.findMany({ where: { visible }, select: SERVICE_SELECT });
    },
    getServiceById: async (id: number, visible?: boolean): Promise<ServiceData | null> => {
        return await db.service.findFirst({ where: { id, visible }, select: SERVICE_SELECT });
    },
    createService: async (data: Prisma.ServiceUncheckedCreateInput): Promise<ServiceData> => {
        return await db.service.create({ data, select: SERVICE_SELECT });
    },
    updateService: async (id: number, data: Prisma.ServiceUncheckedUpdateInput): Promise<ServiceData> => {
        return await db.service.update({ where: { id }, data, select: SERVICE_SELECT });
    },
};
