import 'react-app-polyfill/ie11';
import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Thing } from '../.';
import { Server } from '../src/Server';

const server = new Server(
    'https://yfxit29sub.execute-api.us-west-1.amazonaws.com/dev/'
);

const morosidades = server.endpoint.getAll('documentos/morosidades');

const login = server.endpoint.post<
    { rut: string },
    { token: string; id: number }
>('login/persona');

const App = () => {
    useEffect(() => {
        morosidades.fetch().then(console.log);
        login.fetch({ rut: 'blah' }).then(console.log);
    }, []);

    return (
        <div>
            <Thing />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
