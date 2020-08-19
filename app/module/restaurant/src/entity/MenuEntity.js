import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";

/**
 * @class MenuEntity
 */
export class MenuEntity extends EntityIdentifier {


    constructor() {
        super();

        /**
         * @type {string}
         */
        this.name = '';

        /**
         * @type {string}
         */
        this.backgroundHeader = '#009688';

        /**
         * @type {string}
         */
        this.colorHeader = 'clear';

        /**
         * @type {boolean}
         */
        this.enable = false;

        /**
         * @type {Array}
         */
        this.items = [];

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