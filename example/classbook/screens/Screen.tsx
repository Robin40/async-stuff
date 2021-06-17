import * as React from 'react';
import { PropsWithChildren } from 'react';
import { AuthRequired } from '../auth/AuthRequired';
import { NavBar } from '../ui/NavBar';

export function Screen(
    props: PropsWithChildren<{
        public?: boolean;
        Layout?: React.FC<PropsWithChildren<{}>>;
    }>
) {
    const Layout = props.Layout ?? DefaultLayout;

    let screen = <Layout>{props.children}</Layout>;

    if (!props.public) {
        screen = <AuthRequired>{screen}</AuthRequired>;
    }

    return screen;
}

function DefaultLayout(props: PropsWithChildren<{}>) {
    return (
        <React.Fragment>
            <NavBar />
            <main style={{ padding: '1em' }}>{props.children}</main>
        </React.Fragment>
    );
}
