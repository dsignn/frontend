import {Auth} from './authentication/Auth';
import {Container} from '@dsign/library/src/container/Container';
import {ContainerAggregate} from '@dsign/library/src/container/ContainerAggregate';
import {AbstractHydrator} from '@dsign/library/src/hydrator/AbstractHydrator';
import {PropertyHydrator} from '@dsign/library/src/hydrator/PropertyHydrator';
import {HydratorStrategy} from '@dsign/library/src/hydrator/strategy/value/HydratorStrategy';
import {XmlhAdapter} from '@dsign/library/src/storage/adapter/xmlh/XmlhAdapter';
import {CallbackBuilder} from '@dsign/library/src/storage/adapter/xmlh/url/CallbackBuilder';
import {EntityNestedReference} from '@dsign/library/src/storage/entity/EntityNestedReference';
import {EntityReference} from '@dsign/library/src/storage/entity/EntityReference';
import {EntityIdentifier} from '@dsign/library/src/storage/entity/EntityIdentifier';
import {JsAclAdapter} from '@dsign/library/src/permission/acl/adapter/js-acl/JsAclAdapter';
import {Acl} from '@dsign/library/src/permission/acl/Acl';
import {Localize} from '@dsign/library/src/localize/Localize';
import {JsonDecode} from '@dsign/library/src/data-transform/JsonDecode';
import {FormDataEncode} from '@dsign/library/src/data-transform/FormDataEncode';
import {Application} from '@dsign/library/src/core/Application';
import {Module} from '@dsign/library/src/core/module/Module';
import {WebComponent} from '@dsign/library/src/core/webcomponent/WebComponent';
import {AutoLoadClass} from '@dsign/library/src/core/autoload/AutoLoadClass';
import {PathGeneric} from '@dsign/library/src/path/PathGeneric';
import {mergeDeep} from '@dsign/library/src/object/Utils';
import {config} from './config';

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
let pathHydrator = new PropertyHydrator(new PathGeneric());
let moduleHydrator = new PropertyHydrator(new Module());
let webComponentHydrator = new PropertyHydrator(new WebComponent());
webComponentHydrator.addValueStrategy('path',new HydratorStrategy(pathHydrator));
let autoLoadClassHydrator = new PropertyHydrator(new AutoLoadClass());
autoLoadClassHydrator.addValueStrategy('path',new HydratorStrategy(pathHydrator));

moduleHydrator.addValueStrategy('autoloadsWs', new HydratorStrategy(webComponentHydrator));
moduleHydrator.addValueStrategy('entryPoint', new HydratorStrategy(webComponentHydrator));
moduleHydrator.addValueStrategy('autoloads', new HydratorStrategy(autoLoadClassHydrator));

/**
 * Application
 */

const application = new Application();
application.setBasePath(config.app.basePath)
    .setModulePath(`${config.app.basePath}${config.app.moduleRelativePath}`);

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

/***********************************************************************************************************************
 * Acl
 **********************************************************************************************************************/

const acl = new Acl(new JsAclAdapter(new window.JsAcl()));

acl.addRole('guest');
acl.addRole('admin');

acl.addResource('application');

acl.allow('guest', 'application', 'logout');
acl.allow('admin', 'application', 'login');

container.set('Acl', acl);

/***********************************************************************************************************************
 * Storage
 **********************************************************************************************************************/

const storageContainerAggregate = new ContainerAggregate();
storageContainerAggregate.setPrototipeClass(Storage);
storageContainerAggregate.setContainer(container);

container.set('StorageContainerAggregate', storageContainerAggregate);

/***********************************************************************************************************************
 * Auth
 **********************************************************************************************************************/

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

/***********************************************************************************************************************
 * Localize
 **********************************************************************************************************************/

container.set('Localize', new Localize(
    config.localize.defaultLanguage,
    config.localize.languages
));

/***********************************************************************************************************************
 * Notify
 **********************************************************************************************************************/

container.set('Notify', {
    notify:  (text) => {

        let id = 'notification';
        let paperToast = document.getElementById(id);
        if (!paperToast) {
            console.warn('Element by id ' + id + ' not found');
            return;
        }

        paperToast.text = text;
        paperToast.open();
    }
});

/***********************************************************************************************************************
 * Entity container aggregate
 **********************************************************************************************************************/

const entityContainerAggregate = new ContainerAggregate();
entityContainerAggregate.setPrototipeClass(EntityIdentifier);
entityContainerAggregate.setContainer(container);

entityContainerAggregate.set(
    'EntityNestedReference',
    new EntityNestedReference()
);

entityContainerAggregate.set(
    'EntityReference',
    new EntityReference()
);

container.set('EntityContainerAggregate', entityContainerAggregate);

/***********************************************************************************************************************
 * Hydrator container aggregate
 **********************************************************************************************************************/

const hydratorContainerAggregate = new ContainerAggregate();
hydratorContainerAggregate.setPrototipeClass(AbstractHydrator);
hydratorContainerAggregate.setContainer(container);

container.set('HydratorContainerAggregate', hydratorContainerAggregate);

window.container = container;