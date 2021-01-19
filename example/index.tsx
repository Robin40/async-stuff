import 'react-app-polyfill/ie11';
import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Server } from '../src';
import { array } from 'superstruct';
import { models } from '../models';
import { LoginOnlyRut, LoginResponse } from './types';

const server = new Server(
    'https://yfxit29sub.execute-api.us-west-1.amazonaws.com/dev/'
);

const login = server.endpoint.post<LoginOnlyRut, LoginResponse>(
    'login/persona',
    models.LoginResponse()
);

const morosidades = server.endpoint.getAll(
    'documentos/morosidades',
    array(models.Morosidad())
);

const voucherPagination = server.endpoint.getAll(
    'voucher/persona',
    models.VoucherPagination()
);

const App = () => {
    useEffect(() => {
        morosidades.fetch().then(console.log);

        login.fetch({ rut: 'blah' }).then(console.log);

        voucherPagination.fetch().then(console.log);
    }, []);

    return <div>See console logs</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
