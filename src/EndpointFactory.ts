import { Server } from './Server';
import { Describe } from 'superstruct';
import { Endpoint } from './Endpoint';
import { Url } from './urlUtils';
import _ from 'lodash';
import { PossibleId } from './types';

export class EndpointFactory {
    constructor(private server: Server) {}

    post<RequestBody, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[RequestBody], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'POST',
            path,
            urlWithParams: Url.withTrailingSlash,
            hasRequestBody: true,
            struct,
        });
    }

    getAll<ResponseData>(
        path: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'GET',
            path,
            urlWithParams: _.identity,
            hasRequestBody: false,
            struct,
        });
    }

    get<Id extends PossibleId, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[Id], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'GET',
            path,
            urlWithParams: Url.withId,
            hasRequestBody: false,
            struct,
        });
    }

    put<Id extends PossibleId, RequestBody, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[Id, RequestBody], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'PUT',
            path,
            urlWithParams: Url.withId,
            hasRequestBody: true,
            struct,
        });
    }

    patch<Id extends PossibleId, RequestBody, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[Id, RequestBody], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'PATCH',
            path,
            urlWithParams: Url.withId,
            hasRequestBody: true,
            struct,
        });
    }

    delete<Id extends PossibleId, ResponseData>(
        path: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[Id], ResponseData> {
        return new Endpoint({
            server: this.server,
            method: 'DELETE',
            path,
            urlWithParams: Url.withId,
            hasRequestBody: false,
            struct,
        });
    }
}
