import RequestInterface from '../Interface/RequestInterface';
import ResponseInterface from '../Interface/ResponseInterface';
import HTTPEvent from './HTTPEvent';

export default class HTTPExceptionEvent extends HTTPEvent {
    public constructor(request: RequestInterface, response: ResponseInterface, public readonly exception: Error) {
        super(request, response);
    }
}
