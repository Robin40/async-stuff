import * as React from 'react';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Forbidden } from './Forbidden';
import { useAuth } from './AuthProvider';
import { events, FetchError } from '../../../src';
import { endpoints } from '../models/endpoints';
import { isTokenError } from '../utils/isTokenError';

export function AuthRequired(props: PropsWithChildren<{}>) {
    const { pathname } = useLocation();
    const auth = useAuth();
    const isAuthorized = pathname !== '/admin';

    useVerifySessionEffect();

    if (!auth.isLoggedIn) {
        return <Redirect to="/login" />;
    } else if (!isAuthorized) {
        return <Forbidden />;
    } else {
        return <React.Fragment>{props.children}</React.Fragment>;
    }
}

function useVerifySessionEffect() {
    const auth = useAuth();

    function onSessionExpired() {
        window.alert('Su sesión expiró. Debe iniciar sesión nuevamente.');
        auth.logout();
    }

    useEffect(() => {
        function onFetchError(event: CustomEvent<FetchError>) {
            if (isTokenError(event.detail)) {
                onSessionExpired();
            }
        }

        window.addEventListener(events.FETCH_ERROR, onFetchError, {
            once: true,
        });
        return function cleanup() {
            window.removeEventListener(events.FETCH_ERROR, onFetchError);
        };
    }, []);
}
