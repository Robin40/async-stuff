import autoBind from "auto-bind";
import { fetchWithInferredContentType, RequestInitWith } from "./inferContentType";
import { Url } from "./urlUtils";

/** An object that represents a REST resource,
 * with methods to make requests using REST verbs. */
export class Resource<Item extends WithOptionalId> {
    /** You should create these objects by using `server.resource`
     * instead of creating them directly. */
    constructor(readonly url: string) {
        // this allows to pass Resource methods as functions
        autoBind(this);
    }

    /** GET a list of all items. Returns a promise to an array. */
    async getAll(): Promise<Array<WithId<Item>>> {
        return Resource.fetch(this.url, {
            method: 'GET',
        });
    }

    /** GET the item of the given `id`. */
    async get(id: NonNullable<Item['id']>): Promise<WithId<Item>> {
        return Resource.fetch(this.urlWith(id), {
            method: 'GET',
        });
    }

    /** POST a new item with the data passed as `body`. */
    async post(body: Omit<Item, 'id'>): Promise<WithId<Item>> {
        return Resource.fetch(Url.withTrailingSlash(this.url), {
            method: 'POST',
            body,
        });
    }

    /** PATCH the item of the given `id` with the data passed as `body`. */
    async patch(
        id: NonNullable<Item['id']>,
        body: Partial<Omit<Item, 'id'>>
    ): Promise<WithId<Item>> {
        return Resource.fetch(this.urlWith(id), {
            method: 'PATCH',
            body,
        });
    }

    /** DELETE the item of the given `id`. */
    async delete(id: NonNullable<Item['id']>): Promise<void> {
        return Resource.fetch(this.urlWith(id), {
            method: 'DELETE',
        });
    }

    private static async fetch<ResponseData, RequestBody = undefined>(
        url: string,
        init: RequestInitWith<RequestBody> | Omit<RequestInit, 'body'>
    ): Promise<ResponseData> {
        const response = await fetchWithInferredContentType(url, init);

        if (!response.ok) {
            throw new FetchError(response, init.method ?? 'GET');
        }

        // assume the response will be a JSON. This is not actually always correct.
        return response.json();
    }

    /** Returns the `url` associated to this resource if the resource has the given id. */
    private urlWith(id: number | string): string {
        const urlWithId = Url.join(this.url, `${id}`); // [1]

        if (id == null) {
            throw new Error(
                `Attempted to make a request to an URL with non-existent id: "${urlWithId}"`
            );
        }

        return urlWithId;

        /* [1]: `id` may be `null` or `undefined` by accident so we
         *      do string interpolation instead of `.toString()`. */
    }
}

/** An error thrown by fetches made by a resource object.
 * It contains the response object returned by `fetch`. */
export class FetchError extends Error {
    constructor(readonly response: Response, method: string) {
        super(`${response.status} error thrown by ${method} to ${response.url}`);
    }
}

/** An interface satisfied by objects representing a
 * REST resource that may have or not its own id. */
export interface WithOptionalId {
    id?: number | string;
}

/** A wrapper that guarantees that the id of
 * the given Item type is always present. */
export type WithId<Item extends WithOptionalId> = Item & {
    id: NonNullable<Item['id']>;
};