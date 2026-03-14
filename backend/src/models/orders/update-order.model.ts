import { CreateOrderDto } from './create-order.model';

export type UpdateOrderDto = Partial<CreateOrderDto> & {
    visible?: boolean;
};
