import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";

/**
 * @class OrderEntity
 */
export class OrderEntity extends EntityIdentifier { 

    /**
     * Status can order dishes
     *
     * @return {string}
     */
     static get STATUS_VALIDATING() { return 'validating'; }

    /**
     * Status can order dishes
     *
     * @return {string}
     */
    static get STATUS_CAN_ORDER() { return 'can-order'; }

    /**
     * Status order queue
     *
     * @return {string}
     */
    static get STATUS_QUEUE() { return 'queue'; }

    /**
     * Status order in preparation
     *
     * @return {string}
     */
    static get STATUS_PREPARATION() { return 'preparation'; }

    /**
     * Status order on delivering
     *
     * @return {string}
     */
    static get  STATUS_DELIVERING() { return 'delivering'; }

    /**
     * Status order close
     *
     * @return {string}
     */
    static get STATUS_CLOSE() { return 'close'; }

    /**
     * Status order ivalid
     *
     * @return {string}
     */
    static get STATUS_INVALID() { return 'invalid'; }

  
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