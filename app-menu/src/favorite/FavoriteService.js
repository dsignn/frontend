import {EventManager} from '@dsign/library/src/event/EventManager.js';
import {EventManagerAware} from '@dsign/library/src/event/EventManagerAware.js';

/**
 * @class Flatten
 */
export class FavoriteService extends EventManagerAware {

    /**
     * @param storage
     * @param menu
     */
    constructor(storage, menu) {
        super();
        this.storage = storage;
        this.menu = menu;
        this.eventManager = new EventManager();
    }

    /**
     *
     * @param menu
     * @returns {FavoriteService}
     */
    setMenu(menu) {
        this.menu = menu;
        return this;
    }

    /**
     * @returns {{}|*}
     */
    getMenu() {
        return this.menu;
    }

    add() {
        console.log('ADD');
    }
}