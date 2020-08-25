/**
 * @class MenuItem
 */
export class MenuItem {

    constructor() {

        /**
         * @type {{}}
         */
        this.name = {};

        /**
         * @type {{}}
         */
        this.description = {};

        /**
         * @type {string}
         */
        this.category = '';

        /**
         * @type {number}
         */
        this.price = 0;

        /**
         * @type {boolean}
         */
        this.new = false;

        /**
         * @type {Array}
         */
        this.photos = [];
    }
}