import { FetchError } from './FetchError';
import { StructError } from 'superstruct';
import { useEffect, useRef } from 'react';
import { events } from './events';
import {
    isDjangoTokenError,
    isFetchError,
    isNetworkError,
    isStructError,
} from './utils/errorTypeGuards';

export type RequestErrorHandler<T> = (
    detail: { error: T; request: Request },
    event: CustomEvent<T>
) => void;

interface Handlers {
    onAnyError: RequestErrorHandler<unknown>;
    onBadResponseError: RequestErrorHandler<FetchError>;
    onDjangoTokenError: RequestErrorHandler<FetchError>;
    onNetworkError: RequestErrorHandler<TypeError>;
    onStructError: RequestErrorHandler<StructError>;
    onUnknownError: RequestErrorHandler<unknown>;
}

/** A hook that allows handling request errors for any endpoint from a single place.
 *
 * - `onAnyError` will be called no matter what the cause of the error is.
 * - `onBadResponseError` will be called if there is a backend response with a bad status code (400-599).
 * - `onDjangoTokenError` will be called if there is a "token invalid or expired" error (401)
 * that comes from Django Rest Framework's JWT authentication.
 * - `onNetworkError` will be called if the request don't even reach the backend (e.g. internet connection problems).
 * - `onStructError` will be called if the backend response is OK (200-299) but the JSON data is not valid against the
 * endpoint `struct`.
 * - `onUnknownError` will be called if the error is an exception not covered by any of the previous cases.
 * */
export function useRequestErrorHandler(
    handlers: Partial<Handlers>,
    options?: AddEventListenerOptions
) {
    /* Always use the latest version of the handlers callbacks
     * to match the expected intuitive behavior when the handlers
     * depend on variables that may change. */
    const handlersRef = useRef(handlers);
    useEffect(() => {
        handlersRef.current = handlers;
    }, [handlers]);

    /* Add an event listener of the internal event that is triggered
     * on a request error. This listener will dispatch to the
     * appropriate handler(s) depending on the error type. */
    useEffect(() => {
        function listener(event: CustomEvent) {
            const error = event.detail.error;

            handlersRef.current.onAnyError?.(event.detail, event);
            if (isFetchError(error)) {
                handlersRef.current.onBadResponseError?.(event.detail, event);
                if (isDjangoTokenError(error)) {
                    handlersRef.current.onDjangoTokenError?.(
                        event.detail,
                        event
                    );
                }
            } else if (isNetworkError(error)) {
                handlersRef.current.onNetworkError?.(event.detail, event);
            } else if (isStructError(error)) {
                handlersRef.current.onStructError?.(event.detail, event);
            } else {
                handlersRef.current.onUnknownError?.(event.detail, event);
            }
        }

        window.addEventListener(events.REQUEST_ERROR, listener, options);
        return function cleanup() {
            window.removeEventListener(events.REQUEST_ERROR, listener, options);
        };
    }, []);
}
