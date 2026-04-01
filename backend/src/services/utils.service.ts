import { difference } from 'lodash';

export function addHours(date: Date, hours: number) {
    date.setHours(date.getHours() + hours);

    return date;
}

export const utilsService = {
    returnCreateDelete: (previous: number[], current: number[]): { create: number[]; deletedIds: number[] } => {
        if (!current) return { create: [], deletedIds: [] };

        return { create: difference(current, previous), deletedIds: difference(previous, current) };
    },
    convertStringToNumberArray: (str?: string): number[] => {
        if (!str) return [];

        return str.split(',').map((i) => Number(i.trim()));
    },
    splitDateRangeByDays: (start: Date, end: Date, maxDays: number) => {
        let result = [];
        let currentStart = new Date(start);
        console.log('CURRENT START', currentStart);

        while (currentStart < end) {
            let potentialEnd = new Date(currentStart.getFullYear(), currentStart.getMonth(), currentStart.getDate() + maxDays);
            let currentEnd = potentialEnd <= end ? potentialEnd : new Date(end);

            const s = currentStart;
            const e = currentEnd;
            result.push({
                startDate: addHours(s, 3),
                endDate: e,
            });

            currentStart = new Date(currentEnd);
        }

        return result;
    },
};
