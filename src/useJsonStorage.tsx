import { JsonStorage } from './JsonStorage';
import { useEffect, useMemo, useState } from 'react';

export function useJsonStorage<T>(jsonStorage: JsonStorage<T>): T | undefined {
    const initialData = useMemo(jsonStorage.get, []);
    const [data, setData] = useState(initialData);
    useEffect(() => {
        jsonStorage.subscribe(setData);
    }, []);
    return data;
}
