// ** utils
import removeExtension from "@/utils/removeExtension";

describe('removeExtension()', () => {
    it('Remove extension when string ends with the extension', () => {
        const result = removeExtension('dang-phat-hanh.html', '.html');
        expect(result).toBe('dang-phat-hanh');
    })

    it('Returns original string when extension does not match', () => {
        const result = removeExtension('dang-phat-hanh.txt', '.html');
        expect(result).toBe('dang-phat-hanh.txt');
    })

    it('Work with filenames with multiple dots', () => {
        const result = removeExtension('my.file.name.html', '.html');
        expect(result).toBe('my.file.name');
    })

    it('Returns original string when string does not end with the extension', () => {
        const result = removeExtension('dang-phat-hanh.html', '.txt');
        expect(result).toBe('dang-phat-hanh.html');
    })

    it('Returns original string when extension is empty', () => {
        const result = removeExtension('dang-phat-hanh.html', '');
        expect(result).toBe('dang-phat-hanh.html');
    })

    it('Handles empty string input', () => {
        const result = removeExtension('', '.html');
        expect(result).toBe('');
    })
})