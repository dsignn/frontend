import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";

/**
 * @class RestaurantEntity
 */
export class RestaurantEntity extends EntityIdentifier {

    constructor() {
        super();

        /**
         * @type {Number|null}
         */
        this.name = null;

        /**
         * @type {Number|null}
         */
        this.normalizeName = null;

        /**
         *
         */
        this.qrCode = {};
    }
}