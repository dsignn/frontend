import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";

/**
 * @class OrderEntity
 */
export class OrderEntity extends EntityIdentifier { 

    constructor() {
        super();

        this.id = null;

        this.name = null;
        /**
         * @type {Array}
         */
        this.items = [];

        this.status = null;
        
        this.createdAt = null;

        this.lastUpdateAt = null;

        this.organization = {};

        this.currenteSelected = false;
    }
}