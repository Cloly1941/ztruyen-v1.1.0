// ** Util
import chunkArray from '@/utils/chunkArray';

describe('chunkArray', () => {
    it('should split array into chunks of given size', () => {
        const input = [1, 2, 3, 4, 5, 6];
        const result = chunkArray(input, 2);

        expect(result).toEqual([
            [1, 2],
            [3, 4],
            [5, 6],
        ]);
    });

    it('should handle array length not divisible by size', () => {
        const input = [1, 2, 3, 4, 5];
        const result = chunkArray(input, 2);

        expect(result).toEqual([
            [1, 2],
            [3, 4],
            [5],
        ]);
    });

    it('should return empty array when input is empty', () => {
        const result = chunkArray([], 3);
        expect(result).toEqual([]);
    });

    it('should return one chunk when size is larger than array length', () => {
        const input = [1, 2, 3];
        const result = chunkArray(input, 10);

        expect(result).toEqual([[1, 2, 3]]);
    });

    it('should split into single-item chunks when size is 1', () => {
        const input = [1, 2, 3];
        const result = chunkArray(input, 1);

        expect(result).toEqual([[1], [2], [3]]);
    });

    it('should work with string array', () => {
        const input = ['a', 'b', 'c', 'd'];
        const result = chunkArray(input, 3);

        expect(result).toEqual([['a', 'b', 'c'], ['d']]);
    });

    it('should work with object array', () => {
        const input = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
        ];

        const result = chunkArray(input, 2);

        expect(result).toEqual([
            [{ id: 1 }, { id: 2 }],
            [{ id: 3 }],
        ]);
    });
});
