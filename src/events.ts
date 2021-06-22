import { FetchError } from './FetchError';

export const events = {
    FETCH_ERROR: '@tdc-cl/async-stuff::FetchError',
} as const;

/** A workaround for https://github.com/microsoft/TypeScript/issues/28357.
 * It also makes custom event types to show up in IDE auto-complete. */
declare global {
    // noinspection JSUnusedGlobalSymbols
    interface WindowEventMap {
        [events.FETCH_ERROR]: CustomEvent<FetchError>;
    }
}
