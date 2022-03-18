import {Container} from '@dsign/library/src/container/Container';
import {Localize} from '@dsign/library/src/localize/Localize';
import {Storage} from '@dsign/library/src/storage/Storage';
import {LocalStorageAdapter} from '@dsign/library/src/storage/adapter/local-storage/LocalStorageAdapter';
import {PropertyHydrator} from '@dsign/library/src/hydrator';
import {OrderEntity} from './src/module/order/entity/OrderEntity';
import {OrderService} from './src/module/order/service/OrderService';
import {DateStrategy} from './src/hydrator/strategy/value/DateStrategy'
import { XmlhLocalStorageAdapter } from './src/storage/adapter/XmlhLocalStorageAdapter';
import { XmlhAdapter } from '@dsign/library/src/storage/adapter/xmlh/XmlhAdapter';
import { JsonDecode } from '@dsign/library/src/data-transform/JsonDecode';
import { JsonEncode } from '@dsign/library/src/data-transform/JsonEncode';
import { DefaultBuilder } from '@dsign/library/src/storage/adapter/xmlh/url/DefaultBuilder';

const container = new Container();

/**
 * Config
 */
container.set('config', configApp);

/**
 * @type {Localize}
 */
container.set('Localize', new Localize(
    "it",
    [
        "it",
        "en"
    ]
));

/**
 * ORDER STORAGE
 */

let orderLocalStorageAdapter = new LocalStorageAdapter('dsign', 'order');
orderLocalStorageAdapter.setIdentifier('id');
orderLocalStorageAdapter.setFilterCallback(function(filter) {

    let dataToReturn = this.data;

    if (filter.restaurantId) {
        dataToReturn = this.data.filter((element) => {
            return element.organization.id === filter.restaurantId;
        })
    }

    if (filter.name) {
        dataToReturn = this.data.filter((element) => {
            return element.name.match(new RegExp(filter.name, 'i'));
        })
    } 

    if (filter.currenteSelected) {
        dataToReturn = this.data.filter((element) => {
            return element.currenteSelected;
        })
    }

    dataToReturn.sort((ele1, ele2) => {
         if (ele1.createdAt < ele2.createdAt) {
             return 1;
         } else {
             return -1;
         }
    });

    return dataToReturn;
}.bind(orderLocalStorageAdapter));

let orderXmlhStorageAdapter = new XmlhAdapter(
    container.get('config').apiUrl,
   'order',
    new JsonEncode(),
    new JsonDecode(),
    new DefaultBuilder()
);

orderXmlhStorageAdapter.addHeader('Content-Type', 'application/json')
    .addHeader('Accept', 'application/json');

let orderXmlhLocalStorageAdapter = new XmlhLocalStorageAdapter(
    orderXmlhStorageAdapter,
    orderLocalStorageAdapter
);

/**
 * @type {Storage}
 */
const orderStorage = new Storage(orderXmlhLocalStorageAdapter);

let hydrator = new PropertyHydrator();
hydrator.setTemplateObjectHydration(new OrderEntity);
hydrator.addValueStrategy('createdAt', new DateStrategy());

orderStorage.setHydrator(hydrator);

container.set('OrderStorage', orderStorage);

/**
 * Order service
 */

let service = new OrderService(orderStorage);


setInterval(
    service.pollingCurrentOrder.bind(service), 
    8000
);

container.set('OrderService', service);


window.container = container;

var loadMenuApp = function() {
    var menu = document.querySelector('dsign-menu');
    if (!menu) {
    var ele = document.createElement('dsign-menu');
    document.body.appendChild(ele);
    }
};

window.addEventListener('load', function() {
   loadMenuApp();
});

// When page dont trigge load event
setTimeout(
    function() { loadMenuApp(); },
    3000
);

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
