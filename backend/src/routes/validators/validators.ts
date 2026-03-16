import { body, query } from 'express-validator';
import { isDate } from 'lodash';
import { HttpException } from '../../exceptions/exception';

export const validators = {
    login: [body('email').isEmail().withMessage('Email required'), body('password').isString().isLength({ min: 3 }).withMessage('Password required')],
    search: [query('search').optional().isString().isLength({ min: 3 }).withMessage('Search minimum length is 3 symbols')],
    dates: [
        query('dateStart')
            .isString()
            .toDate()
            .custom((value) => {
                if (!(isDate(value) && !isNaN(value.getTime()))) throw new HttpException(400, 'Bad start date');
                else return true;
            }),
        query('dateEnd')
            .isString()
            .toDate()
            .custom((value) => {
                if (!(isDate(value) && !isNaN(value.getTime()))) throw new HttpException(400, 'Bad end date');
                else return true;
            }),
    ],
};
