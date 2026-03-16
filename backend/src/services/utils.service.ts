import { difference } from 'lodash';

export const utilsService = {
    returnCreateDelete: (previous: number[], current: number[]): { create: number[]; deletedIds: number[] } => {
        if (!current) return { create: [], deletedIds: [] };

        return { create: difference(current, previous), deletedIds: difference(previous, current) };
    },
    convertStringToNumberArray: (str?: string): number[] => {
        if (!str) return [];

        return str.split(',').map((i) => Number(i.trim()));
    },
    weeksBetween: (dateStart: Date, dateEnd: Date) => {
        let sDate = new Date(dateStart.getTime());
        let eDate;
        const dateArr = [];
        const oneDayInMs = 24 * 60 * 60 * 1000;

        while (sDate <= dateEnd) {
            const dayOfWeek = sDate.getDay();
            const daysUntilWeekend = 6 - dayOfWeek;
            const potentialEndDate = new Date(sDate.getTime() + daysUntilWeekend * oneDayInMs);

            eDate = potentialEndDate > dateEnd ? new Date(dateEnd.getTime()) : potentialEndDate;

            dateArr.push({
                startDate: new Date(sDate.getTime()),
                endDate: new Date(eDate.getTime()),
            });

            sDate.setDate(eDate.getDate() + 1);
        }
        return dateArr;
    },
};
