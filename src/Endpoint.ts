import { CrudMethod } from './types';
import { fetchWithInferredContentType } from './inferContentType';
import _ from 'lodash';
import { FetchError } from './Resource';
import { Url } from './urlUtils';
import autoBind from 'auto-bind';
import { create, Describe } from 'superstruct';
import { Server } from './Server';

/** @internal
 * An object with all the parameters received by the Endpoint constructor. */
export interface EndpointParams<FetchParams extends any[], ResponseData> {
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

    private server = this.params.server;
    private method = this.params.method;
    private path = this.params.path;
    private urlWithParams = this.params.urlWithParams;
    private hasRequestBody = this.params.hasRequestBody;
    private struct = this.params.struct;

    private url = Url.join(this.server.apiUrl, this.path);

    async fetch(...params: FetchParams): Promise<ResponseData> {
        const url = this.urlWithParams(this.url, ...params);

        const response = await fetchWithInferredContentType(url, {
            method: this.method,
            body: this.hasRequestBody ? _.last(params) : undefined,
        });

        if (!response.ok) {
            throw new FetchError(response, this.method);
        }

        // assume the response will be a JSON. This is not actually always correct.
        let data = await response.json();

        if (this.struct) {
            data = create(data, this.struct);
        }

        return data;
    }
}
