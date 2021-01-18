import { CrudMethod } from './types';
import { fetchWithInferredContentType } from './inferContentType';
import _ from 'lodash';
import { FetchError } from './Resource';
import { Url } from './urlUtils';
import autoBind from 'auto-bind';
import { create, Describe } from 'superstruct';

export class Endpoint<Params extends any[], ResponseData> {
    private constructor(
        readonly method: CrudMethod,
        readonly url: string,
        private urlWithParams: (url: string, ...params: Params) => string,
        private hasRequestBody: boolean,
        private struct?: Describe<ResponseData>
    ) {
        // this allows to pass Endpoint methods as functions
        autoBind(this);
    }

    static post<RequestBody, ResponseData>(
        url: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[RequestBody], ResponseData> {
        return new Endpoint('POST', url, Url.withTrailingSlash, true, struct);
    }

    static getAll<ResponseData>(
        url: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[], ResponseData> {
        return new Endpoint('GET', url, _.identity, false, struct);
    }

    static get<Id extends PossibleId, ResponseData>(
        url: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[Id], ResponseData> {
        return new Endpoint('GET', url, Url.withId, false, struct);
    }

    static put<Id extends PossibleId, RequestBody, ResponseData>(
        url: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[Id, RequestBody], ResponseData> {
        return new Endpoint('PUT', url, Url.withId, true, struct);
    }

    static patch<Id extends PossibleId, RequestBody, ResponseData>(
        url: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[Id, RequestBody], ResponseData> {
        return new Endpoint('PATCH', url, Url.withId, true, struct);
    }

    static delete<Id extends PossibleId, ResponseData>(
        url: string,
        struct?: Describe<ResponseData>
    ): Endpoint<[Id], ResponseData> {
        return new Endpoint('DELETE', url, Url.withId, false, struct);
    }

    async fetch(...params: Params): Promise<ResponseData> {
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

type PossibleId = number | string;
