// ** Util
import formatRelativeTime from '@/utils/formatRelativeTime';

describe('formatRelativeTime', () => {
    const MOCK_NOW = new Date('2024-01-10T12:00:00.000Z');

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(MOCK_NOW);
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should format relative time for past date (minutes ago)', () => {
        const date = new Date('2024-01-10T11:59:00.000Z'); // 1 phút trước
        const result = formatRelativeTime(date);

        expect(result).toContain('phút trước');
    });

    it('should format relative time for past date (hours ago)', () => {
        const date = new Date('2024-01-10T09:00:00.000Z'); // 3 giờ trước
        const result = formatRelativeTime(date);

        expect(result).toContain('giờ trước');
    });

    it('should format relative time for past date (days ago)', () => {
        const date = new Date('2024-01-08T12:00:00.000Z'); // 2 ngày trước
        const result = formatRelativeTime(date);

        expect(result).toContain('ngày trước');
    });

    it('should work with string date input', () => {
        const date = '2024-01-10T11:00:00.000Z'; // 1 giờ trước
        const result = formatRelativeTime(date);

        expect(result).toContain('giờ trước');
    });

    it('should return "vài giây trước" for very recent date', () => {
        const date = new Date('2024-01-10T11:59:50.000Z'); // 10s trước
        const result = formatRelativeTime(date);

        expect(result).toMatch(/giây trước|vài giây trước/);
    });
});
