import { create, Describe, StructError } from 'superstruct';

export class JsonStorage<T> {
    constructor(private key: string, private struct: Describe<T>) {}

    set(data: T) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    clear() {
        localStorage.removeItem(this.key);
    }

    patch(update: Partial<T>) {
        const prev = this.get();
        if (prev == null) {
            console.error('Attempted to patch an empty or invalid JsonStorage');
            return;
        }

        this.set({ ...prev, ...update });
    }

    get(): T | undefined {
        const serializedData = localStorage.getItem(this.key);

        /* Handle the case when there is nothing stored. */
        if (serializedData == null) {
            return undefined;
        }

        /* Parse the serialized data as JSON. */
        let jsonData: unknown;
        try {
            jsonData = JSON.parse(serializedData);
        } catch (err) {
            if (err instanceof SyntaxError) {
                this.onInvalidData();
                return undefined;
            }
            throw err;
        }

        /* Pass the JSON object thru SuperStruct. */
        try {
            return create(jsonData, this.struct);
        } catch (err) {
            if (err instanceof StructError) {
                console.error(err);
                this.onInvalidData();
                return undefined;
            }
            throw err;
        }
    }

    onInvalidData() {
        localStorage.removeItem(this.key);
    }
}
