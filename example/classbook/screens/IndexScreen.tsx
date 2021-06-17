import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export function IndexScreen() {
    const auth = useAuth();

    if (auth.isLoggedIn) {
        return <Redirect to="/dashboard" />;
    } else {
        return <Redirect to="/login" />;
    }
}
