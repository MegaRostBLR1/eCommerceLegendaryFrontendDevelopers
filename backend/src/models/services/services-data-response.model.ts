import { CommonPagesResponse } from '../common/common-pages-response.model';
import { ServiceResponse } from './service-response.model';

export type ServicesDateResponse = CommonPagesResponse & {
    data: ServiceResponse[];
};
