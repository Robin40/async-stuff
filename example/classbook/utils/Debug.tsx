import * as React from 'react';

export function Debug(props: { value: unknown }) {
    try {
        return <pre>{JSON.stringify(props.value, null, '    ')}</pre>;
    } catch (error) {
        console.log(props.value);
        return <pre>???</pre>;
    }
}
