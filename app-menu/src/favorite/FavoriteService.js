/**
 * @class FavoriteService
 */
export class FavoriteService {

    /**
     * @param storage
     * @param menu
     */
    constructor(storage, menu) {

        /**
         * @type {Storage}
         */
        this.storage = storage;

        /**
         * @type Object
         */
        this.favoriteItem = [];

        this.setMenu(menu);
    }

    /**
     * @param id
     * @private
     */
    _loadFavoriteMenu(id) {
        this.storage.getAll(id).then((data) => {

            if(data) {
                this.favoriteItem = data
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
     * @return {EventManagerInterface}
     */
    getEventManager() {
        return this.storage.getEventManager();
    }

    /**
     * @param {object} menuItem
     * @returns {FavoriteService}
     */
    addFavorite(menuItem) {

        if (this.hasFavorite(menuItem.id)) {
            let intMenuItem = this.getFavorite(menuItem.id);
            intMenuItem.totalCount++;
            menuItem = intMenuItem;
        } else {
            menuItem.totalCount = 1;
            menuItem.currentCount = 0;
            menuItem.restaurantId = this.getMenu().id;
            this.favoriteItem.push(menuItem);
        }

        this.storage.update(menuItem);
        return this;
    }

    /**
     * @param {object} menuItem
     * @returns {FavoriteService}
     */
    removeFavorite(menuItem) {
        if (this.hasFavorite(menuItem.id)) {
            let intMenuItem = this.getFavorite(menuItem.id);
            if (intMenuItem.totalCount > 0) {
                intMenuItem.totalCount--;
                this.storage.update(intMenuItem);
            }
        }

        return this;
    }

    /**
     * @param menuItem
     * @returns {Promise<any>}
     */
    upsertFavorite(menuItem) {
        return this.storage.update(menuItem);
    }

    /**
     * @param menuItem
     * @returns {Promise<any>}
     */
    deleteFavorite(menuItem) {
        return this.storage.delete(menuItem);
    }

    /**
     * @param {string} id
     * @returns {boolean}
     */
    hasFavorite(id) {
        return this.favoriteItem.findIndex((element) => {
            return element.id === id;
        }) > -1;
    }

    /**
     * @param {string} id
     * @returns {object}
     */
    getFavorite(id) {
        return this.favoriteItem.find((element) => {
            return element.id === id;
        });
    }

    /**
     * @returns {number}
     */
    getAmount() {
        let amount = 0;
        for (let index = 0; this.favoriteItem.length > index; index++) {
            amount = amount + (this.favoriteItem[index].price.value * this.favoriteItem[index].totalCount);
        }

        return amount
    }

    /**
     * @returns {Promise}
     */
    getFavorites() {
        // TODO add filter
        return this.storage.getAll();
    }
}