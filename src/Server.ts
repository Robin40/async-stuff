/** An object representing a single server, with
 * the purpose of avoiding duplication of its api URL.
 *
 * If your app has multiple servers you should
 * create a Server object for each of them. */
import { Endpoint } from './Endpoint';
import { Url } from './urlUtils';
import _ from 'lodash';

const staticMethods = [
    'post',
    'getAll',
    'get',
    'put',
    'patch',
    'delete',
] as const;

export class Server {
    readonly endpoint: Pick<typeof Endpoint, typeof staticMethods[number]>;

    constructor(readonly apiUrl: string) {
        this.endpoint = _.mapValues(
            _.pick(Endpoint, staticMethods),
            (method: any) => (path: string, ...rest: any) =>
                method(Url.join(apiUrl, path), ...rest)
        );
    }
}
