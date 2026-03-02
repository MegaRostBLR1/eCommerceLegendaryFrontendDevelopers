import { query } from 'express-validator';

export const queryValidators = {
    query: [query('page').isInt({ min: 1 }).toInt(), query('count').isInt({ min: 1 }).toInt()],
};
