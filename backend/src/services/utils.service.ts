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
};
