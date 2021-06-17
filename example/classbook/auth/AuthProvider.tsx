import * as React from 'react';
import { createContext, PropsWithChildren, useContext } from 'react';
import { TokenPair } from '../models/types';
import { useJsonStorage } from '../../../src';
import { authStorage } from './authStorage';

export interface IAuthContext {
    accessToken?: string;
    refreshToken?: string;
    isLoggedIn: boolean;
    login(tokenPair: TokenPair): void;
    logout(): void;
}

export const AuthContext = createContext<IAuthContext>(null!);

export function AuthProvider(props: PropsWithChildren<{}>) {
    const auth = useJsonStorage(authStorage);

    const accessToken = auth?.accessToken;
    const refreshToken = auth?.refreshToken;
    const isLoggedIn = accessToken != null;

    function login(tokenPair: TokenPair) {
        authStorage.set({
            accessToken: tokenPair.access,
            refreshToken: tokenPair.refresh,
        });
    }

    function logout() {
        authStorage.clear();
    }

    const context = {
        accessToken,
        refreshToken,
        isLoggedIn,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={context}>
            {props.children}
        </AuthContext.Provider>
    );
}

export function useAuth(): IAuthContext {
    return useContext(AuthContext);
}
