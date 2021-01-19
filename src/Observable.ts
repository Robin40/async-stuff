/** @internal */
export class Observable<T> {
    private observers = new Set<Observer<T>>();

    subscribe(callback: NotificationCallback<T>): UnsubscribeFunction {
        const ob = new Observer(callback);
        this.observers.add(ob);
        return () => this.observers.delete(ob);
    }

    notify(data: T) {
        this.observers.forEach(o => o.notify(data));
    }
}

class Observer<T> {
    constructor(readonly notify: NotificationCallback<T>) {}
}

export type NotificationCallback<T> = (data: T) => void;
export type UnsubscribeFunction = () => void;
