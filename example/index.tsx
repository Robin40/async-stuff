import 'react-app-polyfill/ie11';
import * as React from 'react';
import { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { MapfreExample } from './mapfre/MapfreExample';
import { ClassBookExample } from './classbook/ClassBookExample';
import { MindicadorExample } from './mindicador/MindicadorExample';

// noinspection JSUnusedGlobalSymbols
const examples = {
    ClassBookExample,
    MapfreExample,
    MindicadorExample,
};

function Nothing() {
    return null;
}

export default function App() {
    const [selectedExample, setSelectedExample] = useState(
        localStorage.getItem('selectedExample') ?? ''
    );
    const SelectedExample = examples[selectedExample] ?? Nothing;

    useEffect(() => {
        localStorage.setItem('selectedExample', selectedExample);
    }, [selectedExample]);

    return (
        <div>
            <select
                value={selectedExample}
                onChange={event => setSelectedExample(event.target.value)}
            >
                <option value="">-- Select example --</option>
                {Object.keys(examples).map(example => (
                    <option value={example} key={example}>
                        {example}
                    </option>
                ))}
            </select>

            <SelectedExample />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
