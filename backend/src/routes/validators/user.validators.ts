import { body, param } from 'express-validator';
import { HttpException } from '../../exceptions/exception';
import { userService } from '../../services/user.service';

export const userValidators = {
    userId: [
        param('id')
            .isInt()
            .toInt()
            .custom(async (id) => {
                if (await userService.getUserById(id)) return true;
                else throw new HttpException(400, 'Not exist user');
            })
            .withMessage('Not exist user'),
    ],
    userBody: [body('firstName').optional().isString(), body('lastName').optional().isString(), body('patronymic').optional().isString()],
};
