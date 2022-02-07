import { Server } from './Server';
import { Describe } from 'superstruct';
import { Endpoint } from './Endpoint';
import { Url } from './urlUtils';
import _ from 'lodash';
import { PossibleId } from './types';
import qs from 'qs';

export interface EndpointConfig<FetchParams extends any[], ResponseData> {
    name?: string;

    headers?(): HeadersInit;

    mock?: ResponseData | ((...params: FetchParams) => ResponseData);

    shouldRetry?(
        attemptCount: number,
        error: unknown
    ): Promise<boolean | undefined>;

    parseResponseData?(response: Response): Promise<unknown>;

    trailingSlash?: boolean;
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

    getAll<ResponseData, TQueryParams extends object = {}>(
        path: string,
        struct?: Describe<ResponseData>,
        config?: EndpointConfig<[], ResponseData>
    ): Endpoint<[queryParams?: TQueryParams], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'GET',
            path,
            urlWithParams(url: string, queryParams?: TQueryParams) {
                return queryParams ? `${url}?${qs.stringify(queryParams)}` : url;
            },
            trailingSlash: false,
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
