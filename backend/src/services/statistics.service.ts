import { StatisticsQuery } from '../models/query/statistics-query.model';
// import { dbService } from './db/db.service';
import { utilsService } from './utils.service';

export const statisticsService = {
    totalOrdersByDates: async ({ dateStart, dateEnd }: StatisticsQuery) => {
        console.log(typeof dateStart, dateStart, dateEnd);
        const intervals = utilsService.weeksBetween(new Date(dateStart as string), new Date(dateEnd as string));
        // const data = await Promise.all(
        //     intervals.map(
        //         async ({ startDate, endDate }) => ({
        //             startDate,
        //             endDate,
        //             count: await dbService.totalOrdersByDates(startDate, new Date(endDate.setHours(23, 59, 59, 999))),
        //         }),
        //     ),
        // );

        return intervals;
    },
    totalUsersOrdersByDates: async (_q: StatisticsQuery) => {
        return [];
    },
    userOrdersByDates: async (id: number, _q: StatisticsQuery) => {
        console.log('ID', id);

        return [];
    },
};
