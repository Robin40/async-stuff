import 'react-app-polyfill/ie11';
import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Thing } from '../.';
import { Server } from '../src/Server';
import {
    any,
    array,
    boolean,
    coerce,
    define,
    Describe,
    Infer,
    instance,
    integer,
    number,
    object,
    string,
} from 'superstruct';
import { Decimal } from 'decimal.js';
import { LocalDate } from 'js-joda';

const decimal = () => coerce(instance(Decimal), string(), s => new Decimal(s));
// const localDate = () => coerce(instance(LocalDate as any), string(), s => LocalDate.parse(s));

const server = new Server(
    'https://yfxit29sub.execute-api.us-west-1.amazonaws.com/dev/'
);

const morosidades = server.endpoint.getAll(
    'documentos/morosidades',
    array(
        object({
            monto: decimal(),
            divisa: string(),
            pagado: boolean(),
            id: integer(),
        })
    )
);

const login = server.endpoint.post<
    { rut: string },
    { token: string; id: number }
>(
    'login/persona',
    object({
        token: string(),
        id: number(),
    })
);

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
