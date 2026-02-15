import { body, param } from 'express-validator';
import { HttpException } from '../../exceptions/exception';
import { servicesService } from '../../services/services.service';

export const servicesValidators = {
    serviceId: [
        param('id')
            .isInt()
            .toInt()
            .custom(async (id) => {
                if (await servicesService.getServiceById(id)) return true;
                else throw new HttpException(400, 'Not exist entity');
            })
            .withMessage('Not exist entity'),
    ],
    serviceCreate: [
        body('name').isString(),
        body('discount').optional().isDecimal(),
        body('amount').isDecimal(),
        body('workersCount').optional().isInt(),
        body('duration').isInt(),
        body('description').optional().isString(),
        body('categories').isArray(),
        body('numbers').custom((value) => {
            const allIntegers = value.every(Number.isInteger);
            if (!allIntegers) throw new Error('All elements in the numbers array must be integers');

            return true;
        }),
    ],
    serviceUpdate: [
        body('name').optional().isString(),
        body('discount').optional().isDecimal(),
        body('amount').optional().isDecimal(),
        body('workersCount').optional().isInt(),
        body('duration').optional().isInt(),
        body('description').optional().isString(),
        body('categories').optional().isArray(),
        body('numbers').custom((value) => {
            const allIntegers = value.every(Number.isInteger);
            if (!allIntegers) throw new Error('All elements in the numbers array must be integers');

            return true;
        }),
    ],
};
