import RequestInterface from '../Interface/RequestInterface';
import ResponseInterface from '../Interface/ResponseInterface';
import Event from './Event';

export default class HTTPEvent extends Event {
    public constructor(public readonly request: RequestInterface, public readonly response: ResponseInterface) {
        super();
    }
}
