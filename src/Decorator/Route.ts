import 'reflect-metadata';

import * as query from 'micro-query';

import ActionInterface from '../Action/ActionInterface';
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

        let response;
        try {
            dispatcher.emit('request', [req, res], target);
            response = await kernel.getContainer().resolve<ActionInterface>(target).invoke();
            dispatcher.emit('response', [req, res], target, response);
        } catch (e) {
            dispatcher.emit('exception', [req, res], target, response);
            if (!res.headersSent) {
                throw e;
            }
        }
    };

    Reflect.defineMetadata('action:route:src', url, newTarget);
    Reflect.defineMetadata('action:route:dest', dest, newTarget);

    return newTarget;
};

export default Route;
