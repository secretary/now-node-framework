export default class Event {
    private propagationStopped: boolean = false;

    public isPropagationStopped(): boolean {
        return this.propagationStopped;
    }

    public stopPropagation(): void {
        this.propagationStopped = true;
    }
}
