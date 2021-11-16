import { Endpoint, Server } from '../../src';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import React = require('react');
import { DateTimeFormatter, LocalDate } from 'js-joda';
import { object } from 'superstruct';

const indicatorsServer = new Server('https://mindicador.cl/api');
const endpoint = new Endpoint<[string, LocalDate], object>({
    server: indicatorsServer,
    method: 'GET',
    path: '/:name/:chileanDate/',
    urlWithParams(url, name, date: LocalDate) {
        const chileanDateFormatter = DateTimeFormatter.ofPattern('dd-MM-yyyy');

        return url
            .replace(':name', name)
            .replace(':chileanDate', date.format(chileanDateFormatter));
    },
    hasRequestBody: false,
    struct: object() as any,
    async parseResponseData(response: Response) {
        return await response.json();
    },
});

const queryClient = new QueryClient();

export function MindicadorExample() {
    return (
        <QueryClientProvider client={queryClient}>
            <CurrentScreen />
        </QueryClientProvider>
    );
}

function CurrentScreen() {
    const query = useQuery('queryKey', () =>
        endpoint.fetch('uf', LocalDate.now())
    );

    return <pre>{JSON.stringify(query, null, 4)}</pre>;
}
