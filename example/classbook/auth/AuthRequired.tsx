import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Forbidden } from './Forbidden';
import { useAuth } from './AuthProvider';
import { useRequestErrorHandler } from '../../../src';

export function AuthRequired(props: PropsWithChildren<{}>) {
    const { pathname } = useLocation();
    const auth = useAuth();
    const isAuthorized = pathname !== '/admin';

    useSessionExpiredHandler();

    if (!auth.isLoggedIn) {
        return <Redirect to="/login" />;
    } else if (!isAuthorized) {
        return <Forbidden />;
    } else {
        return <React.Fragment>{props.children}</React.Fragment>;
    }
}

function useSessionExpiredHandler() {
    const auth = useAuth();

    useRequestErrorHandler(
        {
            onDjangoTokenError() {
                window.alert(
                    'Su sesión expiró. Debe iniciar sesión nuevamente.'
                );
                auth.logout();
            },
        },
        { once: true }
    );
}
