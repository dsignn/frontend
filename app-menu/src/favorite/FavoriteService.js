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

        /**
         * @type {EventManager}
         */
        this.eventManager = new EventManager();

        /**
         * @type {Storage}
         */
        this.storage = storage;

        /**
         * @type Object
         */
        this.favoriteItem = {};

        this.setMenu(menu);
    }

    /**
     * @param id
     * @private
     */
    _loadFavoriteMenu(id) {
        this.storage.get(id).then((data) => {
            console.log('CARICA FAVORITE', data);
            if(data) {
                this.favoriteItem = data
            } else {
                this.favoriteItem = {
                    id: this.menu.organization.id,
                    items: []
                }
            }
        });
    }

    /**
     * @param menu
     * @returns {FavoriteService}
     */
    setMenu(menu) {
        this.menu = menu;
        this._loadFavoriteMenu(this.menu.organization._id);
        return this;
    }

    /**
     * @returns {{}|*}
     */
    getMenu() {
        return this.menu;
    }

    /**
     * @param {object} menuItem
     * @returns {FavoriteService}
     */
    addFavorite(menuItem) {
        console.log('ADD', this.hasFavorite(menuItem));
        if (this.hasFavorite(menuItem.id)) {
            let intMenuItem = this.getFavorite(menuItem.id);
            console.log('TROVATO', intMenuItem);
            intMenuItem.count++;
        } else {
            console.log('NON TROVATO');
            menuItem.count = 1;
            this.favoriteItem.items.push(menuItem);
        }
        this.storage.update(this.favoriteItem);
        return this;
    }

    /**
     * @param {object} menuItem
     * @returns {FavoriteService}
     */
    removeFavorite(menuItem) {
        if (this.hasFavorite(menuItem.id)) {
            let intMenuItem = this.getFavorite(menuItem.id);
            if (intMenuItem.count > 0) {
                intMenuItem.count--;
                this.storage.update(this.favoriteItem);
            }
        }

        return this;
    }

    /**
     * @param {string} id
     * @returns {boolean}
     */
    hasFavorite(id) {
        return this.favoriteItem.items.findIndex((element) => {
            return element.id === id;
        }) > -1;
    }

    /**
     * @param {string} id
     * @returns {object}
     */
    getFavorite(id) {
        return this.favoriteItem.items.find((element) => {
            return element.id === id;
        });
    }
}