import {EntityIdentifier} from "@dsign/library/src/storage/entity/EntityIdentifier";

/**
 * @class OrganizationEntity
 */
export class OrganizationEntity extends EntityIdentifier {

    constructor() {
        super();

        /**
         * @type {string|null}
         */
        this.name = null;
    }
}