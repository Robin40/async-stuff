import { Server } from './Server';
import { Describe } from 'superstruct';
import { Endpoint } from './Endpoint';
import { Url } from './urlUtils';
import _ from 'lodash';
import { PossibleId } from './types';

export interface EndpointConfig<FetchParams extends any[], ResponseData> {
    headers?(): HeadersInit;

    mock?: ResponseData | ((...params: FetchParams) => ResponseData);

    shouldRetry?(
        attemptCount: number,
        error: unknown
    ): Promise<boolean | undefined>;
}

export class EndpointFactory {
    constructor(private server: Server) {}

    post<RequestBody, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>,
        config?: EndpointConfig<[RequestBody], ResponseData>
    ): Endpoint<[RequestBody], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'POST',
            path,
            urlWithParams: _.identity,
            hasRequestBody: true,
            struct,
            ...config,
        });
    }

    getAll<ResponseData>(
        path: string,
        struct?: Describe<ResponseData>,
        config?: EndpointConfig<[], ResponseData>
    ): Endpoint<[], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'GET',
            path,
            urlWithParams: _.identity,
            hasRequestBody: false,
            struct,
            ...config,
        });
    }

    get<Id extends PossibleId, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>,
        config?: EndpointConfig<[Id], ResponseData>
    ): Endpoint<[Id], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'GET',
            path,
            urlWithParams: Url.withId,
            hasRequestBody: false,
            struct,
            ...config,
        });
    }

    put<Id extends PossibleId, RequestBody, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>,
        config?: EndpointConfig<[Id, RequestBody], ResponseData>
    ): Endpoint<[Id, RequestBody], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'PUT',
            path,
            urlWithParams: Url.withId,
            hasRequestBody: true,
            struct,
            ...config,
        });
    }

    patch<Id extends PossibleId, RequestBody, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>,
        config?: EndpointConfig<[Id, RequestBody], ResponseData>
    ): Endpoint<[Id, RequestBody], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'PATCH',
            path,
            urlWithParams: Url.withId,
            hasRequestBody: true,
            struct,
            ...config,
        });
    }

    delete<Id extends PossibleId, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>,
        config?: EndpointConfig<[Id], ResponseData>
    ): Endpoint<[Id], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'DELETE',
            path,
            urlWithParams: Url.withId,
            hasRequestBody: false,
            struct,
            ...config,
        });
    }
}
