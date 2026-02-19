import { CATEGORY_SELECT } from './category.select';

export const SERVICE_SELECT = {
    id: true,
    name: true,
    discount: true,
    amount: true,
    workersCount: true,
    duration: true,
    description: true,
    servicesCategories: {
        select: {
            serviceId: true,
            categoryId: true,
            category: { select: CATEGORY_SELECT },
        },
    },
};
