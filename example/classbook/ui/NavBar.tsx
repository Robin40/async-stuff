import * as React from 'react';
import { useAuth } from '../auth/AuthProvider';

export function NavBar() {
    const auth = useAuth();

    return (
        <nav>
            {auth.isLoggedIn && (
                <button onClick={auth.logout}>Cerrar sesión</button>
            )}
        </nav>
    );
}
