import { SearchQuery } from "../common/search-query.model";
import { PageCountQuery } from "../query/user-query.model";

export type OrdersQuery  = SearchQuery & PageCountQuery;
