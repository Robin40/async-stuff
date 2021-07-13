import { FetchError, isFetchError, Server } from '../../../src';
import { EmailPass, TokenPair, UserInfo } from './types';
import { authStorage } from '../auth/authStorage';
import { isTokenError } from '../utils/isTokenError';

const server = new Server('https://classbook-back-dev.labs-tdc.com/api/', {
    headers() {
        const headers = new Headers();
        const token = authStorage.get()?.accessToken;
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        return headers;
    },

    async shouldRetry(attemptCount: number, error: unknown) {
        const refreshToken = authStorage.get()?.refreshToken;
        if (isTokenError(error) && refreshToken != null && attemptCount < 2) {
            const { access } = await endpoints.refreshToken.fetch({
                refresh: refreshToken,
            });
            authStorage.patch({ accessToken: access });
            return true;
        }

        return false;
    },
});

export const endpoints = {
    token: server.endpoint.post<EmailPass, TokenPair>('/token/'),
    refreshToken: server.endpoint.post<{ refresh: string }, { access: string }>(
        '/token/refresh/',
        undefined,
        {
            async shouldRetry(attemptCount: number, error: unknown) {
                if (isFetchError(error) && error.response.status === 401) {
                    return false;
                }

                return undefined;
            },
        }
    ),
    whoAmI: server.endpoint.getAll<UserInfo>('/users/WhoAmI/'),
};