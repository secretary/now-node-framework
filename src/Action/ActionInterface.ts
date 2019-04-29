import {IncomingMessage, ServerResponse} from 'http';
import {interfaces} from 'inversify';

export default interface ActionInterface {
    invoke(): Promise<void>;
}
