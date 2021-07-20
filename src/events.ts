import { FetchError } from './FetchError';

export const events = {
    FETCH_ERROR: '@tdc-cl/async-stuff::FetchError',

    /** A custom event type that is triggered when a request to an endpoint fails for any reason.
     * This is used internally by `useRequestErrorHandler`. */
    REQUEST_ERROR: '@tdc-cl/async-stuff::RequestError',
} as const;

/** A workaround for https://github.com/microsoft/TypeScript/issues/28357.
 * It also makes custom event types to show up in IDE auto-complete. */
declare global {
    // noinspection JSUnusedGlobalSymbols
    interface WindowEventMap {
        [events.FETCH_ERROR]: CustomEvent<FetchError>;
        [events.REQUEST_ERROR]: CustomEvent<{
            error: unknown;
            request: Request;
        }>;
    }
}
