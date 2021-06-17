import { EndpointFactory } from './EndpointFactory';
import _ from 'lodash';

export interface ServerConfig {
    headers?(): HeadersInit;
    trailingSlash?: boolean;
    shouldRetry?(attemptCount: number, error: unknown): Promise<boolean>;
}

/** An object representing a single server, with
 * the purpose of avoiding duplication of its api URL.
 *
 * If your app has multiple servers you should
 * create a Server object for each of them. */
export class Server {
    constructor(readonly apiUrl: string, private config?: ServerConfig) {}

    headers = this.config?.headers ?? _.constant(new Headers());

    // `true` by default because we assume Django.
    trailingSlash = this.config?.trailingSlash ?? true;

    endpoint = new EndpointFactory(this);

    /** @internal */
    async shouldRetry(attemptCount: number, error: unknown): Promise<boolean> {
        return this.config?.shouldRetry?.(attemptCount, error) ?? false;
    }
}
