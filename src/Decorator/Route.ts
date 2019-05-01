import 'reflect-metadata';
import {send} from 'micro';

import * as query from 'micro-query';

import ActionInterface from '../Action/ActionInterface';
import HTTPEvent from '../Event/HTTPEvent';
import HTTPExceptionEvent from '../Event/HTTPExceptionEvent';
import RequestInterface from '../Interface/RequestInterface';
import ResponseInterface from '../Interface/ResponseInterface';
import Kernel from '../Kernel';

type newable = new(...args: any[]) => any;

const Route = (url: string, dest?: string, kernelClass: typeof Kernel = Kernel): any => (target: newable) => {
    const newTarget = async function(req: RequestInterface, res: ResponseInterface) {
        req.query    = query(req);
        const kernel = new kernelClass(process.env.NODE_ENV, process.env.NODE_ENV === 'production');
        await kernel.build(req, res);
        const dispatcher = kernel.getContainer().get<NodeJS.EventEmitter>('Dispatcher');

        let event;
        try {
            event = new HTTPEvent(req, res);
            dispatcher.emit('request', event);
            if (event.isPropagationStopped()) {
                return;
            }

            await kernel.getContainer().resolve<ActionInterface>(target).invoke();
            event = new HTTPEvent(req, res);
            dispatcher.emit('response', event);
            if (event.isPropagationStopped()) {
                return;
            }
        } catch (e) {
            event = new HTTPExceptionEvent(req, res, e);
            dispatcher.emit('exception', event);
            if (event.isPropagationStopped()) {
                return;
            }

            if (!res.headersSent) {
                console.error(e);

                return send(res, 500, e.message);
            }
        }
    };

    Reflect.defineMetadata('action:route:src', url, newTarget);
    Reflect.defineMetadata('action:route:dest', dest, newTarget);

    return newTarget;
};

export default Route;
