import { PageCountQuery } from './user-query.model';

export type QueryServices = PageCountQuery & {
    categories?: string;
    search?: string;
};
