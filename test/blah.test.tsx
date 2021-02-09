import { Url } from '../src/urlUtils';
import { JsonStorage } from '../src';
import { number, object, string } from 'superstruct';

describe('urls', () => {
    it('can be joined taking care of extra slashes', () => {
        expect(Url.join('a', 'b/', '/c', 'd/')).toBe('a/b/c/d/');
    });
});

describe('JsonStorage', () => {
    it('passes basic test', () => {
        const randomKey = Math.random().toString();
        const jsonStorage = new JsonStorage(
            randomKey,
            object({
                id: number(),
                token: string(),
            })
        );

        expect(jsonStorage.get()).toBeUndefined();
        jsonStorage.set({ id: 42, token: 'secret' });
        expect(jsonStorage.get()?.id).toBe(42);
        expect(jsonStorage.get()?.token).toBe('secret');
        jsonStorage.patch({ id: 33 });
        expect(jsonStorage.get()?.id).toBe(33);
        expect(jsonStorage.get()?.token).toBe('secret');
        jsonStorage.clear();
        expect(jsonStorage.get()).toBeUndefined();
    });
});
