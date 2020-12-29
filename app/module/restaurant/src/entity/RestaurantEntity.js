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

    /**
     * @returns {boolean}
     */
    hasQrCode () {
        let has = false;
        if (this.qrCode && this.qrCode.id && this.qrCode.id && typeof this.qrCode.id === 'string' && this.qrCode.id.length > 0) {
            has = true;
        }
        return has;
    }
}