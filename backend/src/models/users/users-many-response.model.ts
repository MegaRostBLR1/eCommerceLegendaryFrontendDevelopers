import { CommonPagesResponse } from '../common/common-pages-response.model';
import { UserResponse } from './user-response.model';

export type UsersResponse = CommonPagesResponse & {
    data: UserResponse[];
};
