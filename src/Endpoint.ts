import { CrudMethod } from './types';
import { requestWithInferredContentType } from './inferContentType';
import _ from 'lodash';
import { FetchError } from './FetchError';
import { Url } from './urlUtils';
import autoBind from 'auto-bind';
import { create, Describe } from 'superstruct';
import { Server } from './Server';
import { events } from './events';
import { EndpointConfig } from './EndpointFactory';
import { isFetchError } from './utils/errorTypeGuards';

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
    readonly name = this.params.name;
    private path = this.params.path;
    private urlWithParams = this.params.urlWithParams;
    private hasRequestBody = this.params.hasRequestBody;
    private struct = this.params.struct;
    private headers = this.params.headers;
    private mock = this.params.mock;

    readonly url = Url.join(this.server.apiUrl, this.path);

    /** Makes a request to the endpoint with the given params. */
    async fetch(...params: FetchParams): Promise<ResponseData> {
        if (this.mock !== undefined) {
            try {
                let data = _.isFunction(this.mock)
                    ? this.mock(...params)
                    : this.mock;

                if (this.struct) {
                    data = create(data, this.struct);
                }

                return data;
            } catch (error) {
                const mockRequest = this.makeRequestObject(...params);
                this.dispatchRequestError(error, mockRequest);
                throw error;
            }
        }

        return await this.fetchWithRetries(0, ...params);
    }

    makeRequestObject(...params: FetchParams): Request {
        let url = this.urlWithParams(this.url, ...params);
        if (this.server.trailingSlash) {
            url = Url.withTrailingSlash(url);
        }

        const serverHeaders = new Headers(this.server.headers());
        const endpointHeaders = new Headers(this.headers?.());

        return requestWithInferredContentType(url, {
            method: this.method,
            headers: mergeHeaders(serverHeaders, endpointHeaders),
            body: this.hasRequestBody ? _.last(params) : undefined,
        });
    }

    private async fetchWithRetries(
        attemptCount: number,
        ...params: FetchParams
    ): Promise<ResponseData> {
        const request = this.makeRequestObject(...params);
        try {
            return await this.fetchWithoutRetry(request);
        } catch (error) {
            if (await this.shouldRetry(attemptCount + 1, error)) {
                return await this.fetchWithRetries(attemptCount + 1, ...params);
            } else {
                this.dispatchRequestError(error, request);
                throw error;
            }
        }
    }

    private async fetchWithoutRetry(request: Request): Promise<ResponseData> {
        const response = await fetch(request);

        let data: unknown = {};
        if (response.status !== 204) {
            // TODO: handle blob content type
            if (response.headers.get('Content-Type')?.includes('text')) {
                data = await response.text();
            } else {
                data = await response.json();
            }
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

    /** Dispatches the request error to every instance of `useRequestErrorHandler`. */
    private dispatchRequestError(error: unknown, request: Request) {
        const endpoint = this;
        window.dispatchEvent(
            new CustomEvent(events.REQUEST_ERROR, {
                detail: { error, request, endpoint },
            })
        );

        /* Keep legacy FETCH_ERROR event so we don't break old code. */
        if (isFetchError(error)) {
            window.dispatchEvent(
                new CustomEvent(events.FETCH_ERROR, { detail: error })
            );
        }
    }
}

function mergeHeaders(a: Headers, b: Headers) {
    b.forEach((value, name) => {
        a.append(name, value);
    });
    return a;
}
