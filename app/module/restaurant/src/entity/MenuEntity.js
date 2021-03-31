import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";

/**
 * @class MenuEntity
 */
export class MenuEntity extends EntityIdentifier {

    static get STATUS_DEFAULT() {
        return 'indoor';
    }

    static get STATUS_DELIVERY() {
        return 'delivery';
    }

    static get STATUS_DATE() {
        return 'date';
    }

    static get STATUS_DISABLE() {
        return 'disable';
    }


    constructor() {
        super();

        /**
         * @type {string}
         */
        this.name = '';

        /**
         * @type {string}
         */
        this.backgroundHeader = '#015b63';

        /**
         * @type {string}
         */
        this.colorHeader = '#ffffff';

        /**
         * @type {string}
         */
        this.status = MenuEntity.STATUS_DISABLE;

        /**
         * @type {Array}
         */
        this.items = [];

        /**
         * @type {string}
         */
        this.layoutType = 'dsign-menu-item-image';

        /**
         *
         * @type {{}}
         */
        this.organization = {};
    }

    /**
     * @param menuItem
     */
    appendMenuItem(menuItem) {
        this.items.push(menuItem);
    }

}