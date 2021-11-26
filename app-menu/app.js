import {Container} from '@dsign/library/src/container/Container';
import {Localize} from '@dsign/library/src/localize/Localize';
import {Storage} from '@dsign/library/src/storage/Storage';
import {LocalStorageAdapter} from '@dsign/library/src/storage/adapter/local-storage/LocalStorageAdapter';
import {PropertyHydrator} from '@dsign/library/src/hydrator';
import {OrderEntity} from './src/order/entity/OrderEntity';
import {OrderService} from './src/order/service/OrderService';
import {DateStrategy} from './src/hydrator/strategy/value/DateStrategy'

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

let adapter = new LocalStorageAdapter('dsign', 'favorite');

adapter.setFilterCallback(function(filter) {
    if (filter.restaurantId) {
        return this.data.filter((element) => {
            return element.restaurantId === filter.restaurantId;
        })
    }

    return this.data;;
}.bind(adapter));

/**
 * @type {Storage}
 */
const menuStorage = new Storage(adapter);

container.set('MenuStorage', menuStorage);

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

/**
 * @type {Storage}
 */
const orderStorage = new Storage(orderLocalStorageAdapter);

let hydrator = new PropertyHydrator();
hydrator.setTemplateObjectHydration(new OrderEntity);
hydrator.addValueStrategy('createdAt', new DateStrategy());

orderStorage.setHydrator(hydrator);

container.set('OrderStorage', orderStorage);

/**
 * Order service
 */

 container.set('OrderService', new OrderService(orderStorage))


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
