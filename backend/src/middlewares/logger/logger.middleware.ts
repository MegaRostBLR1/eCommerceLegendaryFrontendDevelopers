import { Request, Response, NextFunction } from 'express';
import { LoggerLevel } from '../../enums/logger-level.enum';
const chalk = require('chalk');

export const loggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const { method, url, ip, body } = req;
    console.log(chalk.green(`${LoggerLevel.INFO}: ${new Date().toISOString()} ${method} ${url} ${body ? JSON.stringify(body) : ''} ${ip}`));

    next();
};
