import { CrudMethod } from './types';
import { fetchWithInferredContentType } from './inferContentType';
import _ from 'lodash';
import { FetchError, isFetchError } from './FetchError';
import { Url } from './urlUtils';
import autoBind from 'auto-bind';
import { create, Describe } from 'superstruct';
import { Server } from './Server';
import { events } from './events';
import { EndpointConfig } from './EndpointFactory';

/** @internal
 * An object with all the parameters received by the Endpoint constructor. */
export interface EndpointParams<FetchParams extends any[], ResponseData>
    extends EndpointConfig<FetchParams, ResponseData> {
    /** The server object used to create this endpoint. */
    server: Server;

    /** The HTTP method used to fetch this endpoint. */
    method: CrudMethod;

    /** The part after the server API url, without any ids or query params. */
    path: string;

    /** The function that should be used to add ids, query params, slashes, etc. to the URL. */
    urlWithParams(url: string, ...params: FetchParams): string;

    /** `true` if a body should be sent with the fetch API. */
    hasRequestBody?: boolean;

    /** A SuperStruct object to validate and coerce the JSON response. */
    struct?: Describe<ResponseData>;
}

/** An object representing a single endpoint (with a single HTTP method).
 *
 * You should create these objects from a server instance instead of creating them directly. */
export class Endpoint<FetchParams extends any[], ResponseData> {
    /** @internal */
    constructor(private params: EndpointParams<FetchParams, ResponseData>) {
        // this allows to pass Endpoint methods as functions
        autoBind(this);
    }

    readonly server = this.params.server;
    readonly method = this.params.method;
    private path = this.params.path;
    private urlWithParams = this.params.urlWithParams;
    private hasRequestBody = this.params.hasRequestBody;
    private struct = this.params.struct;
    private headers = this.params.headers;
    private mock = this.params.mock;

    readonly url = Url.join(this.server.apiUrl, this.path);

    /** Makes a request to the endpoint with the given params. */
    async fetch(...params: FetchParams): Promise<ResponseData> {
        try {
            return await this.fetchWithRetries(0, ...params);
        } catch (error) {
            if (isFetchError(error)) {
                window.dispatchEvent(
                    new CustomEvent(events.FETCH_ERROR, {
                        detail: error,
                    })
                );
            }

            throw error;
        }
    }

    private async fetchWithRetries(
        attemptCount: number,
        ...params: FetchParams
    ): Promise<ResponseData> {
        try {
            return await this.fetchWithoutRetry(...params);
        } catch (error) {
            if (await this.shouldRetry(attemptCount + 1, error)) {
                return await this.fetchWithRetries(attemptCount + 1, ...params);
            } else {
                throw error;
            }
        }
    }

    private async fetchWithoutRetry(
        ...params: FetchParams
    ): Promise<ResponseData> {
        if (this.mock !== undefined) {
            return _.isFunction(this.mock) ? this.mock(...params) : this.mock;
        }

        let url = this.urlWithParams(this.url, ...params);
        if (this.server.trailingSlash) {
            url = Url.withTrailingSlash(url);
        }

        const serverHeaders = new Headers(this.server.headers());
        const endpointHeaders = new Headers(this.headers?.());

        let response: Response;
        try {
            response = await fetchWithInferredContentType(url, {
                method: this.method,
                headers: mergeHeaders(serverHeaders, endpointHeaders),
                body: this.hasRequestBody ? _.last(params) : undefined,
            });
        } catch (err) {
            if (isNetworkError(err) && this.mock !== undefined) {
                return this.mock;
            }
            throw err;
        }

        if (response.status === 404 && this.mock !== undefined) {
            return this.mock;
        }

        let data: unknown = {};
        if (response.status !== 204) {
            // assume the response will be a JSON. This is not actually always correct.
            data = await response.json();
        }

        if (!response.ok) {
            throw new FetchError(this, response, data);
        }

        if (this.struct) {
            data = create(data, this.struct);
        }

        return data as ResponseData;
    }

    private async shouldRetry(
        attemptCount: number,
        error: unknown
    ): Promise<boolean> {
        return (
            (await this.params.shouldRetry?.(attemptCount, error)) ??
            (await this.server.shouldRetry(attemptCount, error))
        );
    }
}

function mergeHeaders(a: Headers, b: Headers) {
    b.forEach((value, name) => {
        a.append(name, value);
    });
    return a;
}

export function isNetworkError(err: any): boolean {
    return (
        err instanceof TypeError &&
        (err.message.includes('NetworkError') || err.message.includes('fetch'))
    );
}
