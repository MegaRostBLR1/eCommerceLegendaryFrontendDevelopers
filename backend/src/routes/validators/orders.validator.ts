import { body, param } from 'express-validator';
import { ordersService } from '../../services/orders.service';
import { HttpException } from '../../exceptions/exception';
import { servicesService } from '../../services/services.service';
import { isDate } from 'lodash';

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
        body('serviceId')
            .isInt()
            .custom(async (serviceId) => {
                if (await servicesService.getServiceById(serviceId, true)) return true;
                else throw new HttpException(400, 'Not exist entity');
            })
            .withMessage('Service not exist'),
        body('quantity').isInt(),
        body('price').isDecimal(),
        body('description').optional().isString(),
        body('startDate')
            .isString()
            .toDate()
            .custom((value) => {
                if (!(isDate(value) && !isNaN(value.getTime()))) throw new HttpException(400, 'Bad start date');
                else return true;
            }),
    ],
    orderUpdate: [
        body('quantity').optional().isInt(),
        body('description').optional().isString(),
        body('status').optional().isIn([0, 1, 2]),
        body('startDate')
            .optional()
            .isString()
            .toDate()
            .custom((value) => {
                if (!(isDate(value) && !isNaN(value.getTime()))) throw new HttpException(400, 'Bad start date');
                else return true;
            }),
    ],
};
