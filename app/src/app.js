import {Auth} from './authentication/Auth.js';
import {Slugify} from './url/Slugify.js';
import {Container} from '@dsign/library/src/container/Container.js';
import {ContainerAggregate} from '@dsign/library/src/container/ContainerAggregate.js';
import {AbstractHydrator} from '@dsign/library/src/hydrator/AbstractHydrator.js';
import {PropertyHydrator} from '@dsign/library/src/hydrator/PropertyHydrator.js';
import {HydratorStrategy} from '@dsign/library/src/hydrator/strategy/value/HydratorStrategy.js';
import {Storage} from '@dsign/library/src/storage/Storage.js';
import {XmlhAdapter} from '@dsign/library/src/storage/adapter/xmlh/XmlhAdapter.js';
import {CallbackBuilder} from '@dsign/library/src/storage/adapter/xmlh/url/CallbackBuilder.js';
import {EntityNestedReference} from '@dsign/library/src/storage/entity/EntityNestedReference.js';
import {EntityReference} from '@dsign/library/src/storage/entity/EntityReference.js';
import {EntityIdentifier} from '@dsign/library/src/storage/entity/EntityIdentifier.js';
import {JsAclAdapter} from '@dsign/library/src/permission/acl/adapter/js-acl/JsAclAdapter.js';
import {Acl} from '@dsign/library/src/permission/acl/Acl.js';
import {Localize} from '@dsign/library/src/localize/Localize.js';
import {JsonDecode} from '@dsign/library/src/data-transform/JsonDecode.js';
import {FormDataEncode} from '@dsign/library/src/data-transform/FormDataEncode.js';
import {Application} from '@dsign/library/src/core/Application.js';
import {Module} from '@dsign/library/src/core/module/Module.js';
import {WebComponent} from '@dsign/library/src/core/webcomponent/WebComponent.js';
import {AutoLoadClass} from '@dsign/library/src/core/autoload/AutoLoadClass.js';
import {PathGeneric} from '@dsign/library/src/path/PathGeneric.js';
import {mergeDeep} from '@dsign/library/src/object/Utils.js';
import {config} from './config.js';
import {AccessTokenEntity} from './../src/oauth/entity/AccessTokenEntity.js';
import {AggregatePropertyHydrator} from "@dsign/library/src/hydrator";

console.log('test')

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
 * Slugify
 **********************************************************************************************************************/

const slugify = new Slugify();

container.set(
    'Slugify',
    slugify
);

/***********************************************************************************************************************
 * Acl
 **********************************************************************************************************************/

const acl = new Acl(new JsAclAdapter(new window.JsAcl()));

acl.addRole('guest');
acl.addRole('restaurantOwner');
acl.addRole('admin');

acl.addResource('application');

acl.allow('guest', 'application', 'logout');
acl.allow('admin', 'application', 'login');
acl.allow('restaurantOwner', 'application', 'login');

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

const authStorageAdapter = new XmlhAdapter(
    container.get('config')['rest']['path'],
    container.get('config')['rest']['resources']['auth']['name'],
    new FormDataEncode(),
    new JsonDecode(),
    callbackBuilder
);

authStorageAdapter.addHeader(   'Content-Type', 'application/json', 'GET')
    .addHeader(    'Accept', 'application/json', 'GET');

const authStorage = new Storage(authStorageAdapter);

/**
 * Set auth hydrator for oauth system Access token and User entity
 */
application.getEventManager().on(
    Application.BOOTSTRAP_MODULE,
    (data) => {

        let hydrator = new AggregatePropertyHydrator(['token_type', 'roleId']);

        hydrator.addHydratorMap(
            new PropertyHydrator(new AccessTokenEntity()),
            ["Bearer"]
        ).addHydratorMap(
             container.get('HydratorContainerAggregate').get('UserEntityHydrator'),
            ["restaurantOwner", "admin"]
        );

        authStorage.setHydrator(hydrator);
    }
);

const auth = new Auth(authStorage,  container.get('config')['rest']['resources']['auth']['options']);

auth.eventManager.on(
    Auth.IDENTITY,
    (evt) => {
        acl.setRole(evt.data.roleId);
    }
);

auth.eventManager.on(
    Auth.LOGOUT,
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

/**
 * Load Application
 */

if( document.readyState !== 'loading' ) {
    loadApplication();
} else {
    document.addEventListener('DOMContentLoaded event', () => {
        loadApplication();
    });
}

function loadApplication() {
    setTimeout(
        () => {
            application.loadModules(modules, container);
        },
        3000
    );
}