import { body, param, query } from 'express-validator';
import { HttpException } from '../../exceptions/exception';
import { servicesService } from '../../services/services.service';
import { categoriesService } from '../../services/categories.service';
import { validators } from './validators';

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
        body('categories')
            .isArray()
            .custom(async (value) => {
                if (!value) return true;

                const allIntegers = value.every(Number.isInteger);

                if (!allIntegers) throw new HttpException(400, 'All elements in the numbers array must be integers');

                for (const id of value) {
                    if (!(await categoriesService.getCategoryById(id))) throw new HttpException(400, `Category id ${id} not exist`);
                }

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
        body('categories')
            .optional()
            .isArray()
            .custom(async (value) => {
                if (!value) return true;

                const allIntegers = value.every(Number.isInteger);

                if (!allIntegers) throw new HttpException(400, 'All elements in the numbers array must be integers');

                for (const id of value) {
                    if (!(await categoriesService.getCategoryById(id))) throw new HttpException(400, `Category id ${id} not exist`);
                }

                return true;
            }),
    ],
    all: [...validators.search, query('categories').optional().isString()],
};
