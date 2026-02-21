import { SearchQuery } from '../common/search-query.model';
import { PageCountQuery } from './user-query.model';

export type QueryServices = PageCountQuery & SearchQuery & {
    categories?: string;
    
};
