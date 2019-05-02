import AbstractListener from './AbstractListener';
import Event from './Event';

export default class Dispatcher {
    private readonly eventsMap = new Map();

    public on(eventName: string, listener: AbstractListener): () => void {
        this.getListeners(eventName).add(listener);

        return this.off.bind(this, eventName, listener);
    }

    public off(eventName: string, listener: AbstractListener): void {
        this.getListeners(eventName).delete(listener);
    }

    public once(eventName: string, listener: AbstractListener): void {
        let off;
        const wrappedInvoke = listener.invoke;
        listener.invoke = (event: Event) => {
            off();

            wrappedInvoke(event);
        };

        off = this.on(eventName, listener);
    }

    public async emit<T extends Event>(eventName: string, event: T): Promise<T> {
        const listeners = Array.from(this.getListeners(eventName).values())
                              .sort((a, b) => a.priority - b.priority);

        await Promise.resolve();
        for (const listener of listeners) {
            await listener.invoke(event);

            if (event.isPropagationStopped()) {
                break;
            }
        }

        return event;
    }

    private getListeners(eventName: string): Set<AbstractListener> {
        if (!this.eventsMap.has(eventName)) {
            this.eventsMap.set(eventName, new Set<AbstractListener>());
        }

        return this.eventsMap.get(eventName);
    }
}
