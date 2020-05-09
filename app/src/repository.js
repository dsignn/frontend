window.MyAppGlobals = { rootPath: '/' };

// Load and register pre-caching Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js', {
            scope: MyAppGlobals.rootPath
        });
    });
}

/**
 * add container
 */
import {Container} from '@dsign/library/src/container/Container.js';
const container = new Container();

import {config} from './config';

container.set(
    'config',
    config
);

window.container = container;