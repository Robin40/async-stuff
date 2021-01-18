import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Thing } from '../.';
import { useEffect } from 'react';
import { Endpoint } from '../src/Endpoint';

const endpoint = Endpoint.getAll(
    'https://yfxit29sub.execute-api.us-west-1.amazonaws.com/dev/documentos/morosidades'
);

const App = () => {
    useEffect(() => {
        endpoint.fetch().then(console.log);
    }, []);

    return (
        <div>
            <Thing />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
