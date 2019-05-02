import Event from './Event';

export default abstract class AbstractListener {
    public abstract get priority(): number;
    public abstract invoke(event: Event): any | Promise<any>;
}
