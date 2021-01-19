import { EndpointFactory } from './EndpointFactory';

/** An object representing a single server, with
 * the purpose of avoiding duplication of its api URL.
 *
 * If your app has multiple servers you should
 * create a Server object for each of them. */
export class Server {
    constructor(readonly apiUrl: string) {}

    endpoint = new EndpointFactory(this);
}
