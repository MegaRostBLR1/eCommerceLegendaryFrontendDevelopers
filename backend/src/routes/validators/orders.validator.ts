import { body, param } from 'express-validator';
import { ordersService } from '../../services/orders.service';
import { HttpException } from '../../exceptions/exception';

export const ordersValidators = {
    orderId: [
        param('id')
            .isInt()
            .toInt()
            .custom(async (id) => {
                if (await ordersService.orderById(id)) return true;
                else throw new HttpException(400, 'Not exist entity');
            })
            .withMessage('Not exist entity'),
    ],
    orderCreate: [
        body('serviceId').isInt(),
        body('quantity').isInt(),
        // body('amount').isDecimal(),
        // body('workersCount').optional().isInt(),
        // body('duration').isInt(),
        // body('description').optional().isString(),
        // body('categories')
        //     .isArray()
        //     .custom(async (value) => {
        //         if (!value) return true;
        //         const allIntegers = value.every(Number.isInteger);
        //         if (!allIntegers) throw new HttpException(400, 'All elements in the numbers array must be integers');
        //         for (const id of value) {
        //             if (!(await categoriesService.getCategoryById(id))) throw new HttpException(400, `Category id ${id} not exist`);
        //         }
        //         return true;
        //     }),
    ],
    orderUpdate: [
        body('quantity').optional().isInt(),
        // body('discount').optional().isDecimal(),
        // body('amount').optional().isDecimal(),
        // body('workersCount').optional().isInt(),
        // body('duration').optional().isInt(),
        // body('description').optional().isString(),
        // body('categories')
        //     .optional()
        //     .isArray()
        //     .custom(async (value) => {
        //         if (!value) return true;
        //         const allIntegers = value.every(Number.isInteger);
        //         if (!allIntegers) throw new HttpException(400, 'All elements in the numbers array must be integers');
        //         for (const id of value) {
        //             if (!(await categoriesService.getCategoryById(id))) throw new HttpException(400, `Category id ${id} not exist`);
        //         }
        //         return true;
        //     }),
    ],
};
