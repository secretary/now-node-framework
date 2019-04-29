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

        return kernel.getContainer().resolve<ActionInterface>(target).invoke();
    };

    Reflect.defineMetadata('action:route:src', url, newTarget);
    Reflect.defineMetadata('action:route:dest', dest, newTarget);

    return newTarget;
};

export default Route;
