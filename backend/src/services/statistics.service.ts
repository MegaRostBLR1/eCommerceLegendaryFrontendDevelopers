import { StatisticsQuery } from '../models/query/statistics-query.model';
import { dbService } from './db/db.service';
import { utilsService } from './utils.service';

const DEFAULT_DAYS_INTERVAL = 7;

export const statisticsService = {
    totalOrdersByDates: async ({ dateStart, dateEnd }: StatisticsQuery) => {
        const intervals = utilsService.splitDateRangeByDays(new Date(dateStart as string), new Date(dateEnd as string), DEFAULT_DAYS_INTERVAL);
        const data = await Promise.all(
            intervals.map(async ({ startDate, endDate }) => ({
                startDate,
                endDate,
                count: await dbService.totalOrdersByDates(startDate, endDate),
            })),
        );

        return data;
    },
    totalUsersOrdersByDates: async ({ dateStart, dateEnd }: StatisticsQuery) => {
        return (await dbService.totalUsersOrdersByDates(new Date(dateStart as string), new Date(dateEnd as string))).map(({ _count, ...i }) => ({
            count: _count.orders,
            ...i,
        }));
    },
    userOrdersByDates: async (id: number, { dateStart, dateEnd }: StatisticsQuery) => {
        const intervals = utilsService.splitDateRangeByDays(new Date(dateStart as string), new Date(dateEnd as string), DEFAULT_DAYS_INTERVAL);

        return await Promise.all(
            intervals.map(async ({ startDate, endDate }) => ({
                startDate,
                endDate,
                count: await dbService.totalOrdersByDates(startDate, endDate, id),
            })),
        );
    },
};
