# Now Framework for NodeJS

Need to update these

 ### Usage
 
1. Create actions that extend `src/Action/AbstractAction.ts` or implement `src/Action/ActionInterface.ts`
2. Put the `src/Decorator/Route.ts` decoration on your actions.
3. Run `./node_modules/.bin/buildNowJson path/to/my/actions`
    * For monolithic apps, have this installed in the sub-repo, and run `./api/node_modules/.bin/buildNowJson api/src/Route` as an example

Ideally, you'd be able to just add something to your now config, but until they support `now.js`, that wont be possible


### example

```typescript
// api/src/Route/HelloAction.ts

import {AbstractAction, Route} from '@secretary/now-node-framework';

@Route('/api/hello/(.*)', '?name=$1')
export default class HelloAction extends AbstractAction {
    public invoke(): Promise<void> {
        return this.send('Hello ' + this.request.query.name);
    }
}
```

And then this gets auto-generated
```json
{
    "name": "monorepo",
    "version": 2,
    "builds": [
        {
            "src": "www/package.json",
            "use": "@now/next"
        },
        {
            "src": "api/src/Action/HelloAction.ts",
            "use": "@now/node"
        }
    ],
    "routes": [
        {
            "src": "/api/hello/(.*)",
            "dest": "/api/src/Action/HelloAction.ts?name=$1"
        },
        {
            "src": "/(.*)",
            "dest": "/www/$1",
            "headers": {
                "x-request-path": "$1"
            }
        }
    ]
}
```
