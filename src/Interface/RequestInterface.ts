import {IncomingMessage} from 'http';

export default interface RequestInterface extends IncomingMessage {
    query: {[key: string]: string};
}
