import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";

/**
 * @class MenuEntity
 */
export class MenuEntity extends EntityIdentifier {

    static get TYPE_INDOOR() {
        return 'indoor';
    }

    static get TYPE_DELIVERY() {
        return 'delivery';
    }

    static get TYPE_DAILY() {
        return 'date';
    }

    static get STATUS_DISABLE() {
        return 'disable';
    }

    static get STATUS_ENABLE() {
        return 'enable';
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
         * @type {string}
         */
        this.type = MenuEntity.TYPE_INDOOR;


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