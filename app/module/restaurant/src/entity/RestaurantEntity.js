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
         * @type {object}
         */
        this.qrCode = {};

        /**
         * @type {object}
         */
        this.qrCodeDelivery = {};

        /**
         * @type {object}
         */
        this.whatsappPhone = {};

        /**
         * @type {object}
         */
        this.address = {};
    }

    /**
     * @returns {boolean}
     */
    hasQrCode () {
        let has = false;
        if (this.qrCode && this.qrCode.id && typeof this.qrCode.id === 'string' && this.qrCode.id.length > 0) {
            has = true;
        }
        return has;
    }

    /**
     * @returns {boolean}
     */
    hasQrCodeDelivery () {
        let has = false;
        if (this.qrCodeDelivery && this.qrCodeDelivery.id && typeof this.qrCodeDelivery.id === 'string' && this.qrCodeDelivery.id.length > 0) {
            has = true;
        }
        return has;
    }
}