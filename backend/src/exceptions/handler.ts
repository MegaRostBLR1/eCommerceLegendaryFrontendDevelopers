import { NextFunction, Request, Response } from 'express';
import { LoggerLevel } from '../enums/logger-level.enum';
const chalk = require('chalk');

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    const { method, url, ip } = req;
    console.log(chalk.red(`${LoggerLevel.ERROR}: ${new Date().toISOString()} ${method} ${url} ${ip} => ${err.message}`));
    res.status(err.status).send({ error: err.message });
};
