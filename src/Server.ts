import { EndpointFactory } from './EndpointFactory';
import _ from 'lodash';

export interface ServerConfig {
    headers?(): HeadersInit;
}

/** An object representing a single server, with
 * the purpose of avoiding duplication of its api URL.
 *
 * If your app has multiple servers you should
 * create a Server object for each of them. */
export class Server {
    constructor(readonly apiUrl: string, private config?: ServerConfig) {}

    headers = this.config?.headers ?? _.constant(new Headers());

    endpoint = new EndpointFactory(this);
}
