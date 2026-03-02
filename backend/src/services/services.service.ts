import { CategoryResponse } from '../models/categories/category-response.model';
import { QueryServices } from '../models/query/query-services.model';
import { CreateService } from '../models/services/create-service.model';
import { ServiceResponse } from '../models/services/service-response.model';
import { ServicesDateResponse } from '../models/services/services-data-response.model';
import { UpdateService } from '../models/services/update-service.model';
import { dbService } from './db/db.service';
import { utilsService } from './utils.service';

const MOST_USED_ORDERS_COUNT = 4;

const mappedServiceCategories = (data: any[]): CategoryResponse[] => {
    return data.map(({ category }) => category);
};

export const servicesService = {
    mostUsedServices: async (): Promise<ServiceResponse[] | any> => {
        return (await dbService.servicesOrderByPostsCount(MOST_USED_ORDERS_COUNT)).map(({ servicesCategories, ...d }) => ({
            ...d,
            categories: mappedServiceCategories(servicesCategories),
        }));
    },
    getServiceById: async (id: number, visible?: boolean): Promise<ServiceResponse | null> => {
        const data = await dbService.getServiceById(id, visible);

        if (!data) return null;

        const { servicesCategories, ...d } = data;

        return { ...d, categories: mappedServiceCategories(servicesCategories) };
    },
    getAllServices: async ({ page: p, count: c, search, categories: cats }: QueryServices): Promise<ServicesDateResponse> => {
        const page = p ? Number(p) : 1;
        const count = c ? Number(c) : 10;
        const categories = utilsService.convertStringToNumberArray(cats);
        const servicesCount = await dbService.getServicesCount(categories, search, true);

        return {
            page,
            count,
            pages: Math.ceil(servicesCount / count),
            data: (await dbService.getServices(categories, search, true)).map(({ servicesCategories, ...d }) => ({
                ...d,
                categories: mappedServiceCategories(servicesCategories),
            })),
        };
    },
    createService: async ({ categories, name, discount, amount, workersCount, duration, description }: CreateService): Promise<ServiceResponse> => {
        const { servicesCategories, ...d } = await dbService.createService({
            name,
            discount,
            amount,
            workersCount,
            duration,
            description,
            servicesCategories: categories?.length
                ? {
                      create: categories.map((categoryId) => ({ categoryId })),
                  }
                : undefined,
        });

        return { ...d, categories: mappedServiceCategories(servicesCategories) };
    },
    updateService: async (
        id: number,
        { categories, name, discount, amount, workersCount, duration, description }: UpdateService,
    ): Promise<ServiceResponse> => {
        const currentServiceCategories = categories?.length ? await dbService.getServicesCategoriesByServiceId(id) : [];
        const { create: c, deletedIds } = utilsService.returnCreateDelete(
            currentServiceCategories.map(({ categoryId }) => categoryId),
            categories || [],
        );

        const { servicesCategories, ...d } = await dbService.updateService(id, {
            name,
            discount,
            amount,
            workersCount,
            duration,
            description,
            servicesCategories: categories
                ? {
                      create: c.map((categoryId) => ({ categoryId })),
                      delete: deletedIds.map((categoryId) => ({ services_categories_unique: { categoryId, serviceId: id } })),
                  }
                : undefined,
        });

        return { ...d, categories: mappedServiceCategories(servicesCategories) };
    },
    removeService: async (id: number): Promise<ServiceResponse> => {
        return await servicesService.updateService(id, { visible: false });
    },
};
