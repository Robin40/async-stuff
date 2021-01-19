import { Url } from '../src/urlUtils';

describe('urls', () => {
    it('can be joined taking care of extra slashes', () => {
        expect(Url.join('a', 'b/', '/c', 'd/')).toBe('a/b/c/d');
    });
});
