import { UserResponse } from './user-response.model';

export type UsersResponse = {
    page: number;
    pages: number;
    count: number;
    data: UserResponse[];
};
