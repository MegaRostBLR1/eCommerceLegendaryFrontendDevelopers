import { CommonPagesResponse } from '../common/common-pages-response.model';
import { OrderDataResponse } from './order-data-response.model';

export type OrdersResponse = CommonPagesResponse & {
    data: OrderDataResponse[];
};
