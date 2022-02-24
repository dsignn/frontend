import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";

/**
 * @class OrderEntity
 */
export class OrderEntity extends EntityIdentifier { 

    static get STATUS_CHECK() {
        return 'check';
    }

    static get STATUS_QUEUE() {
        return 'queue';
    }

    static get STATUS_PREPARATION() {
        return 'preparation';
    }

    static get  STATUS_DELIVERING() {
        return 'delivering';
    }

    static get STATUS_CLOSE() {
        return 'close';
    }

    static get STATUS_INVALID() {
        return 'invalid';
    }

    constructor() {
        super();
        /**
         * @type {Array}
         */
        this.items = [];

        this.status;

        this.createdAt;

        this.lastUpdateAt;

        this.organization = {};

        this.additionalInfo = {};
    }
}