import * as React from 'react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { endpoints } from '../models/endpoints';
import { isFetchError } from '../../../src';
import { useHistory } from 'react-router-dom';
import { TokenPair } from '../models/types';
import { Screen } from './Screen';
import { useAuth } from '../auth/AuthProvider';

export function LoginScreen() {
    const history = useHistory();
    const auth = useAuth();

    const mutation = useMutation(endpoints.token.fetch, {
        onSuccess(tokenPair: TokenPair) {
            auth.login(tokenPair);
            history.push('/dashboard');
        },
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Screen public>
            {isFetchError(mutation.error) && (
                <div style={{ backgroundColor: '#f88d8d' }}>
                    {mutation.error.response.status === 401
                        ? 'Usuario o contraseña incorrectos'
                        : `Error ${mutation.error.response.status}`}
                </div>
            )}

            <form
                onSubmit={event => {
                    event.preventDefault();
                    mutation.mutate({
                        email,
                        password,
                    });
                }}
            >
                <label>Correo electrónico</label>
                <input
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    style={{ display: 'block' }}
                />

                <label>Contraseña</label>
                <input
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    style={{ display: 'block' }}
                />

                <button type="submit" disabled={mutation.isLoading}>
                    {mutation.isLoading ? 'Iniciando sesión' : 'Iniciar sesión'}
                </button>
            </form>
        </Screen>
    );
}
