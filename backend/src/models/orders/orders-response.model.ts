import { CommonPagesResponse } from "../common/common-pages-response.model";

export type OrdersResponse = CommonPagesResponse & {
    data: OrderDataResponse[];
};