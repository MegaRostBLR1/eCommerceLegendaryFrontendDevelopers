import { Order } from "@prisma/client";
import { UserResponse } from "../users/user-response.model";

export type OrderDataResponse = Pick<Order, 'id' | 'description' | 'startDate' | 'status' | 'price'> & {
    name: string;
    
    user: Omit<UserResponse, 'email' | 'role'>;
}