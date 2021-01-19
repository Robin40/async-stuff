/** An error thrown by fetches made by a resource object.
 * It contains the response object returned by `fetch`. */
export class FetchError extends Error {
    constructor(readonly response: Response, method: string) {
        super(
            `${response.status} error thrown by ${method} to ${response.url}`
        );
    }
}
