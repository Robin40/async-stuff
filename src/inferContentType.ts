import _ from 'lodash';

/** A version of the `fetch` function that allows `body` to be a
 * JS object (or a FormData), and infers the Content-Type based on it. */
export async function fetchWithInferredContentType<RequestBody>(
    url: string,
    init: RequestInitWith<RequestBody>
): Promise<Response> {
    return fetch(requestWithInferredContentType(url, init));
}

/** Makes a Request object where the Content-Type is inferred by a `body`
 * that can be a JS object, a FormData, or nothing. */
export function requestWithInferredContentType<RequestBody>(
    url: string,
    init: RequestInitWith<RequestBody>
): Request {
    /* If a `body` was not passed, we don't need to infer the Content-Type */
    if (_.isUndefined(init.body)) {
        return new Request(url, init as any);
    }

    /* If a `FormData` object is passed, `fetch` can infer the Content-Type */
    if (init.body instanceof FormData) {
        return new Request(url, init as any);
    }

    return requestWithJsonContentType(url, init);
}

/** Makes a Request object where the Content-Type is always
 * JSON and the body is passed as an object instead of JSON.stringify. */
function requestWithJsonContentType<RequestBody>(
    url: string,
    init: RequestInitWith<RequestBody>
): Request {
    let headers = new Headers(init.headers); // [1]
    headers.append('Content-Type', 'application/json');

    return new Request(url, {
        ...init,
        headers,
        body: JSON.stringify(init.body),
    });

    /* [1]: init.headers can take multiple shapes: a plain JS object,
     * an array of tuples, or a `Headers` instance. So the first step
     * is to normalize init.headers so it is always a `Headers` instance. */
}

/** A version of the `RequestInit` object from the fetch API but
 * with an arbitrary object of type `RequestBody` passed to `body`.
 *
 * This allows to extend `fetch` to accept JSON objects directly
 * instead of doing `body: JSON.stringify(obj)`. */
export interface RequestInitWith<RequestBody>
    extends Omit<RequestInit, 'body'> {
    body: RequestBody;
}
