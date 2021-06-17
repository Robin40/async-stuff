import { JsonStorage } from '../../../src';
import { object, string } from 'superstruct';

export const authStorage = new JsonStorage(
    'async-stuff.examples.classbook.auth',
    object({
        accessToken: string(),
        refreshToken: string(),
    })
);
