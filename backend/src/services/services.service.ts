import { CategoryResponse } from '../models/categories/category-response.model';
import { PageCountQuery } from '../models/query/user-query.model';
import { CreateService } from '../models/services/create-service.model';
import { ServiceResponse } from '../models/services/service-response.model';
import { UpdateService } from '../models/services/update-service.model';
import { dbService } from './db/db.service';
import { utilsService } from './utils.service';

const mappedServiceCategories = (data: any[]): CategoryResponse[] => {
    console.log('DATA', data);
    return [];
};

export const servicesService = {
    mostUsedServices: async (): Promise<ServiceResponse[]> => {
        return [];
    },
    getServiceById: async (id: number): Promise<ServiceResponse | null> => {
        const data = await dbService.getServiceById(id);

        if (!data) return null;

        const { servicesCategories, ...d } = data;

        return { ...d, categories: mappedServiceCategories(servicesCategories) };
    },
    getAllServices: async ({ page: p, count: c }: PageCountQuery): Promise<ServiceResponse[]> => {
        const page = p ? Number(p) : 1;
        const count = c ? Number(c) : 10;
        console.log('P C', page, count);
        const data = await dbService.getServices(true);
        data.forEach(({ servicesCategories, ...d }) => {
            console.log('S EL', d, mappedServiceCategories(servicesCategories));
        });

        return [];
    },
    createService: async ({ categories, ...dto }: CreateService): Promise<ServiceResponse> => {
        const { servicesCategories, ...d } = await dbService.createService({
            ...dto,
            servicesCategories: categories?.length
                ? {
                      create: categories.map((categoryId) => ({ categoryId })),
                  }
                : undefined,
        });

        return { ...d, categories: mappedServiceCategories(servicesCategories) };
    },
    updateService: async (id: number, { categories, ...dto }: UpdateService): Promise<ServiceResponse> => {
        const currentServiceCategories = categories?.length ? await dbService.getServicesCategoriesByServiceId(id) : [];
        const { create: c, deletedIds } = utilsService.returnCreateDelete(
            currentServiceCategories.map(({ categoryId }) => categoryId),
            categories || [],
        );

        const { servicesCategories, ...d } = await dbService.updateService(id, {
            ...dto,
            servicesCategories: !categories
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
