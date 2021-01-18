import { CrudMethod } from './types';
import { fetchWithInferredContentType } from './inferContentType';
import _ from 'lodash';
import { FetchError } from './Resource';
import { Url } from './urlUtils';
import autoBind from 'auto-bind';

export class Endpoint<Params extends any[], ResponseData> {
    private constructor(
        readonly method: CrudMethod,
        readonly url: string,
        private urlWithParams: (url: string, ...params: Params) => string,
        private hasRequestBody: boolean
    ) {
        // this allows to pass Endpoint methods as functions
        autoBind(this);
    }

    static post<RequestBody, ResponseData>(
        url: string
    ): Endpoint<[RequestBody], ResponseData> {
        return new Endpoint('POST', url, Url.withTrailingSlash, true);
    }

    static getAll<ResponseData>(url: string): Endpoint<[], ResponseData> {
        return new Endpoint('GET', url, _.identity, false);
    }

    static get<Id extends PossibleId, ResponseData>(
        url: string
    ): Endpoint<[Id], ResponseData> {
        return new Endpoint('GET', url, Url.withId, false);
    }

    static put<Id extends PossibleId, RequestBody, ResponseData>(
        url: string
    ): Endpoint<[Id, RequestBody], ResponseData> {
        return new Endpoint('PUT', url, Url.withId, true);
    }

    static patch<Id extends PossibleId, RequestBody, ResponseData>(
        url: string
    ): Endpoint<[Id, RequestBody], ResponseData> {
        return new Endpoint('PATCH', url, Url.withId, true);
    }

    static delete<Id extends PossibleId, ResponseData>(
        url: string
    ): Endpoint<[Id], ResponseData> {
        return new Endpoint('DELETE', url, Url.withId, false);
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
        return response.json();
    }
}

type PossibleId = number | string;
