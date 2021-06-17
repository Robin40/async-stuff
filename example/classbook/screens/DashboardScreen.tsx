import * as React from 'react';
import { useQuery } from 'react-query';
import { endpoints } from '../models/endpoints';
import { Screen } from './Screen';
import { Debug } from '../utils/Debug';
import { authStorage } from '../auth/authStorage';
import { useJsonStorage } from '../../../src';

export function DashboardScreen() {
    const as = useJsonStorage(authStorage);
    const query = useQuery(endpoints.whoAmI.url, endpoints.whoAmI.fetch);

    function expireAccessToken() {
        authStorage.patch({
            accessToken: 'EXPIRED',
        });
    }

    function expireRefreshToken() {
        authStorage.patch({
            refreshToken: 'EXPIRED',
        });
    }

    return (
        <Screen>
            {query.isLoading && <p>Cargando...</p>}
            {query.error && <Debug value={query.error} />}
            {query.data && <Debug value={query.data} />}

            <Debug value={as} />

            <button onClick={expireAccessToken}>
                Simular expiración de access token
            </button>

            <button onClick={expireRefreshToken}>
                Simular expiración de refresh token
            </button>
        </Screen>
    );
}
