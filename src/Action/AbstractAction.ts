import {inject, injectable} from 'inversify';
import {send} from 'micro';
import * as redirect from 'micro-redirect';

import RequestInterface from '../Interface/RequestInterface';
import ResponseInterface from '../Interface/ResponseInterface';

import ActionInterface from './ActionInterface';

@injectable()
export default abstract class AbstractAction implements ActionInterface {
    @inject('Request')
    protected request: RequestInterface;

    @inject('Response')
    protected response: ResponseInterface;

    public abstract invoke(): Promise<void>;

    public async send(data: any, statusCode: number = 200): Promise<void> {
        return send(this.response, statusCode, data);
    }

    public async redirect(location: string, statusCode: number = 301): Promise<void> {
        return redirect(this.response, statusCode, location);
    }

    public async error(message: any, statusCode: number = 500): Promise<void> {
        return send(this.response, statusCode, message);
    }

    public async exception(error: Error, statusCode: number = 500, message?: string): Promise<void> {
        console.error(error);

        return this.error(message || error.message, statusCode);
    }
}
