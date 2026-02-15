import { Service, ServicesCategories } from '@prisma/client';

export type ServiceData = Omit<Service, 'date' | 'visible'> & {
    servicesCategories: ServicesCategories[];
};
