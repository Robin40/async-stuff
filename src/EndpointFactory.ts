import { Server } from './Server';
import { Describe } from 'superstruct';
import { Endpoint } from './Endpoint';
import { Url } from './urlUtils';
import _ from 'lodash';
import { PossibleId } from './types';

export interface EndpointConfig<ResponseData> {
    headers?(): HeadersInit;
    mock?: ResponseData;
}

export class EndpointFactory {
    constructor(private server: Server) {}

    post<RequestBody, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>,
        config?: EndpointConfig<ResponseData>
    ): Endpoint<[RequestBody], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'POST',
            path,
            urlWithParams: Url.withTrailingSlash,
            hasRequestBody: true,
            struct,
            ...config,
        });
    }

    getAll<ResponseData>(
        path: string,
        struct?: Describe<ResponseData>,
        config?: EndpointConfig<ResponseData>
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
        config?: EndpointConfig<ResponseData>
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
        config?: EndpointConfig<ResponseData>
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
        config?: EndpointConfig<ResponseData>
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
        config?: EndpointConfig<ResponseData>
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
