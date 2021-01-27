import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bearer, Endpoint, JsonStorage, Server, useJsonStorage } from '../src';
import { array } from 'superstruct';
import { models } from './models';
import { LoginOnlyRut, LoginResponse } from './types';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
} from 'react-query';
import _ = require('lodash');

const queryClient = new QueryClient();

const authStorage = new JsonStorage(
    'async-stuff.example.auth',
    models.LoginResponse()
);

const server = new Server(
    'https://yfxit29sub.execute-api.us-west-1.amazonaws.com/dev/',
    {
        headers: () => Bearer(authStorage.get()?.token),
    }
);

const loginPersona = server.endpoint.post<LoginOnlyRut, LoginResponse>(
    'login/persona',
    models.LoginResponse()
);

async function login(credentials: LoginOnlyRut) {
    const tokenAndId = await loginPersona.fetch(credentials);
    authStorage.set(tokenAndId);
}

function logout() {
    authStorage.clear();
}

const morosidades = server.endpoint.getAll(
    'documentos/morosidades',
    array(models.Morosidad()),
    {
        headers: () => ({
            'Dani-Example': Math.random() < 0.5 ? 'Persona' : 'Corredor',
        }),
    }
);

const voucherPagination = server.endpoint.getAll(
    'voucher/persona',
    models.VoucherPagination()
);

const App = () => {
    const user = useJsonStorage(authStorage);
    const loginMutation = useMutation(login);
    const credentials = { rut: 'placeholder' };

    if (!user) {
        return (
            <div>
                <button onClick={() => loginMutation.mutate(credentials)}>
                    Log in
                </button>
                <Debug value={loginMutation} />
            </div>
        );
    }

    return (
        <div>
            <button onClick={logout}>Log out</button>
            <div style={{ display: 'flex' }}>
                <Test endpoint={morosidades} />
                <Test endpoint={voucherPagination} />
            </div>
        </div>
    );
};

function Test({ endpoint }: { endpoint: Endpoint<any, any> }) {
    const query = useQuery(endpoint.url, endpoint.fetch);
    return <Debug value={query} />;
}

function Debug({ value }: { value: any }) {
    return (
        <pre style={{ flex: 1 }}>
            {JSON.stringify(value, null, _.repeat(' ', 4))}
        </pre>
    );
}

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
    document.getElementById('root')
);
