import * as React from 'react';
import { useHistory } from 'react-router-dom';

export function Forbidden() {
    const history = useHistory();

    return (
        <div>
            <p>No tienes permisos suficientes para acceder a esta pantalla.</p>
            <button onClick={() => history.push('/')}>Ir al inicio</button>
        </div>
    );
}
