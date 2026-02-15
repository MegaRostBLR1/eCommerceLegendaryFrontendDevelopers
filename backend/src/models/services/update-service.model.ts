import { CreateService } from './create-service.model';

export type UpdateService = Partial<CreateService> & {
    visible?: boolean;
};
