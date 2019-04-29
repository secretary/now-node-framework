import 'reflect-metadata';
import {readdirSync, writeFileSync} from 'fs';
import {resolve, join} from 'path';

if (!process.argv[1]) {
    console.error('Path to actions is required');

    process.exit(255);
}

async function main() {
    const json    = require(process.cwd() + '/now.dist.json');
    const newJson = {...json};

    const path    = resolve(process.cwd(), process.argv[1]);
    const files   = readdirSync(path);
    const actions = [];
    const routes  = [];
    for (const file of files) {
        if (/(Interface|Abstract)/.test(file)) {
            continue;
        }

        const cls       = (await import(resolve(path, file))).default;
        const routeSrc  = Reflect.getMetadata('action:route:src', cls);
        const routeDest = Reflect.getMetadata('action:route:dest', cls) || '';

        const src = join(process.argv[1], file);
        actions.push({src, use: '@now/node'});
        routes.push({src: routeSrc, dest: '/' + src + routeDest});
    }

    newJson.builds.push(...actions);
    newJson.routes.unshift(...routes);

    writeFileSync(resolve(process.cwd(), 'now.json'), JSON.stringify(newJson, null, 4));
}

main();

