import {Container} from 'inversify';
import {EventEmitter} from 'events';

import RequestInterface from './Interface/RequestInterface';
import ResponseInterface from './Interface/ResponseInterface';

export default class Kernel {
    private container: Container;

    public constructor(private readonly environment: string = 'production', private readonly debug: boolean = false) {
    }

    public async build(request: RequestInterface, response: ResponseInterface): Promise<void> {
        this.container = new Container({defaultScope: 'Singleton'});
        this.container.bind<Kernel>(Kernel.toString()).toConstantValue(this);
        this.container.bind<RequestInterface>('Request').toConstantValue(request);
        this.container.bind<ResponseInterface>('Response').toConstantValue(response);
        this.container.bind<NodeJS.EventEmitter>('Dispatcher').toConstantValue(new EventEmitter());
    }

    public getContainer(): Container {
        return this.container;
    }
}
