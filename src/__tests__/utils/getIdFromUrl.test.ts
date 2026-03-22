// ** Util
import getIdFromUrl from '@/utils/getIdFromUrl';

describe('getIdFromUrl', () => {
    it('should get last segment when type is "/"', () => {
        const url = '/truyen-tranh/one-piece/12345';
        const result = getIdFromUrl(url, '/');

        expect(result).toBe('12345');
    });

    it('should get last segment when type is "-"', () => {
        const url = 'truyen-tranh-one-piece-98765';
        const result = getIdFromUrl(url, '-');

        expect(result).toBe('98765');
    });

    it('should ignore empty segment when url ends with "/"', () => {
        const url = '/truyen-tranh/one-piece/99999/';
        const result = getIdFromUrl(url, '/');

        expect(result).toBe('99999');
    });

    it('should ignore empty segment when url starts with "/"', () => {
        const url = '/99999';
        const result = getIdFromUrl(url, '/');

        expect(result).toBe('99999');
    });

    it('should return full string if no "/" exists', () => {
        const url = '12345';
        const result = getIdFromUrl(url, '/');

        expect(result).toBe('12345');
    });

    it('should return full string if no "-" exists', () => {
        const url = '12345';
        const result = getIdFromUrl(url, '-');

        expect(result).toBe('12345');
    });

    it('should return last part when many "-" exist', () => {
        const url = 'a-b-c-d-777';
        const result = getIdFromUrl(url, '-');

        expect(result).toBe('777');
    });

    it('should return empty string when url is empty', () => {
        const url = '';
        const result = getIdFromUrl(url, '/');

        expect(result).toBe('');
    });

    it('should work with only separator', () => {
        const url = '////';
        const result = getIdFromUrl(url, '/');

        expect(result).toBe('');
    });
});
