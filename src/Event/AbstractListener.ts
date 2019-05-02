import Event from './Event';

export default abstract class AbstractListener {
    public get priority(): number {
        return 0;
    };

    public abstract invoke(event: Event): any | Promise<any>;
}
