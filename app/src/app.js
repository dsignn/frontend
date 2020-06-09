import {Container} from '@dsign/library/src/container/Container.js';
import {PropertyHydrator} from '@dsign/library/src/hydrator/PropertyHydrator.js';
import {HydratorStrategy} from '@dsign/library/src/hydrator/strategy/value/HydratorStrategy.js';
import {XmlhAdapter} from '@dsign/library/src/storage/adapter/xmlh/XmlhAdapter.js';
import {CallbackBuilder} from '@dsign/library/src/storage/adapter/xmlh/url/CallbackBuilder.js';
import {JsAclAdapter} from '@dsign/library/src/permission/acl/adapter/js-acl/JsAclAdapter.js';
import {Acl} from '@dsign/library/src/permission/acl/Acl.js';
import {JsonDecode} from '@dsign/library/src/data-transform/JsonDecode.js';
import {FormDataEncode} from '@dsign/library/src/data-transform/FormDataEncode.js';
import {Application} from './core/Application.js';
import {Module} from './core/module/Module.js';
import {WebComponent} from './core/webcomponent/WebComponent.js';
import {mergeDeep} from './object/Merge.js';
import {config} from './config';
import {Auth} from './authentication/Auth';


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
 * Container
 */

const container = new Container();

const merge = {};
merge.merge = mergeDeep;
container.set('merge', merge);

container.set(
    'config',
    config
);

/**
 * Module Hydrator
 */

let moduleHydrator = new PropertyHydrator(new Module());

let webComponentHydrator = new PropertyHydrator(new WebComponent());

moduleHydrator.addValueStrategy('autoloadsWs', new HydratorStrategy(webComponentHydrator));
moduleHydrator.addValueStrategy('entryPoint', new HydratorStrategy(webComponentHydrator));

/**
 * Application
 */

const application = new Application();
application.setBasePath('.')
    .setModulePath('http://127.0.0.1:8081/src/module');

let modules = [];
config.modules.forEach(function(module, index) {
    modules.push(moduleHydrator.hydrate(module));
});

application.loadModules(modules, container);

application.getEventManager().on(
    Application.BOOTSTRAP_MODULE,
    (data) => {

        setTimeout(
            () => {
                container.get('Acl').setRole('guest');
                container.get('Auth').init();
            },
            300
        );
        let element = document.createElement('dsign-app');
        document.body.appendChild(element);

    }
);

container.set(
    'Application',
    application
);

/**
 * Acl
 */

const acl = new Acl(new JsAclAdapter(new window.JsAcl()));

acl.addRole('guest');
acl.addRole('admin');

acl.addResource('application');

acl.allow('guest', 'application', 'logout');
acl.allow('admin', 'application', 'login');

container.set(
    'Acl',
    acl
);

/**
 * Auth
 */

let callbackBuilder = new CallbackBuilder();
callbackBuilder.addCallback(
    'GET',
    (rootPath, path, method, id, data) => {
        return `${rootPath}/me`
    }
).addCallback(
    'POST',
    (rootPath, path, method, id, data) => {
        return `${rootPath}/access-token`
    }
);

let storage = new XmlhAdapter(
    container.get('config')['rest']['path'],
    container.get('config')['rest']['resources']['auth']['name'],
    new FormDataEncode(),
    new JsonDecode(),
    callbackBuilder
);

storage.addHeader(   'Content-Type', 'application/json', 'GET')
    .addHeader(    'Accept', 'application/json', 'GET');

const auth = new Auth(storage,  container.get('config')['rest']['resources']['auth']['options']);

auth.eventManager.on(
    Auth.IDENTITY(),
    (identity) => {
        acl.setRole(identity.data["role_id"]);
    }
);

auth.eventManager.on(
    Auth.IDENTITY(),
    (evt) => {
        acl.setRole(evt.data['role_id']);
    }
);

auth.eventManager.on(
    Auth.LOGOUT(),
    (evt) => {
        acl.setRole('guest');
    }
);

container.set(
    'Auth',
    auth
);

//auth.login('antonino.visalli@gmail.com', 'suca');

window.container = container;