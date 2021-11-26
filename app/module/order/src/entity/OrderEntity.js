import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";

/**
 * @class OrderEntity
 */
export class OrderEntity extends EntityIdentifier { 

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
    }
}