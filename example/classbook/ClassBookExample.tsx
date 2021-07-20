import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { DashboardScreen } from './screens/DashboardScreen';
import { LoginScreen } from './screens/LoginScreen';
import { IndexScreen } from './screens/IndexScreen';
import { AuthProvider } from './auth/AuthProvider';
import { AdminScreen } from './screens/AdminScreen';
import { NotFound404Screen } from './screens/NotFound404Screen';
import { useRequestErrorHandler } from '../../src';

const queryClient = new QueryClient();

export function ClassBookExample() {
    useRequestErrorHandler({
        onStructError(detail) {
            console.log({ detail });
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CurrentScreen />
            </AuthProvider>
        </QueryClientProvider>
    );
}

function CurrentScreen() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <IndexScreen />
                </Route>
                <Route path="/login">
                    <LoginScreen />
                </Route>
                <Route path="/dashboard">
                    <DashboardScreen />
                </Route>
                <Route path="/admin">
                    <AdminScreen />
                </Route>
                <Route path="*">
                    <NotFound404Screen />
                </Route>
            </Switch>
        </Router>
    );
}
