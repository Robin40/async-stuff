import { FetchError, isFetchError } from '../../../src';

export function isTokenError(error: unknown): error is FetchError {
    return (
        isFetchError(error) &&
        error.response.status === 401 &&
        error.data.code === 'token_not_valid'
    );
}
