import { PageCountQuery } from '../common/page-count-query.model';
import { SearchQuery } from '../common/search-query.model';

export type OrdersQuery = SearchQuery & PageCountQuery;
